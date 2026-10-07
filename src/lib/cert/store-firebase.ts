import { randomBytes, randomUUID } from "crypto";
import path from "path";
import bcrypt from "bcryptjs";
import {
  collections,
  getDb,
  getUploadsBucket,
  preferStorageUploads,
  uploadPrefix,
} from "./firebase";
import { nextCertificateNo } from "./certificate-no";
import { stableUserId } from "./ids";
import type {
  Certificate,
  CertificatePageFile,
  CertUser,
  Customer,
  CustomerStatus,
  CertificateStatus,
} from "./types";

function makeToken() {
  return randomBytes(32).toString("hex");
}

function publicUser(user: CertUser) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function assertPassword(password: string) {
  if (password.length < 10) {
    throw new Error("Password must be at least 10 characters.");
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error("Password must include upper, lower, and numeric characters.");
  }
}

async function ensureAdminSeed() {
  const db = getDb();
  const users = db.collection(collections.users);
  const existing = await users.where("role", "==", "admin").limit(1).get();
  if (!existing.empty) return;

  const username = (process.env.CERT_ADMIN_USERNAME || "admin").toLowerCase();
  const password = process.env.CERT_ADMIN_PASSWORD || "SkyhoistAdmin1";
  const email = (process.env.CERT_ADMIN_EMAIL || "admin@skyhoistservices.com").toLowerCase();
  const id = stableUserId(username);

  const admin: CertUser = {
    id,
    fullName: "Skyhoist Admin",
    username,
    email,
    role: "admin",
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
    createdById: null,
  };
  await users.doc(id).set(admin);
}

