import { redirect } from "next/navigation";
import { getSession } from "@/lib/cert/auth";

export default async function CertificateIndexPage() {
  const session = await getSession();
  redirect(
    session
      ? "/certificate/admin/customers/"
      : "/certificate/login/",
  );
}
