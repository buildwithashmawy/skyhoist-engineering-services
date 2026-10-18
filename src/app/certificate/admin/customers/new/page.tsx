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
import {
  validateCustomerInput,
  type FieldErrors,
} from "@/lib/cert/validate";

export default function NewCustomerPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("verified");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const checked = validateCustomerInput({
      fullName,
      email,
      phone,
      status,
    });
    if (!checked.ok) {
      setFieldErrors(checked.errors);
      setError(checked.message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cert/customers/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFieldErrors((data.errors || {}) as FieldErrors);
        setError(data.error || "Could not create customer.");
        setLoading(false);
        return;
      }
      router.push("/certificate/admin/customers/");
      router.refresh();
    } catch {
      setError("Could not create customer. Check your connection and try again.");
      setLoading(false);
    }
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
            <form className="space-y-5" onSubmit={onSubmit} method="post" noValidate>
              {error ? (
                <div className="rounded-xl bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
                  {error}
                </div>
              ) : null}
              <Field
                label="Company Name"
                required
                error={fieldErrors.fullName}
              >
                <input
                  className={
                    fieldErrors.fullName
                      ? `${inputClass} border-[#93000a] focus:border-[#93000a]`
                      : inputClass
                  }
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                  }}
                  placeholder="Company legal name"
                  required
                  aria-required="true"
                />
              </Field>
              <Field
                label="Email Address (Optional)"
                error={fieldErrors.email}
              >
                <input
                  className={
                    fieldErrors.email
                      ? `${inputClass} border-[#93000a] focus:border-[#93000a]`
                      : inputClass
                  }
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
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
            "Company name is required — use the legal name exactly as it should appear on certificates.",
            "Email and phone are optional but help inspectors reach the client later.",
            "Mark Flagged if the company needs review before new certificates.",
            "After saving, the company appears in the Add Certificate dropdown.",
          ]}
        />
      </div>
    </>
  );
}