export const firebaseStore = {
  backend: "firebase" as const,

  async findUserByIdentity(identity: string) {
    await ensureAdminSeed();
    const db = getDb();
    const key = identity.trim().toLowerCase();
    const byUsername = await db
      .collection(collections.users)
      .where("username", "==", key)
      .limit(1)
      .get();
    if (!byUsername.empty) return byUsername.docs[0]!.data() as CertUser;
    const byEmail = await db
      .collection(collections.users)
      .where("email", "==", key)
      .limit(1)
      .get();
    if (!byEmail.empty) return byEmail.docs[0]!.data() as CertUser;
    return null;
  },

  async createOperator(input: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    createdById: string;
  }) {
    await ensureAdminSeed();
    const db = getDb();
    const username = input.username.trim().toLowerCase();
    const email = input.email.trim().toLowerCase();
    assertPassword(input.password);

    const clashUser = await db
      .collection(collections.users)
      .where("username", "==", username)
      .limit(1)
      .get();
    const clashEmail = await db
      .collection(collections.users)
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!clashUser.empty || !clashEmail.empty) {
      throw new Error("Username or email already exists.");
    }

    const user: CertUser = {
      id: randomUUID(),
      fullName: input.fullName.trim(),
      username,
      email,
      role: "operator",
      passwordHash: await bcrypt.hash(input.password, 10),
      createdAt: new Date().toISOString(),
      createdById: input.createdById,
    };
    await db.collection(collections.users).doc(user.id).set(user);
    return publicUser(user);
  },

  async deleteOperator(id: string, actorId: string) {
    const db = getDb();
    const snap = await db.collection(collections.users).doc(id).get();
    if (!snap.exists) throw new Error("Inspector not found.");
    const target = snap.data() as CertUser;
    if (target.role === "admin") throw new Error("Admin accounts cannot be removed here.");
    if (target.id === actorId) throw new Error("You cannot remove your own account.");
    await db.collection(collections.users).doc(id).delete();
  },

  async listOperators() {
    await ensureAdminSeed();
    const snap = await getDb()
      .collection(collections.users)
      .where("role", "==", "operator")
      .get();
    return snap.docs
      .map((doc) => publicUser(doc.data() as CertUser))
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  },

  async listAdmins() {
    await ensureAdminSeed();
    const snap = await getDb()
      .collection(collections.users)
      .where("role", "==", "admin")
      .get();
    return snap.docs
      .map((doc) => publicUser(doc.data() as CertUser))
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  },

  async listCustomers() {
    const snap = await getDb().collection(collections.customers).get();
    return snap.docs
      .map((doc) => doc.data() as Customer)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  },

  async getCustomer(id: string) {
    const snap = await getDb().collection(collections.customers).doc(id).get();
    return snap.exists ? (snap.data() as Customer) : null;
  },

  async upsertCustomer(input: {
    id?: string;
    fullName: string;
    email?: string;
    phone?: string;
    status: CustomerStatus;
  }) {
    const db = getDb();
    const now = new Date().toISOString();
    if (input.id) {
      const ref = db.collection(collections.customers).doc(input.id);
      const snap = await ref.get();
      if (!snap.exists) throw new Error("Customer not found.");
      const next: Customer = {
        ...(snap.data() as Customer),
        fullName: input.fullName.trim(),
        email: (input.email || "").trim(),
        phone: (input.phone || "").trim(),
        status: input.status,
        updatedAt: now,
      };
      await ref.set(next);
      return next;
    }

    const customer: Customer = {
      id: randomUUID(),
      fullName: input.fullName.trim(),
      email: (input.email || "").trim(),
      phone: (input.phone || "").trim(),
      status: input.status,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection(collections.customers).doc(customer.id).set(customer);
    return customer;
  },

  async deleteCustomer(id: string) {
    const db = getDb();
    const linked = await db
      .collection(collections.certificates)
      .where("customerId", "==", id)
      .limit(1)
      .get();
    if (!linked.empty) {
      throw new Error("Remove or reassign certificates for this customer first.");
    }
    await db.collection(collections.customers).doc(id).delete();
  },

  async listCertificates() {
    const db = getDb();
    const [certsSnap, customersSnap] = await Promise.all([
      db.collection(collections.certificates).get(),
      db.collection(collections.customers).get(),
    ]);
    const customers = new Map(
      customersSnap.docs.map((doc) => [doc.id, doc.data() as Customer]),
    );
    return certsSnap.docs
      .map((doc) => doc.data() as Certificate)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((cert) => ({
        ...cert,
        customerName: customers.get(cert.customerId)?.fullName || "Unknown customer",
      }));
  },

  async getCertificate(id: string) {
    const db = getDb();
    const snap = await db.collection(collections.certificates).doc(id).get();
    if (!snap.exists) return null;
    const cert = snap.data() as Certificate;
    const customerSnap = await db
      .collection(collections.customers)
      .doc(cert.customerId)
      .get();
    return {
      ...cert,
      customer: customerSnap.exists ? (customerSnap.data() as Customer) : null,
    };
  },

  async getCertificateByToken(token: string) {
    const db = getDb();
    const snap = await db
      .collection(collections.certificates)
      .where("verificationToken", "==", token)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const cert = snap.docs[0]!.data() as Certificate;
    const customerSnap = await db
      .collection(collections.customers)
      .doc(cert.customerId)
      .get();
    return {
      ...cert,
      customer: customerSnap.exists ? (customerSnap.data() as Customer) : null,
    };
  },

  async upsertCertificate(input: {
    id?: string;
    certificateNo: string;
    customerId: string;
    expireDate: string;
    status: CertificateStatus;
    notes?: string;
    verificationToken?: string;
    pages?: CertificatePageFile[];
    createdById: string;
  }) {
    const db = getDb();
    const customerSnap = await db
      .collection(collections.customers)
      .doc(input.customerId)
      .get();
    if (!customerSnap.exists) throw new Error("Customer not found.");

    const certificateNo = input.certificateNo.trim();
    if (!certificateNo) throw new Error("Certificate number is required.");

    const duplicate = await db
      .collection(collections.certificates)
      .where("certificateNo", "==", certificateNo)
      .limit(1)
      .get();
    if (!duplicate.empty && duplicate.docs[0]!.id !== input.id) {
      throw new Error("Certificate number already exists.");
    }

    const now = new Date().toISOString();
    if (input.id) {
      const ref = db.collection(collections.certificates).doc(input.id);
      const snap = await ref.get();
      if (!snap.exists) throw new Error("Certificate not found.");
      const prev = snap.data() as Certificate;
      const nextPages = input.pages ?? prev.pages;
      const next: Certificate = {
        ...prev,
        certificateNo,
        customerId: input.customerId,
        expireDate: input.expireDate,
        status: input.status,
        notes: (input.notes || "").trim(),
        verificationToken: input.verificationToken?.trim() || prev.verificationToken,
        pages: nextPages,
        updatedAt: now,
      };
      await ref.set(next);
      if (input.pages) {
        const kept = new Set(nextPages.map((p) => p.storedName));
        await Promise.all(
          prev.pages
            .filter((p) => !kept.has(p.storedName))
            .map(async (p) => {
              try {
                await deleteUpload(p.storedName);
              } catch {
                /* ignore */
              }
            }),
        );
      }
      return next;
    }

    const cert: Certificate = {
      id: randomUUID(),
      certificateNo,
      customerId: input.customerId,
      expireDate: input.expireDate,
      status: input.status,
      verificationToken: input.verificationToken?.trim() || makeToken(),
      notes: (input.notes || "").trim(),
      pages: input.pages || [],
      createdAt: now,
      updatedAt: now,
      createdById: input.createdById,
    };
    await db.collection(collections.certificates).doc(cert.id).set(cert);
    return cert;
  },

  async deleteCertificate(id: string) {
    const db = getDb();
    const ref = db.collection(collections.certificates).doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("Certificate not found.");
    const cert = snap.data() as Certificate;
    await Promise.all(
      cert.pages.map(async (page) => {
        try {
          await deleteUpload(page.storedName);
        } catch {
          /* ignore */
        }
      }),
    );
    await ref.delete();
  },

  async nextCertificateNumber() {
    const snap = await getDb().collection(collections.certificates).get();
    return nextCertificateNo(
      snap.docs.map((doc) => String((doc.data() as Certificate).certificateNo || "")),
    );
  },

  async cloneCertificate(id: string, createdById: string) {
    const db = getDb();
    const snap = await db.collection(collections.certificates).doc(id).get();
    if (!snap.exists) throw new Error("Certificate not found.");
    const source = snap.data() as Certificate;
    const all = await db.collection(collections.certificates).get();
    const now = new Date().toISOString();
    const clone: Certificate = {
      ...source,
      id: randomUUID(),
      certificateNo: nextCertificateNo(
        all.docs.map((doc) => String((doc.data() as Certificate).certificateNo || "")),
      ),
      verificationToken: makeToken(),
      pages: [],
      createdAt: now,
      updatedAt: now,
      createdById,
      status: "pending",
    };
    await db.collection(collections.certificates).doc(clone.id).set(clone);
    return clone;
  },

  async saveUpload(file: File, page: number): Promise<CertificatePageFile> {
    const ext = path.extname(file.name) || "";
    const storedName = `${randomUUID()}-p${page}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "application/octet-stream";

    if (preferStorageUploads()) {
      try {
        await getUploadsBucket()
          .file(`${uploadPrefix}/${storedName}`)
          .save(buffer, {
            contentType: mimeType,
            resumable: false,
            metadata: {
              metadata: {
                originalName: file.name,
                page: String(page),
              },
            },
          });
        return {
          page,
          fileName: file.name,
          storedName,
          mimeType,
          size: buffer.length,
        };
      } catch {
        // Fall through to Firestore when Storage/billing is unavailable.
      }
    }

    await saveUploadToFirestore(storedName, buffer, {
      fileName: file.name,
      mimeType,
      page,
    });
    return {
      page,
      fileName: file.name,
      storedName,
      mimeType,
      size: buffer.length,
    };
  },

  async readUpload(storedName: string) {
    return readUploadBytes(storedName);
  },

  async deleteUpload(storedName: string) {
    await deleteUpload(storedName);
  },
};

const CHUNK_CHARS = 700_000; // stay under Firestore 1 MiB doc limit (base64 expands ~4/3)

async function saveUploadToFirestore(
  storedName: string,
  buffer: Buffer,
  meta: { fileName: string; mimeType: string; page: number },
) {
  const db = getDb();
  const b64 = buffer.toString("base64");
  const chunks: string[] = [];
  for (let i = 0; i < b64.length; i += CHUNK_CHARS) {
    chunks.push(b64.slice(i, i + CHUNK_CHARS));
  }
  const batch = db.batch();
  const root = db.collection(collections.uploads).doc(storedName);
  batch.set(root, {
    storedName,
    fileName: meta.fileName,
    mimeType: meta.mimeType,
    page: meta.page,
    size: buffer.length,
    chunkCount: chunks.length,
    backend: "firestore",
    createdAt: new Date().toISOString(),
  });
  chunks.forEach((data, index) => {
    batch.set(root.collection("chunks").doc(String(index)), { index, data });
  });
  await batch.commit();
}

async function readUploadBytes(storedName: string): Promise<Buffer> {
  const db = getDb();
  const root = db.collection(collections.uploads).doc(storedName);
  const snap = await root.get();
  if (snap.exists) {
    const meta = snap.data() as { chunkCount?: number };
    const count = meta.chunkCount || 0;
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      const chunk = await root.collection("chunks").doc(String(i)).get();
      if (!chunk.exists) throw new Error("Upload chunk missing.");
      parts.push(String((chunk.data() as { data: string }).data || ""));
    }
    return Buffer.from(parts.join(""), "base64");
  }

  if (preferStorageUploads()) {
    const [buffer] = await getUploadsBucket()
      .file(`${uploadPrefix}/${storedName}`)
      .download();
    return buffer;
  }

  // Last resort: try Storage even when not preferred (bucket may exist later).
  try {
    const [buffer] = await getUploadsBucket()
      .file(`${uploadPrefix}/${storedName}`)
      .download();
    return buffer;
  } catch {
    throw new Error("Upload not found.");
  }
}

async function deleteUpload(storedName: string) {
  const db = getDb();
  const root = db.collection(collections.uploads).doc(storedName);
  const snap = await root.get();
  if (snap.exists) {
    const chunks = await root.collection("chunks").listDocuments();
    await Promise.all(chunks.map((c) => c.delete()));
    await root.delete();
    return;
  }
  try {
    await getUploadsBucket()
      .file(`${uploadPrefix}/${storedName}`)
      .delete({ ignoreNotFound: true });
  } catch {
    /* ignore */
  }
}
