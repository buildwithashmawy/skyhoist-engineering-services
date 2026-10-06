#!/usr/bin/env node
/**
 * Creates Firestore + Storage (if missing), seeds certificate collections,
 * and writes a Storage folder marker for project skyhoist-engineering.
 *
 * Requires:
 *   FIREBASE_SERVICE_ACCOUNT_JSON  (full service-account JSON)
 *   or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *
 * Usage: node scripts/setup-firebase.mjs
 */
import { createRequire } from "module";
import { createHash, randomBytes } from "crypto";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { resolve } from "path";
import { GoogleAuth } from "google-auth-library";

const require = createRequire(import.meta.url);

const DEFAULT_LOCATION = process.env.FIREBASE_LOCATION || "nam5";
const PROJECT_HINT = "skyhoist-engineering";

function loadEnvFile() {
  for (const name of [".env.local", ".env"]) {
    const envPath = resolve(process.cwd(), name);
    if (!existsSync(envPath)) continue;
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

loadEnvFile();

function parseServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    const parsed = JSON.parse(json);
    return {
      ...parsed,
      private_key: String(parsed.private_key || "").replace(/\\n/g, "\n"),
    };
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (projectId && clientEmail && privateKey) {
    return {
      type: "service_account",
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    };
  }
  return null;
}

function stableUserId(username) {
  const hex = createHash("sha256")
    .update(`skyhoist-cert-user:${username.toLowerCase()}`)
    .digest("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

async function getAccessToken(sa) {
  const auth = new GoogleAuth({
    credentials: sa,
    scopes: [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/datastore",
      "https://www.googleapis.com/auth/devstorage.full_control",
      "https://www.googleapis.com/auth/firebase",
    ],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) throw new Error("Could not obtain Google access token.");
  return token.token;
}

async function api(token, method, url, body) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

async function ensureFirestore(token, projectId) {
  const listUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases`;
  const listed = await api(token, "GET", listUrl);
  if (!listed.ok && listed.status !== 404) {
    throw new Error(
      `List Firestore databases failed (${listed.status}): ${JSON.stringify(listed.data)}`,
    );
  }
  const databases = listed.data?.databases || [];
  const existing = databases.find(
    (d) => d.name === `projects/${projectId}/databases/(default)`,
  );
  if (existing) {
    console.log(`Firestore (default) already exists (${existing.locationId || "unknown location"})`);
    return;
  }

  console.log(`Creating Firestore (default) in ${DEFAULT_LOCATION}…`);
  const createUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases?databaseId=(default)`;
  const created = await api(token, "POST", createUrl, {
    type: "FIRESTORE_NATIVE",
    locationId: DEFAULT_LOCATION,
  });
  if (!created.ok) {
    // Already exists race / conflict
    if (
      created.status === 409 ||
      String(created.data?.error?.status || "").includes("ALREADY_EXISTS")
    ) {
      console.log("Firestore (default) already exists.");
      return;
    }
    throw new Error(
      `Create Firestore failed (${created.status}): ${JSON.stringify(created.data)}`,
    );
  }
  console.log("Firestore create operation started:", created.data?.name || "ok");
  // Wait briefly for the long-running op
  if (created.data?.name) {
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const op = await api(
        token,
        "GET",
        `https://firestore.googleapis.com/v1/${created.data.name}`,
      );
      if (op.data?.done) {
        if (op.data.error) {
          throw new Error(`Firestore create failed: ${JSON.stringify(op.data.error)}`);
        }
        console.log("Firestore (default) is ready.");
        return;
      }
      process.stdout.write(".");
    }
    console.log("\nFirestore create still running; continuing with seed (may retry).");
  }
}

async function ensureStorageBucket(token, projectId, bucketName) {
  const getUrl = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucketName)}`;
  const got = await api(token, "GET", getUrl);
  if (got.ok) {
    console.log(`Storage bucket already exists: ${bucketName}`);
    return bucketName;
  }

  // Prefer Firebase default bucket name, then appspot, then firebasestorage.app
  const candidates = [
    bucketName,
    `${projectId}.appspot.com`,
    `${projectId}.firebasestorage.app`,
  ].filter((v, i, a) => a.indexOf(v) === i);

  for (const name of candidates) {
    console.log(`Creating Storage bucket ${name}…`);
    const createUrl = `https://storage.googleapis.com/storage/v1/b?project=${projectId}`;
    const created = await api(token, "POST", createUrl, {
      name,
      location: "US",
      storageClass: "STANDARD",
      iamConfiguration: {
        uniformBucketLevelAccess: { enabled: true },
      },
    });
    if (created.ok) {
      console.log(`Storage bucket ready: ${name}`);
      return name;
    }
    if (
      created.status === 409 ||
      String(created.data?.error?.message || "").includes("You already own")
    ) {
      console.log(`Storage bucket already exists: ${name}`);
      return name;
    }
    console.warn(`  failed (${created.status}): ${created.data?.error?.message || JSON.stringify(created.data)}`);
  }
  throw new Error(
    "Could not create a Storage bucket. Enable the Cloud Storage API in Google Cloud Console, then re-run.",
  );
}

