export type CertRole = "admin" | "operator";

export type CustomerStatus = "verified" | "pending" | "flagged";
export type CertificateStatus = "valid" | "pending" | "expired" | "revoked";

export type CertUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: CertRole;
  passwordHash: string;
  createdAt: string;
  createdById: string | null;
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
};

export type CertificatePageFile = {
  page: number;
  fileName: string;
  storedName: string;
  mimeType: string;
  size: number;
};

export type Certificate = {
  id: string;
  certificateNo: string;
  customerId: string;
  expireDate: string;
  status: CertificateStatus;
  verificationToken: string;
  notes: string;
  pages: CertificatePageFile[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
};

export type CertStore = {
  users: CertUser[];
  customers: Customer[];
  certificates: Certificate[];
};

export type SessionUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: CertRole;
};
