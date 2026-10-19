import { CertificatesArchive } from "@/components/cert/certificates-archive";
import { listCertificates } from "@/lib/cert/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CertificatesPage() {
  const rows = await listCertificates();
  return <CertificatesArchive rows={rows} />;
}
