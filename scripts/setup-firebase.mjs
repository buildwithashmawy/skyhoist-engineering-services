#!/usr/bin/env node
/**
 * Provisions Firestore collections + Storage marker for the certificate registry.
 * Requires Firebase Admin credentials in the environment:
 *   FIREBASE_SERVICE_ACCOUNT_JSON  (recommended)
 *   or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *
 * Usage: node scripts/setup-firebase.mjs
 */
import { createRequire } from "module";
import { randomBytes } from "crypto";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const require = createRequire(import.meta.url);

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
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
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    };
  }
  return null;
}

async function main() {
  const sa = parseServiceAccount();
  if (!sa) {
    console.error(`
Missing Firebase credentials.

1. Open https://console.firebase.google.com/project/skyhoist-engineering
2. Create Firestore (Native mode) + Storage if not already created
3. Project settings → Service accounts → Generate new private key
4. Put the JSON in .env.local as:

FIREBASE_SERVICE_ACCOUNT_JSON='{...paste full JSON...}'
FIREBASE_STORAGE_BUCKET=skyhoist-engineering.appspot.com
CERT_ADMIN_USERNAME=admin
CERT_ADMIN_PASSWORD='your-strong-password'
CERT_ADMIN_EMAIL=admin@skyhoistservices.com
CERT_SESSION_SECRET='long-random-secret'

5. Re-run: npm run firebase:setup
`);
    process.exit(1);
  }

  const { initializeApp, cert, getApps } = require("firebase-admin/app");
  const { getFirestore } = require("firebase-admin/firestore");
  const { getStorage } = require("firebase-admin/storage");
  const bcrypt = require("bcryptjs");

  const projectId = sa.project_id;
  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: sa.private_key,
      }),
      projectId,
      storageBucket,
    });
  }

  const db = getFirestore();
  const bucket = getStorage().bucket();

  console.log(`Project: ${projectId}`);
  console.log(`Storage bucket: ${storageBucket}`);

  // Touch marker docs so collections exist in the console.
  await db.collection("_meta").doc("certRegistry").set(
    {
      name: "Skyhoist certificate registry",
      collections: ["certUsers", "certCustomers", "certCertificates"],
      uploadPrefix: "cert-uploads",
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

  // Stable id matching src/lib/cert/ids.ts
  const { createHash } = await import("crypto");
  const hex = createHash("sha256")
    .update(`skyhoist-cert-user:${username}`)
    .digest("hex");
  const adminId = [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");

  const users = db.collection("certUsers");
  const existing = await users.doc(adminId).get();
  if (existing.exists) {
    console.log(`Admin already exists: ${username} (${adminId})`);
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

  // Ensure Storage folder marker exists
  const marker = bucket.file("cert-uploads/.keep");
  const [exists] = await marker.exists();
  if (!exists) {
    await marker.save(
      Buffer.from("Skyhoist certificate uploads\n"),
      { contentType: "text/plain", resumable: false },
    );
    console.log("Created cert-uploads/ in Storage");
  } else {
    console.log("Storage prefix cert-uploads/ already present");
  }

  console.log("\nFirebase certificate database is ready.");
  console.log("Collections: certUsers, certCustomers, certCertificates");
  console.log("Uploads:     cert-uploads/");
  if (!process.env.CERT_SESSION_SECRET) {
    console.log(
      `\nTip: set CERT_SESSION_SECRET=${randomBytes(32).toString("hex")}`,
    );
  }
}

main().catch((err) => {
  console.error("\nFirebase setup failed:");
  console.error(err?.message || err);
  if (String(err?.message || "").includes("NOT_FOUND")) {
    console.error(`
Firestore Firestore or Storage may not exist yet.
In the Firebase console for project "${process.env.FIREBASE_PROJECT_ID || "skyhoist-engineering"}":
  1. Build → Firestore Database → Create database (Native mode)
  2. Build → Storage → Get started
Then re-run this script.
`);
  }
  process.exit(1);
});
