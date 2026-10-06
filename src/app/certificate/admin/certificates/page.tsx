import { CertificatesArchive } from "@/components/cert/certificates-archive";
import { listCertificates } from "@/lib/cert/store";

export default async function CertificatesPage() {
  const rows = await listCertificates();
  return <CertificatesArchive rows={rows} />;
}
