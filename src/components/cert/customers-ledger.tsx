"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DetailDrawer } from "@/components/cert/detail-drawer";
import {
  Monogram,
  PageHeader,
  Panel,
  PrimaryButton,
  RecordsBadge,
  SecondaryButton,
  StatusPill,
} from "@/components/cert/ui";
import type { Customer } from "@/lib/cert/types";

export function CustomersLedger({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Customer | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this customer?")) return;
    const res = await fetch(`/api/cert/customers/${id}/`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not delete customer.");
      return;
    }
    if (selected?.id === id) setSelected(null);
    router.refresh();
  }

  return (
    <>
      <PageHeader
        eyebrow="REGISTRY"
        title="Registry Directory"
        description="Every company record used when issuing Skyhoist certificates."
        breadcrumb={[{ label: "Directory" }, { label: "Customer Ledger" }]}
        actions={
          <>
            <RecordsBadge count={customers.length} />
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                [
                  "Company Name,Email,Phone,Status",
                  ...customers.map(
                    (c) =>
                      `"${c.fullName.replaceAll('"', '""')}","${c.email}","${c.phone}","${c.status}"`,
                  ),
                ].join("\n"),
              )}`}
              download="skyhoist-customers.csv"
            >
              <SecondaryButton type="button">Export CSV</SecondaryButton>
            </a>
            <Link href="/certificate/admin/customers/new/">
              <PrimaryButton type="button">Add Customer</PrimaryButton>
            </Link>
          </>
        }
      />

      <Panel>
        {customers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-display text-xl font-bold">No customers yet</p>
            <p className="mt-2 text-sm text-[#5c503c]">
              Add a company before issuing certificates.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/certificate/admin/customers/new/">
                <PrimaryButton type="button">Add Customer</PrimaryButton>
              </Link>
              <Link href="/certificate/admin/certificates/new/">
                <SecondaryButton type="button">Go To Certificate Form</SecondaryButton>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-[#d7c8ad] px-5 py-4">
              <p className="text-sm text-[#5c503c]">
                Active records in the live registry
              </p>
              <Link href="/certificate/admin/certificates/new/">
                <SecondaryButton type="button" className="min-h-10">
                  Go To Certificate Form
                </SecondaryButton>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[#d7c8ad] bg-[#f6f1e7] text-xs uppercase tracking-[0.14em] text-[#8a7c61]">
                  <tr>
                    <th className="px-5 py-4">Company Name</th>
                    <th className="px-5 py-4">Email Address</th>
                    <th className="px-5 py-4">Phone Number</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-[#efe6d4]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Monogram name={customer.fullName} />
                          <span className="font-semibold">{customer.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#5c503c]">
                        {customer.email || "—"}
                      </td>
                      <td className="px-5 py-4 text-[#5c503c]">
                        {customer.phone || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill
                          status={
                            customer.status === "verified"
                              ? "valid"
                              : customer.status
                          }
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <SecondaryButton
                            type="button"
                            className="min-h-9 px-3"
                            onClick={() => setSelected(customer)}
                          >
                            View
                          </SecondaryButton>
                          <Link href={`/certificate/admin/customers/${customer.id}/`}>
                            <SecondaryButton type="button" className="min-h-9 px-3">
                              Edit
                            </SecondaryButton>
                          </Link>
                          <SecondaryButton
                            type="button"
                            className="min-h-9 px-3"
                            onClick={() => void remove(customer.id)}
                          >
                            Delete
                          </SecondaryButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>

      <DetailDrawer
        open={Boolean(selected)}
        title={selected?.fullName || "Customer"}
        eyebrow="Customer Details"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-5 text-sm">
            <div className="flex items-center gap-3">
              <Monogram name={selected.fullName} />
              <StatusPill
                status={selected.status === "verified" ? "valid" : selected.status}
              />
            </div>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                  Email
                </dt>
                <dd className="mt-1">{selected.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                  Phone
                </dt>
                <dd className="mt-1">{selected.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                  Added
                </dt>
                <dd className="mt-1">
                  {new Date(selected.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/certificate/admin/customers/${selected.id}/`}>
                <PrimaryButton type="button">Edit Customer</PrimaryButton>
              </Link>
              <Link href="/certificate/admin/certificates/new/">
                <SecondaryButton type="button">Add Certificate</SecondaryButton>
              </Link>
            </div>
          </div>
        ) : null}
      </DetailDrawer>
    </>
  );
}
