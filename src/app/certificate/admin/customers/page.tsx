import { CustomersLedger } from "@/components/cert/customers-ledger";
import { getSession } from "@/lib/cert/auth";
import { listCustomers } from "@/lib/cert/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomersPage() {
  const [customers, session] = await Promise.all([
    listCustomers(),
    getSession(),
  ]);
  return (
    <CustomersLedger
      customers={customers}
      canDelete={session?.role === "admin"}
    />
  );
}
