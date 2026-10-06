import { randomBytes, randomUUID } from "crypto";
import path from "path";
import bcrypt from "bcryptjs";
import {
  collections,
  getDb,
  getUploadsBucket,
  uploadPrefix,
} from "./firebase";
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
    if (!snap.exists) throw new Error("Operator not found.");
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
      const next: Certificate = {
        ...prev,
        certificateNo,
        customerId: input.customerId,
        expireDate: input.expireDate,
        status: input.status,
        notes: (input.notes || "").trim(),
        verificationToken: input.verificationToken?.trim() || prev.verificationToken,
        pages: input.pages ?? prev.pages,
        updatedAt: now,
      };
      await ref.set(next);
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
    const bucket = getUploadsBucket();
    await Promise.all(
      cert.pages.map(async (page) => {
        try {
          await bucket.file(`${uploadPrefix}/${page.storedName}`).delete({ ignoreNotFound: true });
        } catch {
          /* ignore */
        }
      }),
    );
    await ref.delete();
  },

  async cloneCertificate(id: string, createdById: string) {
    const db = getDb();
    const snap = await db.collection(collections.certificates).doc(id).get();
    if (!snap.exists) throw new Error("Certificate not found.");
    const source = snap.data() as Certificate;
    const now = new Date().toISOString();
    const clone: Certificate = {
      ...source,
      id: randomUUID(),
      certificateNo: `${source.certificateNo}-COPY`,
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
  },

  async readUpload(storedName: string) {
    const [buffer] = await getUploadsBucket()
      .file(`${uploadPrefix}/${storedName}`)
      .download();
    return buffer;
  },
};
