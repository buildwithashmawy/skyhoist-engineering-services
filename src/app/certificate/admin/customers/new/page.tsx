"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComplianceCard,
  Field,
  inputClass,
  PageHeader,
  Panel,
  PanelBody,
  PrimaryButton,
  SecondaryButton,
} from "@/components/cert/ui";

export default function NewCustomerPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("verified");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!fullName.trim()) {
      setError("Company name is required.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/cert/customers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email,
        phone,
        status,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not create customer.");
      return;
    }
    router.push("/certificate/admin/customers/");
    router.refresh();
  }

  return (
    <>
      <PageHeader
        eyebrow="COMPLIANCE CHECK"
        title="New Client Entry"
        description="Create a company record for the certificate registry."
        breadcrumb={[
          { label: "Directory", href: "/certificate/admin/customers/" },
          { label: "Customer Ledger", href: "/certificate/admin/customers/" },
          { label: "Registration" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel accent>
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
                  placeholder="Company legal name"
                  required
                />
              </Field>
              <Field label="Email Address (Optional)">
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Official email address"
                />
              </Field>
              <Field label="Phone Number (Optional)">
                <input
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 123 456 7890"
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
                  {loading ? "Saving…" : "Save Customer"}
                </PrimaryButton>
                <Link href="/certificate/admin/customers/">
                  <SecondaryButton type="button">Cancel</SecondaryButton>
                </Link>
              </div>
            </form>
          </PanelBody>
        </Panel>
        <ComplianceCard
          title="Quick Guidelines"
          items={[
            "Use the legal company name exactly as it should appear on certificates.",
            "Email and phone are optional but help inspectors reach the client later.",
            "Mark Flagged if the company needs review before new certificates.",
            "After saving, the company appears in the Add Certificate dropdown.",
          ]}
        />
      </div>
    </>
  );
}
