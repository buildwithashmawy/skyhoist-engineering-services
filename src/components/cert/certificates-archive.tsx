"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DetailDrawer } from "@/components/cert/detail-drawer";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  RecordsBadge,
  SecondaryButton,
  StatCard,
  StatusPill,
} from "@/components/cert/ui";

export type CertificateRow = {
  id: string;
  certificateNo: string;
  expireDate: string;
  customerName: string;
  status: string;
  verificationToken: string;
  notes?: string;
  pages?: { page: number; fileName: string; storedName: string }[];
  createdAt?: string;
};

export function CertificatesArchive({ rows }: { rows: CertificateRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<CertificateRow | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    async function buildQr() {
      if (!selected) {
        setQrDataUrl("");
        return;
      }
      const url = `${window.location.origin}/verify/${selected.verificationToken}/`;
      setQrDataUrl(await QRCode.toDataURL(url, { margin: 1, width: 220 }));
    }
    void buildQr();
  }, [selected]);

  const stats = useMemo(() => {
    const valid = rows.filter((r) => r.status === "valid").length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const closed = rows.filter(
      (r) => r.status === "expired" || r.status === "revoked",
    ).length;
    return { valid, pending, closed };
  }, [rows]);

  async function openDetails(id: string) {
    const res = await fetch(`/api/cert/certificates/${id}/`);
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not load certificate.");
      return;
    }
    setSelected({
      ...data.certificate,
      customerName: data.certificate.customer?.fullName || "Unknown customer",
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this certificate?")) return;
    const res = await fetch(`/api/cert/certificates/${id}/`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not delete certificate.");
      return;
    }
    if (selected?.id === id) setSelected(null);
    router.refresh();
  }

  async function clone(id: string) {
    const res = await fetch(`/api/cert/certificates/${id}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clone" }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not clone certificate.");
      return;
    }
    window.location.href = `/certificate/admin/certificates/${data.certificate.id}/`;
  }

  const verifyUrl = selected
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${selected.verificationToken}/`
    : "";

  return (
    <>
      <PageHeader
        eyebrow="ARCHIVE"
        title="All Certificates"
        description="Every row below is ready for public verification through its secure token."
        breadcrumb={[{ label: "Archive" }, { label: "Certificates" }]}
        actions={
          <>
            <RecordsBadge count={rows.length} />
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                [
                  "Certificate No.,Expire Date,Customer Name,Status,Verification Token",
                  ...rows.map(
                    (r) =>
                      `"${r.certificateNo}","${r.expireDate}","${r.customerName.replaceAll('"', '""')}","${r.status}","${r.verificationToken}"`,
                  ),
                ].join("\n"),
              )}`}
              download="skyhoist-certificates.csv"
            >
              <SecondaryButton type="button">Export CSV</SecondaryButton>
            </a>
            <Link href="/certificate/admin/certificates/new/">
              <PrimaryButton type="button">Add Certificate</PrimaryButton>
            </Link>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Valid" value={stats.valid} tone="valid" />
        <StatCard label="Pending" value={stats.pending} tone="pending" />
        <StatCard label="Expired / Revoked" value={stats.closed} tone="danger" />
      </div>

      <Panel>
        {rows.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-display text-xl font-bold">No certificates yet</p>
            <p className="mt-2 text-sm text-[#5c503c]">
              Issue your first institutional certificate to get started.
            </p>
            <Link href="/certificate/admin/certificates/new/" className="mt-5 inline-block">
              <PrimaryButton type="button">Go To Certificate Form</PrimaryButton>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#d7c8ad] bg-[#f6f1e7] text-xs uppercase tracking-[0.14em] text-[#8a7c61]">
                <tr>
                  <th className="px-5 py-4">Certificate No.</th>
                  <th className="px-5 py-4">Expire Date</th>
                  <th className="px-5 py-4">Customer Name</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#efe6d4]">
                    <td className="px-5 py-4 font-semibold">{row.certificateNo}</td>
                    <td className="px-5 py-4 text-[#5c503c]">
                      {row.expireDate
                        ? new Date(row.expireDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-4">{row.customerName}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <SecondaryButton
                          type="button"
                          className="min-h-9 px-3"
                          onClick={() => void openDetails(row.id)}
                        >
                          View
                        </SecondaryButton>
                        <Link href={`/certificate/admin/certificates/${row.id}/`}>
                          <SecondaryButton type="button" className="min-h-9 px-3">
                            Edit
                          </SecondaryButton>
                        </Link>
                        <SecondaryButton
                          type="button"
                          className="min-h-9 px-3"
                          onClick={() => void clone(row.id)}
                        >
                          Clone
                        </SecondaryButton>
                        <SecondaryButton
                          type="button"
                          className="min-h-9 px-3"
                          onClick={() => void remove(row.id)}
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
        )}
      </Panel>

      <DetailDrawer
        open={Boolean(selected)}
        title={selected?.certificateNo || "Certificate"}
        eyebrow="Certificate Details"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-5 text-sm">
            <StatusPill status={selected.status} />
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                  Customer
                </dt>
                <dd className="mt-1 font-semibold">{selected.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                  Added Time
                </dt>
                <dd className="mt-1">
                  {selected.createdAt
                    ? new Date(selected.createdAt).toLocaleString()
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                  Expire Date
                </dt>
                <dd className="mt-1">
                  {selected.expireDate
                    ? new Date(selected.expireDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>

            <div className="rounded-2xl border border-[#d7c8ad] bg-[#f6f1e7] p-4 text-center">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="Certificate verification QR code"
                  className="mx-auto rounded-xl bg-white p-2"
                />
              ) : (
                <p className="text-xs text-[#8a7c61]">Generating QR…</p>
              )}
              <p className="mt-3 break-all font-mono text-[0.7rem] text-[#5c503c]">
                {selected.verificationToken}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={verifyUrl} target="_blank" rel="noreferrer">
                <PrimaryButton type="button">Open Verification</PrimaryButton>
              </a>
              {selected.pages?.[0] ? (
                <a
                  href={`/api/cert/files/${selected.pages[0].storedName}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SecondaryButton type="button">Download</SecondaryButton>
                </a>
              ) : (
                <SecondaryButton type="button" disabled>
                  Download
                </SecondaryButton>
              )}
            </div>

            {selected.pages && selected.pages.length > 0 ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                  Document Pages
                </p>
                <ul className="mt-2 space-y-2">
                  {selected.pages.map((page) => (
                    <li key={page.storedName}>
                      <a
                        className="font-semibold text-[#171310] underline"
                        href={`/api/cert/files/${page.storedName}/`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Page {String(page.page).padStart(2, "0")} — {page.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </DetailDrawer>
    </>
  );
}
