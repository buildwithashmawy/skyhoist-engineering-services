import { isFirebaseConfigured } from "./firebase";
import { firebaseStore } from "./store-firebase";
import { localStore, publicUser as toPublicUser } from "./store-local";
import type { CertUser } from "./types";

const active = () => (isFirebaseConfigured() ? firebaseStore : localStore);

export function publicUser(user: CertUser) {
  return toPublicUser(user);
}

export async function findUserByIdentity(identity: string) {
  return active().findUserByIdentity(identity);
}

export async function createOperator(input: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  createdById: string;
}) {
  return active().createOperator(input);
}

export async function deleteOperator(id: string, actorId: string) {
  return active().deleteOperator(id, actorId);
}

export async function listOperators() {
  return active().listOperators();
}

export async function listAdmins() {
  return active().listAdmins();
}

export async function listCustomers() {
  return active().listCustomers();
}

export async function getCustomer(id: string) {
  return active().getCustomer(id);
}

export async function upsertCustomer(input: {
  id?: string;
  fullName: string;
  email?: string;
  phone?: string;
  status: import("./types").CustomerStatus;
}) {
  return active().upsertCustomer(input);
}

export async function deleteCustomer(id: string) {
  return active().deleteCustomer(id);
}

export async function listCertificates() {
  return active().listCertificates();
}

export async function getCertificate(id: string) {
  return active().getCertificate(id);
}

export async function getCertificateByToken(token: string) {
  return active().getCertificateByToken(token);
}

export async function upsertCertificate(input: {
  id?: string;
  certificateNo: string;
  customerId: string;
  expireDate: string;
  status: import("./types").CertificateStatus;
  notes?: string;
  verificationToken?: string;
  pages?: import("./types").CertificatePageFile[];
  createdById: string;
}) {
  return active().upsertCertificate(input);
}

export async function deleteCertificate(id: string) {
  return active().deleteCertificate(id);
}

export async function cloneCertificate(id: string, createdById: string) {
  return active().cloneCertificate(id, createdById);
}

export async function saveUpload(file: File, page: number) {
  return active().saveUpload(file, page);
}

export async function readUpload(storedName: string) {
  return active().readUpload(storedName);
}

export async function deleteUpload(storedName: string) {
  return active().deleteUpload(storedName);
}

export function getStoreBackend() {
  return isFirebaseConfigured() ? "firebase" : "local";
}
