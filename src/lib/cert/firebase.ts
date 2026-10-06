import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

export type FirebaseServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function parseServiceAccount(): FirebaseServiceAccount | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      const parsed = JSON.parse(json) as FirebaseServiceAccount;
      if (parsed.project_id && parsed.client_email && parsed.private_key) {
        return {
          ...parsed,
          private_key: parsed.private_key.replace(/\\n/g, "\n"),
        };
      }
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
    }
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

export function isFirebaseConfigured() {
  return Boolean(parseServiceAccount() || process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

let app: App | null = null;

function getApp() {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0]!;
    return app;
  }

  const serviceAccount = parseServiceAccount();
  if (serviceAccount) {
    const storageBucket =
      process.env.FIREBASE_STORAGE_BUCKET ||
      `${serviceAccount.project_id}.appspot.com`;
    app = initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      projectId: serviceAccount.project_id,
      storageBucket,
    });
    return app;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const projectId = process.env.FIREBASE_PROJECT_ID || "skyhoist-engineering";
    const storageBucket =
      process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;
    app = initializeApp({ projectId, storageBucket });
    return app;
  }

  throw new Error(
    "Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.",
  );
}

export function getDb(): Firestore {
  return getFirestore(getApp());
}

export function getFirebaseStorage(): Storage {
  return getStorage(getApp());
}

export function getUploadsBucket() {
  return getFirebaseStorage().bucket();
}

export const collections = {
  users: "certUsers",
  customers: "certCustomers",
  certificates: "certCertificates",
  uploads: "certUploads",
} as const;

export const uploadPrefix = "cert-uploads";

/** Prefer Cloud Storage when a bucket env is set and usable; otherwise Firestore. */
export function preferStorageUploads() {
  return process.env.FIREBASE_UPLOAD_BACKEND === "storage";
}
