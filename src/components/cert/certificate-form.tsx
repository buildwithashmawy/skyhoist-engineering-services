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

type Props = {
  certificateId?: string;
};

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function CertificateForm({ certificateId }: Props) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoaded, setCustomersLoaded] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [uploadingPage, setUploadingPage] = useState<number | null>(null);

  useEffect(() => {
    async function bootstrap() {
      const customersRes = await fetch("/api/cert/customers/");
      const customersData = await customersRes.json();
      if (customersRes.ok) {
        setCustomers(
          (customersData.customers as Customer[]).filter((c) =>
            Boolean(c.fullName?.trim()),
          ),
        );
      }
      setCustomersLoaded(true);

      if (!certificateId) {
        setVerificationToken(randomToken());
        const nextRes = await fetch("/api/cert/certificates/?nextNumber=1");
        const nextData = await nextRes.json().catch(() => ({}));
        if (nextRes.ok && nextData.nextCertificateNo) {
          setCertificateNo(String(nextData.nextCertificateNo));
        }
        return;
      }

      const res = await fetch(`/api/cert/certificates/${certificateId}/`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Certificate not found.");
        return;
      }
      const cert = data.certificate;
      setCertificateNo(cert.certificateNo);
      setCustomerId(cert.customerId);
      setExpireDate(cert.expireDate || "");
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
    const res = await fetch("/api/cert/upload/", { method: "POST", body: form });
    const data = await res.json();
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

    if (!certificateNo.trim()) {
      setError("Certificate number is required.");
      return;
    }
    if (!customerId) {
      setError(
        customers.length === 0
          ? "Add a company in Customer Ledger before creating a certificate."
          : "Select a customer entity for this certificate.",
      );
      return;
    }
    if (!expireDate) {
      setError("Expire date is required.");
      return;
    }
    if (!verificationToken.trim()) {
      setError("Verification token is required.");
      return;
    }

    setLoading(true);
    const payload = {
      certificateNo: certificateNo.trim(),
      customerId,
      expireDate,
      status,
      notes,
      verificationToken: verificationToken.trim(),
      pages: pages.filter(Boolean),
    };
    const res = await fetch(
      certificateId
        ? `/api/cert/certificates/${certificateId}/`
        : "/api/cert/certificates/",
      {
        method: certificateId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not save certificate.");
      return;
    }
    router.push("/certificate/admin/certificates/");
    router.refresh();
  }

  return (
    <>
      <PageHeader
        eyebrow="ORGANIZATION REGISTRY"
        title={certificateId ? "Edit Certificate" : "New Institutional Certificate"}
        description="Certificates are shared across the whole organization — every admin and inspector sees the same archive."
        breadcrumb={[
          { label: "Archive", href: "/certificate/admin/certificates/" },
          { label: "Certificates", href: "/certificate/admin/certificates/" },
          { label: certificateId ? "Edit" : "Registration" },
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
              {customersLoaded && customers.length === 0 ? (
                <div className="rounded-xl border border-[var(--brand-orange)]/35 bg-[var(--brand-sky)] px-4 py-3 text-sm text-[var(--brand-ink)]">
                  No companies are registered yet.{" "}
                  <Link
                    href="/certificate/admin/customers/new/"
                    className="font-semibold underline underline-offset-2"
                  >
                    Add a customer
                  </Link>{" "}
                  first, then return here to issue the certificate.
                </div>
              ) : null}
              <Field label="Certificate No.">
                <input
                  className={inputClass}
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  placeholder="Certificate number"
                  required
                />
              </Field>
              <Field
                label="Customer Entity"
                hint="Pick from the shared organization customer ledger."
              >
                <select
                  className={inputClass}
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
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
                <Field label="Expire Date">
                  <input
                    className={inputClass}
                    type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    required
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
                hint="Pre-generated 64-character hex token used by the public verification page and QR code."
              >
                <input
                  className={`${inputClass} font-mono text-xs`}
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  required
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

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--brand-sky)] p-5">
                <h3 className="font-display text-lg font-bold text-[var(--brand-ink)]">
                  Document Repository (Pages 1–5)
                </h3>
                <div className="mt-4 grid gap-3">
                  {pages.map((page, index) => {
                    const pageNo = index + 1;
                    return (
                      <div
                        key={pageNo}
                        className="flex flex-col gap-3 rounded-xl border border-dashed border-[var(--brand-orange)]/60 bg-white p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-[var(--brand-ink)]">
                            Page {String(pageNo).padStart(2, "0")}
                          </p>
                          <p className="text-xs text-[var(--brand-steel)]">
                            {page
                              ? `${page.fileName} (${Math.round(page.size / 1024)} KB)`
                              : "Drop or upload a PDF / image"}
                          </p>
                          {page ? (
                            <a
                              className="mt-1 inline-block text-xs font-semibold text-[var(--brand-ink)] underline"
                              href={`/api/cert/files/${page.storedName}/`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open file
                            </a>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#013baa] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#012f8a]">
                            {uploadingPage === pageNo
                              ? "Uploading…"
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
                <PrimaryButton
                  type="submit"
                  disabled={loading || (customersLoaded && customers.length === 0)}
                >
                  {loading
                    ? "Saving…"
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
            "This is an organization-level registry — certificates are shared by all users, not private to one inspector.",
            "Create the company in Customer Ledger first, then link the certificate.",
            "Company name is required; blank names are rejected and cannot be selected here.",
            "Keep the verification token unique — it powers the public QR page.",
            "Upload up to five document pages (PDF or image) for field verification.",
            "Use Valid only when the certificate is ready for public checks.",
          ]}
        />
      </div>
    </>
  );
}
