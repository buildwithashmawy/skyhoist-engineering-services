"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Field,
  inputClass,
  PageHeader,
  Panel,
  PanelBody,
  PrimaryButton,
  SecondaryButton,
} from "@/components/cert/ui";

export default function EditCustomerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("verified");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/cert/customers/${params.id}/`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Customer not found.");
        return;
      }
      setFullName(data.customer.fullName);
      setEmail(data.customer.email || "");
      setPhone(data.customer.phone || "");
      setStatus(data.customer.status);
    }
    void load();
  }, [params.id]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/cert/customers/${params.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, status }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not update customer.");
      return;
    }
    router.push("/certificate/admin/customers/");
  }

  return (
    <>
      <PageHeader
        eyebrow="CUSTOMER DETAILS"
        title="Edit Customer"
        description="Update company details used across the certificate registry."
        breadcrumb={[
          { label: "Directory", href: "/certificate/admin/customers/" },
          { label: "Customer Ledger", href: "/certificate/admin/customers/" },
          { label: "Edit" },
        ]}
      />
      <Panel accent className="max-w-2xl">
        <PanelBody>
          <form className="space-y-5" onSubmit={onSubmit}>
            {error ? (
              <div className="rounded-xl bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
                {error}
              </div>
            ) : null}
            <Field label="Company Name">
              <input
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Field>
            <Field label="Email Address (Optional)">
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Phone Number (Optional)">
              <input
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="verified">Valid</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
            </Field>
            <div className="flex flex-wrap gap-3 pt-2">
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save Changes"}
              </PrimaryButton>
              <Link href="/certificate/admin/customers/">
                <SecondaryButton type="button">Back</SecondaryButton>
              </Link>
            </div>
          </form>
        </PanelBody>
      </Panel>
    </>
  );
}
