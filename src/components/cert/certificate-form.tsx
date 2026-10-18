"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
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
import type { CertificatePageFile, Customer } from "@/lib/cert/types";
import {
  defaultExpireDate,
  validateCertificateInput,
  type FieldErrors,
} from "@/lib/cert/validate";

type Props = {
  certificateId?: string;
};

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function fieldClass(hasError: boolean) {
  return hasError
    ? `${inputClass} border-[#93000a] focus:border-[#93000a]`
    : inputClass;
}

export function CertificateForm({ certificateId }: Props) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoaded, setCustomersLoaded] = useState(false);
  const [customersError, setCustomersError] = useState("");
  const [certificateNo, setCertificateNo] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [status, setStatus] = useState("valid");
  const [verificationToken, setVerificationToken] = useState("");
  const [notes, setNotes] = useState("");
  const [pages, setPages] = useState<(CertificatePageFile | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [uploadingPage, setUploadingPage] = useState<number | null>(null);

  async function loadCustomers() {
    setCustomersError("");
    const customersRes = await fetch("/api/cert/customers/", {
      credentials: "include",
    });
    const customersData = await customersRes.json().catch(() => ({}));
    if (!customersRes.ok) {
      setCustomers([]);
      setCustomersError(
        customersData.error ||
          "Could not load customers. Sign in again, then retry.",
      );
      setCustomersLoaded(true);
      return;
    }
    const list = Array.isArray(customersData.customers)
      ? (customersData.customers as Customer[])
      : [];
    setCustomers(
      list.filter((c) => Boolean(c.id?.trim()) && Boolean(c.fullName?.trim())),
    );
    setCustomersLoaded(true);
  }

  useEffect(() => {
    async function bootstrap() {
      await loadCustomers();

      if (!certificateId) {
        setVerificationToken(randomToken());
        setExpireDate(defaultExpireDate(12));
        const nextRes = await fetch("/api/cert/certificates/?nextNumber=1", {
          credentials: "include",
        });
        const nextData = await nextRes.json().catch(() => ({}));
        if (nextRes.ok && nextData.nextCertificateNo) {
          setCertificateNo(String(nextData.nextCertificateNo));
        }
        return;
      }

      const res = await fetch(`/api/cert/certificates/${certificateId}/`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Certificate not found.");
        return;
      }
      const cert = data.certificate;
      setCertificateNo(cert.certificateNo);
      setCustomerId(cert.customerId);
      setExpireDate(cert.expireDate || defaultExpireDate(12));
      setStatus(cert.status);
      setVerificationToken(cert.verificationToken);
      setNotes(cert.notes || "");
      const next = [null, null, null, null, null] as (CertificatePageFile | null)[];
      for (const page of cert.pages || []) {
        if (page.page >= 1 && page.page <= 5) next[page.page - 1] = page;
      }
      setPages(next);
    }
    void bootstrap();
  }, [certificateId]);

  async function uploadPage(page: number, file: File | null) {
    if (!file) return;
    setUploadingPage(page);
    setError("");
    const form = new FormData();
    form.set("file", file);
    form.set("page", String(page));
    const res = await fetch("/api/cert/upload/", {
      method: "POST",
      body: form,
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    setUploadingPage(null);
    if (!res.ok) {
      setError(data.error || "Upload failed.");
      return;
    }
    setPages((prev) => {
      const next = [...prev];
      next[page - 1] = data.file;
      return next;
    });
  }

  function removePage(page: number) {
    setPages((prev) => {
      const current = prev[page - 1];
      if (!current) return prev;
      if (
        !confirm(
          `Remove page ${String(page).padStart(2, "0")} file (${current.fileName})? Save the certificate to apply this change.`,
        )
      ) {
        return prev;
      }
      const next = [...prev];
      next[page - 1] = null;
      return next;
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (customersLoaded && customers.length === 0) {
      setError(
        "Add a company in Customer Ledger before creating a certificate.",
      );
      setFieldErrors({
        customerId:
          "Add a company in Customer Ledger before creating a certificate.",
      });
      return;
    }

    const checked = validateCertificateInput({
      certificateNo,
      customerId,
      expireDate,
      status,
      notes,
      verificationToken,
      pages: pages.filter(Boolean),
    });
    if (!checked.ok) {
      setFieldErrors(checked.errors);
      setError(checked.message);
      return;
    }

    if (!customers.some((c) => c.id === checked.data.customerId)) {
      setFieldErrors({
        customerId: "Select a customer from the organization ledger.",
      });
      setError("Select a customer from the organization ledger.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        certificateId
          ? `/api/cert/certificates/${certificateId}/`
          : "/api/cert/certificates/",
        {
          method: certificateId ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            certificateNo: checked.data.certificateNo,
            customerId: checked.data.customerId,
            expireDate: checked.data.expireDate,
            status: checked.data.status,
            notes: checked.data.notes,
            verificationToken: checked.data.verificationToken,
            pages: checked.data.pages,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const apiErrors = (data.errors || {}) as FieldErrors;
        setFieldErrors(apiErrors);
        setError(data.error || "Could not save certificate.");
        setLoading(false);
        return;
      }
      router.push("/certificate/admin/certificates/");
      router.refresh();
    } catch {
      setError("Could not save certificate. Check your connection and try again.");
      setLoading(false);
    }
  }

  const canCreate = !(customersLoaded && customers.length === 0) && !customersError;

  return (
    <>
      <PageHeader
        eyebrow="ORGANIZATION REGISTRY"
        title={certificateId ? "Edit Certificate" : "New Institutional Certificate"}
        description="Certificates are shared across the whole organization - every admin and inspector sees the same archive."
        breadcrumb={[
          { label: "Archive", href: "/certificate/admin/certificates/" },
          { label: "Certificates", href: "/certificate/admin/certificates/" },
          { label: certificateId ? "Edit" : "Registration" },
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
              {customersError ? (
                <div className="rounded-xl border border-[#93000a]/25 bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
                  {customersError}{" "}
                  <button
                    type="button"
                    className="font-semibold underline underline-offset-2"
                    onClick={() => void loadCustomers()}
                  >
                    Retry
                  </button>
                </div>
              ) : null}
              {customersLoaded && customers.length === 0 && !customersError ? (
                <div className="rounded-xl border border-[var(--brand-orange)]/35 bg-[var(--brand-sky)] px-4 py-3 text-sm text-[var(--brand-ink)]">
                  No companies are registered yet.{" "}
                  <Link
                    href="/certificate/admin/customers/new/"
                    className="font-semibold underline underline-offset-2"
                  >
                    Add a customer
                  </Link>{" "}
                  first - company name is required - then return here to issue
                  the certificate.
                </div>
              ) : null}
              <Field
                label="Certificate No."
                required
                error={fieldErrors.certificateNo}
              >
                <input
                  className={fieldClass(Boolean(fieldErrors.certificateNo))}
                  value={certificateNo}
                  onChange={(e) => {
                    setCertificateNo(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, certificateNo: "" }));
                  }}
                  placeholder="Certificate number"
                  required
                  aria-required="true"
                />
              </Field>
              <Field
                label="Customer Entity"
                required
                error={fieldErrors.customerId}
                hint="Pick from the shared organization customer ledger."
              >
                <select
                  className={fieldClass(Boolean(fieldErrors.customerId))}
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, customerId: "" }));
                  }}
                  required
                  aria-required="true"
                  disabled={customers.length === 0}
                >
                  <option value="">
                    {customers.length === 0
                      ? "No customers available"
                      : "Select customer"}
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.fullName}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Expire Date"
                  required
                  error={fieldErrors.expireDate}
                >
                  <input
                    className={fieldClass(Boolean(fieldErrors.expireDate))}
                    type="date"
                    value={expireDate}
                    onChange={(e) => {
                      setExpireDate(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, expireDate: "" }));
                    }}
                    required
                    aria-required="true"
                  />
                </Field>
                <Field label="Status">
                  <select
                    className={inputClass}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="valid">Valid</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </Field>
              </div>
              <Field
                label="Verification Token"
                required
                error={fieldErrors.verificationToken}
                hint="Pre-generated 64-character hex token used by the public verification page and QR code."
              >
                <input
                  className={`${fieldClass(Boolean(fieldErrors.verificationToken))} font-mono text-xs`}
                  value={verificationToken}
                  onChange={(e) => {
                    setVerificationToken(e.target.value);
                    setFieldErrors((prev) => ({
                      ...prev,
                      verificationToken: "",
                    }));
                  }}
                  required
                  aria-required="true"
                  minLength={64}
                  maxLength={64}
                  pattern="[a-fA-F0-9]{64}"
                />
              </Field>
              <Field label="Notes">
                <input
                  className={inputClass}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes about the certificate"
                />
              </Field>

              <div className="rounded-2xl border border-[#d7c8ad] bg-[#f6f1e7] p-5">
                <h3 className="font-display text-lg font-bold text-[#171310]">
                  Document Repository (Pages 1-5)
                </h3>
                <p className="mt-1 text-xs text-[#8a7c61]">
                  Optional - you can create the certificate now and upload pages
                  later.
                </p>
                <div className="mt-4 grid gap-3">
                  {pages.map((page, index) => {
                    const pageNo = index + 1;
                    return (
                      <div
                        key={pageNo}
                        className="flex flex-col gap-3 rounded-xl border border-dashed border-[#c9a24a]/60 bg-[#fffdf8] p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-[#171310]">
                            Page {String(pageNo).padStart(2, "0")}
                          </p>
                          <p className="text-xs text-[#8a7c61]">
                            {page
                              ? `${page.fileName} (${Math.round(page.size / 1024)} KB)`
                              : "Drop or upload a PDF / image"}
                          </p>
                          {page ? (
                            <a
                              className="mt-1 inline-block text-xs font-semibold text-[#171310] underline"
                              href={`/api/cert/files/${page.storedName}/`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open file
                            </a>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-black px-4 py-2 text-xs font-bold text-white">
                            {uploadingPage === pageNo
                              ? "Uploading..."
                              : page
                                ? "Replace file"
                                : "Upload file"}
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,image/*"
                              onChange={(e) => {
                                void uploadPage(
                                  pageNo,
                                  e.target.files?.[0] || null,
                                );
                                e.target.value = "";
                              }}
                            />
                          </label>
                          {page ? (
                            <button
                              type="button"
                              onClick={() => removePage(pageNo)}
                              className="inline-flex items-center justify-center rounded-xl border border-[#93000a]/30 bg-[#ffdad6] px-4 py-2 text-xs font-bold text-[#93000a] transition hover:bg-[#ffc7c1]"
                            >
                              Delete file
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton type="submit" disabled={loading || !canCreate}>
                  {loading
                    ? "Saving..."
                    : certificateId
                      ? "Save Changes"
                      : "Create Certificate"}
                </PrimaryButton>
                <Link href="/certificate/admin/certificates/">
                  <SecondaryButton type="button">Cancel</SecondaryButton>
                </Link>
              </div>
            </form>
          </PanelBody>
        </Panel>

        <ComplianceCard
          title="Quick Guidelines"
          items={[
            "Required before create: certificate number, customer, expire date, and verification token.",
            "Create the company in Customer Ledger first (company name required), then link it here.",
            "Document pages are optional - issue the certificate first if files are not ready.",
            "Keep the verification token unique - it powers the public QR page.",
            "Use Valid only when the certificate is ready for public checks.",
          ]}
        />
      </div>
    </>
  );
}
