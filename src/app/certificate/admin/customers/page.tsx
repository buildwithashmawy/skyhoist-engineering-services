import { CustomersLedger } from "@/components/cert/customers-ledger";
import { listCustomers } from "@/lib/cert/store";

export default async function CustomersPage() {
  const customers = await listCustomers();
  return <CustomersLedger customers={customers} />;
}