async function main() {
  const sa = parseServiceAccount();
  if (!sa) {
    console.error(`
Missing FIREBASE_SERVICE_ACCOUNT_JSON.

Paste the service account key for project ${PROJECT_HINT}, then re-run:
  npm run firebase:setup
`);
    process.exit(1);
  }

  const projectId = sa.project_id;
  if (!projectId) throw new Error("Service account JSON is missing project_id.");

  // Persist credentials for firebase-admin + optional CLI use in this session
  const keyPath = resolve(process.cwd(), ".firebase-service-account.json");
  writeFileSync(keyPath, JSON.stringify(sa, null, 2), { mode: 0o600 });
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
  process.env.FIREBASE_PROJECT_ID = projectId;

  console.log(`Project: ${projectId}`);
  const token = await getAccessToken(sa);

  await ensureFirestore(token, projectId);

  const preferredBucket =
    process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;
  const bucketName = await ensureStorageBucket(token, projectId, preferredBucket);
  process.env.FIREBASE_STORAGE_BUCKET = bucketName;

  const { initializeApp, cert, getApps } = require("firebase-admin/app");
  const { getFirestore } = require("firebase-admin/firestore");
  const { getStorage } = require("firebase-admin/storage");
  const bcrypt = require("bcryptjs");

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: sa.private_key,
      }),
      projectId,
      storageBucket: bucketName,
    });
  }

  const db = getFirestore();
  const bucket = getStorage().bucket();

  await db.collection("_meta").doc("certRegistry").set(
    {
      name: "Skyhoist certificate registry",
      collections: ["certUsers", "certCustomers", "certCertificates"],
      uploadPrefix: "cert-uploads",
      storageBucket: bucketName,
      provisionedAt: new Date().toISOString(),
    },
    { merge: true },
  );
  console.log("Wrote _meta/certRegistry");

  const username = (process.env.CERT_ADMIN_USERNAME || "admin").toLowerCase();
  const password = process.env.CERT_ADMIN_PASSWORD || "SkyhoistAdmin1";
  const email = (
    process.env.CERT_ADMIN_EMAIL || "admin@skyhoistservices.com"
  ).toLowerCase();
  const adminId = stableUserId(username);
  const users = db.collection("certUsers");
  const existing = await users.doc(adminId).get();
  if (existing.exists) {
    console.log(`Admin already exists: ${username}`);
  } else {
    await users.doc(adminId).set({
      id: adminId,
      fullName: "Skyhoist Admin",
      username,
      email,
      role: "admin",
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
      createdById: null,
    });
    console.log(`Seeded admin user: ${username}`);
  }

  const marker = bucket.file("cert-uploads/.keep");
  const [exists] = await marker.exists();
  if (!exists) {
    await marker.save(Buffer.from("Skyhoist certificate uploads\n"), {
      contentType: "text/plain",
      resumable: false,
    });
    console.log("Created cert-uploads/ in Storage");
  } else {
    console.log("Storage prefix cert-uploads/ already present");
  }

  // Keep a local env fragment the agent / user can copy into Vercel
  const envLocalPath = resolve(process.cwd(), ".env.local");
  const sessionSecret =
    process.env.CERT_SESSION_SECRET || randomBytes(32).toString("hex");
  const fragment = [
    `FIREBASE_PROJECT_ID=${projectId}`,
    `FIREBASE_STORAGE_BUCKET=${bucketName}`,
    `FIREBASE_SERVICE_ACCOUNT_JSON='${JSON.stringify(sa)}'`,
    `CERT_ADMIN_USERNAME=${username}`,
    `CERT_ADMIN_PASSWORD=${password}`,
    `CERT_ADMIN_EMAIL=${email}`,
    `CERT_SESSION_SECRET=${sessionSecret}`,
    "",
  ].join("\n");
  if (!existsSync(envLocalPath)) {
    writeFileSync(envLocalPath, fragment, { mode: 0o600 });
    console.log("Wrote .env.local (gitignored)");
  } else {
    console.log(".env.local already present — not overwritten");
  }

  console.log("\nFirebase certificate database is linked.");
  console.log("Collections: certUsers, certCustomers, certCertificates");
  console.log(`Uploads:     gs://${bucketName}/cert-uploads/`);
}

main().catch((err) => {
  console.error("\nFirebase setup failed:");
  console.error(err?.message || err);
  process.exit(1);
});
