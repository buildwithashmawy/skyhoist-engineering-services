"use client";

import { useParams } from "next/navigation";
import { CertificateForm } from "@/components/cert/certificate-form";

export default function EditCertificatePage() {
  const params = useParams<{ id: string }>();
  return <CertificateForm certificateId={params.id} />;
}
