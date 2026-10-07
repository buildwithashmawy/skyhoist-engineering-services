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
      if (customersRes.ok) setCustomers(customersData.customers);

      if (!certificateId) {
        setVerificationToken(randomToken());
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
    setLoading(true);
    setError("");
    const payload = {
      certificateNo,
      customerId,
      expireDate,
      status,
      notes,
      verificationToken,
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
        eyebrow="DOCUMENT REPOSITORY"
        title={certificateId ? "Edit Certificate" : "New Institutional Certificate"}
        description="Certificate metadata plus optional document pages (1–5) for verification."
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
              <Field label="Certificate No.">
                <input
                  className={inputClass}
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  placeholder="Certificate number"
                  required
                />
              </Field>
              <Field label="Customer Entity">
                <select
                  className={inputClass}
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                >
                  <option value="">Select customer</option>
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

              <div className="rounded-2xl border border-[#d7c8ad] bg-[#f6f1e7] p-5">
                <h3 className="font-display text-lg font-bold text-[#171310]">
                  Document Repository (Pages 1–5)
                </h3>
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
                <PrimaryButton type="submit" disabled={loading}>
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
            "Link every certificate to a customer already in the ledger.",
            "Keep the verification token unique — it powers the public QR page.",
            "Upload up to five document pages (PDF or image) for field verification.",
            "Use Replace or Delete on a page file — then Save Changes to update the QR verification pages.",
            "Use Valid only when the certificate is ready for public checks.",
          ]}
        />
      </div>
    </>
  );
}
