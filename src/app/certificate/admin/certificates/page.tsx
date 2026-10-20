import { CertificatesArchive } from "@/components/cert/certificates-archive";
import { getSession } from "@/lib/cert/auth";
import { listCertificates } from "@/lib/cert/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CertificatesPage() {
  const [rows, session] = await Promise.all([listCertificates(), getSession()]);
  return (
    <CertificatesArchive
      rows={rows}
      canDelete={session?.role === "admin"}
    />
  );
}
