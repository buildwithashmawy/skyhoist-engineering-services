#!/usr/bin/env node
/**
 * Push certificate + Firebase env vars from .env.local to a Vercel project.
 *
 * Prerequisites:
 *   1. npm i   (vercel CLI is a devDependency)
 *   2. npx vercel login
 *   3. npx vercel link   (select the Skyhoist project)
 *   4. Copy .env.example → .env.local and fill real values
 *
 * Usage:
 *   npm run vercel:env
 *   npm run vercel:env -- production preview development
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

const ROOT = process.cwd();
const envPath = resolve(ROOT, ".env.local");
const targets = process.argv.slice(2);
const environments =
  targets.length > 0 ? targets : ["production", "preview", "development"];

const REQUIRED = [
  "FIREBASE_SERVICE_ACCOUNT_JSON",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_UPLOAD_BACKEND",
  "CERT_ADMIN_USERNAME",
  "CERT_ADMIN_PASSWORD",
  "CERT_ADMIN_EMAIL",
  "CERT_SESSION_SECRET",
];

const OPTIONAL = ["FIREBASE_PROJECT_ID"];

function loadEnvLocal() {
  if (!existsSync(envPath)) {
    console.error("Missing .env.local — copy .env.example and fill it first.");
    process.exit(1);
  }
  const out = {};
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
    out[key] = value;
  }
  return out;
}

function vercelBin() {
  const local = resolve(ROOT, "node_modules/.bin/vercel");
  return existsSync(local) ? local : "vercel";
}

function ensureLinked() {
  const projectFile = resolve(ROOT, ".vercel/project.json");
  if (!existsSync(projectFile)) {
    console.error(
      "No .vercel/project.json — run: npx vercel link\nThen re-run this script.",
    );
    process.exit(1);
  }
}

function upsertEnv(key, value, environment) {
  // Remove existing value for this environment (ignore errors if missing).
  spawnSync(
    vercelBin(),
    ["env", "rm", key, environment, "--yes"],
    { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );

  const added = spawnSync(
    vercelBin(),
    ["env", "add", key, environment],
    {
      cwd: ROOT,
      encoding: "utf8",
      input: `${value}\n`,
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  if (added.status !== 0) {
    const err = `${added.stdout || ""}\n${added.stderr || ""}`.trim();
    throw new Error(`Failed to set ${key} (${environment}): ${err}`);
  }
  console.log(`  ✓ ${key} → ${environment}`);
}

function main() {
  ensureLinked();
  const env = loadEnvLocal();

  if (!env.FIREBASE_PROJECT_ID && env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      env.FIREBASE_PROJECT_ID = JSON.parse(
        env.FIREBASE_SERVICE_ACCOUNT_JSON,
      ).project_id;
    } catch {
      /* ignore */
    }
  }
  if (!env.FIREBASE_UPLOAD_BACKEND) env.FIREBASE_UPLOAD_BACKEND = "storage";
  if (!env.FIREBASE_STORAGE_BUCKET) {
    env.FIREBASE_STORAGE_BUCKET = "skyhoist-engineering.firebasestorage.app";
  }

  const missing = REQUIRED.filter((k) => !env[k]);
  if (missing.length) {
    console.error(`Missing in .env.local: ${missing.join(", ")}`);
    process.exit(1);
  }

  const keys = [...REQUIRED, ...OPTIONAL.filter((k) => env[k])];
  console.log(
    `Pushing ${keys.length} vars to Vercel environments: ${environments.join(", ")}`,
  );

  for (const environment of environments) {
    console.log(`\n[${environment}]`);
    for (const key of keys) {
      upsertEnv(key, env[key], environment);
    }
  }

  console.log(`
Done.

Redeploy so the new vars apply:
  npx vercel --prod
  # or click Redeploy in the Vercel dashboard
`);
}

main();
