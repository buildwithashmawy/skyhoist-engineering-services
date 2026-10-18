import type { CertificateStatus, CustomerStatus } from "./types";

export type FieldErrors = Record<string, string>;

const CERT_STATUSES = new Set<CertificateStatus>([
  "valid",
  "pending",
  "expired",
  "revoked",
]);

const CUSTOMER_STATUSES = new Set<CustomerStatus>([
  "verified",
  "pending",
  "flagged",
]);

export type CertificateInput = {
  certificateNo?: unknown;
  customerId?: unknown;
  expireDate?: unknown;
  status?: unknown;
  notes?: unknown;
  verificationToken?: unknown;
  pages?: unknown;
};

export type CustomerInput = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  status?: unknown;
};

export type ValidatedCertificate = {
  certificateNo: string;
  customerId: string;
  expireDate: string;
  status: CertificateStatus;
  notes: string;
  verificationToken?: string;
  pages: unknown[];
};

export type ValidatedCustomer = {
  fullName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
};

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Client + server certificate form validation. Required: number, customer, expire date, token. */
export function validateCertificateInput(
  input: CertificateInput,
  options?: { requireVerificationToken?: boolean },
): { ok: true; data: ValidatedCertificate } | { ok: false; errors: FieldErrors; message: string } {
  const errors: FieldErrors = {};
  const certificateNo = String(input.certificateNo ?? "").trim();
  const customerId = String(input.customerId ?? "").trim();
  const expireDate = String(input.expireDate ?? "").trim();
  const notes = String(input.notes ?? "").trim();
  const rawToken = input.verificationToken;
  const verificationToken =
    rawToken === undefined || rawToken === null
      ? undefined
      : String(rawToken).trim();
  const statusRaw = String(input.status ?? "valid").trim().toLowerCase();
  const status = (
    CERT_STATUSES.has(statusRaw as CertificateStatus) ? statusRaw : "valid"
  ) as CertificateStatus;
  const pages = Array.isArray(input.pages) ? input.pages : [];

  if (!certificateNo) {
    errors.certificateNo = "Certificate number is required.";
  }
  if (!customerId) {
    errors.customerId = "Select a customer entity for this certificate.";
  }
  if (!expireDate) {
    errors.expireDate = "Expire date is required.";
  } else if (!isIsoDate(expireDate)) {
    errors.expireDate = "Expire date must be a valid date (YYYY-MM-DD).";
  }

  const requireToken = options?.requireVerificationToken !== false;
  if (requireToken) {
    if (!verificationToken) {
      errors.verificationToken = "Verification token is required.";
    } else if (!/^[a-f0-9]{64}$/i.test(verificationToken)) {
      errors.verificationToken =
        "Verification token must be a 64-character hex string.";
    }
  }

  if (Object.keys(errors).length > 0) {
    const message =
      errors.customerId ||
      errors.certificateNo ||
      errors.expireDate ||
      errors.verificationToken ||
      "Please fix the highlighted fields.";
    return { ok: false, errors, message };
  }

  return {
    ok: true,
    data: {
      certificateNo,
      customerId,
      expireDate,
      status,
      notes,
      verificationToken,
      pages,
    },
  };
}

export function validateCustomerInput(
  input: CustomerInput,
): { ok: true; data: ValidatedCustomer } | { ok: false; errors: FieldErrors; message: string } {
  const errors: FieldErrors = {};
  const fullName = String(input.fullName ?? "").trim();
  const email = String(input.email ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  const statusRaw = String(input.status ?? "verified").trim().toLowerCase();
  const status = (
    CUSTOMER_STATUSES.has(statusRaw as CustomerStatus) ? statusRaw : "verified"
  ) as CustomerStatus;

  if (!fullName) {
    errors.fullName = "Company name is required.";
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address, or leave it blank.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      message: errors.fullName || errors.email || "Please fix the highlighted fields.",
    };
  }

  return { ok: true, data: { fullName, email, phone, status } };
}

export function defaultExpireDate(monthsAhead = 12) {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() + monthsAhead);
  return date.toISOString().slice(0, 10);
}
