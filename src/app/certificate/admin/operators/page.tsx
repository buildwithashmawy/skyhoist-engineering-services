import { redirect } from "next/navigation";
import { OperatorsPanel } from "@/components/cert/operators-panel";
import { getSession } from "@/lib/cert/auth";
import { listOperators } from "@/lib/cert/store";

export default async function OperatorsPage() {
  const session = await getSession();
  if (!session) redirect("/certificate/login/");
  if (session.role !== "admin") redirect("/certificate/admin/customers/");

  const operators = await listOperators();
  return <OperatorsPanel operators={operators} />;
}
