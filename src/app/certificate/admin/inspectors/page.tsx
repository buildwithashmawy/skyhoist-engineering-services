import { redirect } from "next/navigation";
import { InspectorsPanel } from "@/components/cert/inspectors-panel";
import { getSession } from "@/lib/cert/auth";
import { listOperators } from "@/lib/cert/store";

export default async function InspectorsPage() {
  const session = await getSession();
  if (!session) redirect("/certificate/login/");
  if (session.role !== "admin") redirect("/certificate/admin/customers/");

  const inspectors = await listOperators();
  return <InspectorsPanel inspectors={inspectors} />;
}
