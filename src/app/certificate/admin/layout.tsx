import { redirect } from "next/navigation";
import { AdminShell } from "@/components/cert/admin-shell";
import { getSession } from "@/lib/cert/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CertificateAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect("/certificate/login/");
  }

  return <AdminShell user={session}>{children}</AdminShell>;
}
