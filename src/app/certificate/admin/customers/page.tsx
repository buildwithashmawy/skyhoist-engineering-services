import { CustomersLedger } from "@/components/cert/customers-ledger";
import { listCustomers } from "@/lib/cert/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomersPage() {
  const customers = await listCustomers();
  return <CustomersLedger customers={customers} />;
}
