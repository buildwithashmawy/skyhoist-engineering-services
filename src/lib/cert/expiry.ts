import type { CertificateStatus } from "./types";

/** Compare expireDate (YYYY-MM-DD) to today's UTC calendar date. */
export function isExpireDatePast(expireDate: string, now = new Date()): boolean {
  const value = String(expireDate || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const today = now.toISOString().slice(0, 10);
  return value < today;
}

/**
 * Revoked stays revoked. Otherwise past expire dates become expired
 * (even if the stored status is still valid/pending).
 */
export function effectiveCertificateStatus(
  status: CertificateStatus | string,
  expireDate: string,
  now = new Date(),
): CertificateStatus {
  if (status === "revoked") return "revoked";
  if (isExpireDatePast(expireDate, now)) return "expired";
  if (
    status === "valid" ||
    status === "pending" ||
    status === "expired" ||
    status === "revoked"
  ) {
    return status;
  }
  return "valid";
}

export function withEffectiveStatus<T extends { status: CertificateStatus; expireDate: string }>(
  cert: T,
  now = new Date(),
): T {
  return {
    ...cert,
    status: effectiveCertificateStatus(cert.status, cert.expireDate, now),
  };
}
