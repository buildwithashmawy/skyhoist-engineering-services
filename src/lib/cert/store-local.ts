import { randomBytes, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { stableUserId } from "./ids";
import type {
  Certificate,
  CertificatePageFile,
  CertStore,
  CertUser,
  Customer,
  CustomerStatus,
  CertificateStatus,
} from "./types";

const DATA_DIR =
  process.env.CERT_DATA_DIR ||
  (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? path.join("/tmp", "skyhoist-cert-data")
    : path.join(process.cwd(), "data"));
const STORE_PATH = path.join(DATA_DIR, "certificate-store.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

function emptyStore(): CertStore {
  return { users: [], customers: [], certificates: [] };
}

async function seedIfNeeded(store: CertStore): Promise<CertStore> {
  if (store.users.length > 0) return store;

  const username = process.env.CERT_ADMIN_USERNAME || "admin";
  const password = process.env.CERT_ADMIN_PASSWORD || "SkyhoistAdmin1";
  const email = process.env.CERT_ADMIN_EMAIL || "admin@skyhoistservices.com";

  store.users.push({
    id: stableUserId(username),
    fullName: "Skyhoist Admin",
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    role: "admin",
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
    createdById: null,
  });
  await writeStore(store);
  return store;
}

async function readStore(): Promise<CertStore> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as CertStore;
    return seedIfNeeded({
      users: parsed.users || [],
      customers: parsed.customers || [],
      certificates: parsed.certificates || [],
    });
  } catch {
    return seedIfNeeded(emptyStore());
  }
}

async function writeStore(store: CertStore) {
  await ensureDirs();
  const tmp = `${STORE_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, STORE_PATH);
}

export function publicUser(user: CertUser) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function makeToken() {
  return randomBytes(32).toString("hex");
}

export const localStore = {
  async findUserByIdentity(identity: string) {
    const store = await readStore();
    const key = identity.trim().toLowerCase();
    return store.users.find((u) => u.username === key || u.email === key) || null;
  },

  async createOperator(input: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    createdById: string;
  }) {
    const store = await readStore();
    const username = input.username.trim().toLowerCase();
    const email = input.email.trim().toLowerCase();
    if (store.users.some((u) => u.username === username || u.email === email)) {
      throw new Error("Username or email already exists.");
    }
    assertPassword(input.password);
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
    store.users.push(user);
    await writeStore(store);
    return publicUser(user);
  },

  async deleteOperator(id: string, actorId: string) {
    const store = await readStore();
    const target = store.users.find((u) => u.id === id);
    if (!target) throw new Error("Inspector not found.");
    if (target.role === "admin") throw new Error("Admin accounts cannot be removed here.");
    if (target.id === actorId) throw new Error("You cannot remove your own account.");
    store.users = store.users.filter((u) => u.id !== id);
    await writeStore(store);
  },

  async listOperators() {
    const store = await readStore();
    return store.users
      .filter((u) => u.role === "operator")
      .map(publicUser)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  },

  async listAdmins() {
    const store = await readStore();
    return store.users
      .filter((u) => u.role === "admin")
      .map(publicUser)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  },

  async listCustomers() {
    const store = await readStore();
    return [...store.customers].sort((a, b) => a.fullName.localeCompare(b.fullName));
  },

  async getCustomer(id: string) {
    const store = await readStore();
    return store.customers.find((c) => c.id === id) || null;
  },

  async upsertCustomer(input: {
    id?: string;
    fullName: string;
    email?: string;
    phone?: string;
    status: CustomerStatus;
  }) {
    const store = await readStore();
    const now = new Date().toISOString();
    if (input.id) {
      const idx = store.customers.findIndex((c) => c.id === input.id);
      if (idx < 0) throw new Error("Customer not found.");
      store.customers[idx] = {
        ...store.customers[idx],
        fullName: input.fullName.trim(),
        email: (input.email || "").trim(),
        phone: (input.phone || "").trim(),
        status: input.status,
        updatedAt: now,
      };
      await writeStore(store);
      return store.customers[idx];
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
    store.customers.push(customer);
    await writeStore(store);
    return customer;
  },

  async deleteCustomer(id: string) {
    const store = await readStore();
    if (store.certificates.some((c) => c.customerId === id)) {
      throw new Error("Remove or reassign certificates for this customer first.");
    }
    store.customers = store.customers.filter((c) => c.id !== id);
    await writeStore(store);
  },

  async listCertificates() {
    const store = await readStore();
    const customers = new Map(store.customers.map((c) => [c.id, c]));
    return [...store.certificates]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((cert) => ({
        ...cert,
        customerName: customers.get(cert.customerId)?.fullName || "Unknown customer",
      }));
  },

  async getCertificate(id: string) {
    const store = await readStore();
    const cert = store.certificates.find((c) => c.id === id);
    if (!cert) return null;
    const customer = store.customers.find((c) => c.id === cert.customerId) || null;
    return { ...cert, customer };
  },

  async getCertificateByToken(token: string) {
    const store = await readStore();
    const cert = store.certificates.find((c) => c.verificationToken === token);
    if (!cert) return null;
    const customer = store.customers.find((c) => c.id === cert.customerId) || null;
    return { ...cert, customer };
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
    const store = await readStore();
    if (!store.customers.some((c) => c.id === input.customerId)) {
      throw new Error("Customer not found.");
    }
    const now = new Date().toISOString();
    const certificateNo = input.certificateNo.trim();
    if (!certificateNo) throw new Error("Certificate number is required.");
    const duplicate = store.certificates.find(
      (c) =>
        c.certificateNo.toLowerCase() === certificateNo.toLowerCase() &&
        c.id !== input.id,
    );
    if (duplicate) throw new Error("Certificate number already exists.");

    if (input.id) {
      const idx = store.certificates.findIndex((c) => c.id === input.id);
      if (idx < 0) throw new Error("Certificate not found.");
      const prev = store.certificates[idx];
      store.certificates[idx] = {
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
      await writeStore(store);
      return store.certificates[idx];
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
    store.certificates.push(cert);
    await writeStore(store);
    return cert;
  },

  async deleteCertificate(id: string) {
    const store = await readStore();
    const cert = store.certificates.find((c) => c.id === id);
    if (!cert) throw new Error("Certificate not found.");
    for (const page of cert.pages) {
      try {
        await fs.unlink(path.join(UPLOAD_DIR, page.storedName));
      } catch {
        /* ignore */
      }
    }
    store.certificates = store.certificates.filter((c) => c.id !== id);
    await writeStore(store);
  },

  async cloneCertificate(id: string, createdById: string) {
    const store = await readStore();
    const source = store.certificates.find((c) => c.id === id);
    if (!source) throw new Error("Certificate not found.");
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
    store.certificates.push(clone);
    await writeStore(store);
    return clone;
  },

  async saveUpload(file: File, page: number): Promise<CertificatePageFile> {
    await ensureDirs();
    const ext = path.extname(file.name) || "";
    const storedName = `${randomUUID()}-p${page}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, storedName), buffer);
    return {
      page,
      fileName: file.name,
      storedName,
      mimeType: file.type || "application/octet-stream",
      size: buffer.length,
    };
  },

  async readUpload(storedName: string) {
    return fs.readFile(path.join(UPLOAD_DIR, storedName));
  },

  backend: "local" as const,
};

function assertPassword(password: string) {
  if (password.length < 10) {
    throw new Error("Password must be at least 10 characters.");
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error("Password must include upper, lower, and numeric characters.");
  }
}
