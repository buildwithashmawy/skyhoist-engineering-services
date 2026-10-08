import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCertificateByToken } from "@/lib/cert/store";
import { StatusPill } from "@/components/cert/ui";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "Certificate Verification",
  robots: { index: false, follow: false },
};

export default async function VerifyCertificatePage({ params }: Props) {
  const { token } = await params;
  const certificate = await getCertificateByToken(token);

  return (
    <div className="min-h-screen bg-[#f5f1e8] px-4 py-10">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[1.6rem] border border-[#d7c8ad] bg-[#fffdf8] shadow-[0_24px_60px_rgba(23,19,16,0.08)]">
        <div className="bg-[#013baa] px-6 py-6 text-white md:px-8">
          <Image
            src="/images/logo-white.png"
            alt="Skyhoist Engineering Services"
            width={1537}
            height={1023}
            className="h-auto w-44 object-contain"
            priority
          />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-[#ffb087]">
            Public Verification
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-wide">
            Certificate Verification
          </h1>
        </div>

        <div className="px-6 py-8 md:px-8">
          {!certificate ? (
            <div>
              <p className="font-display text-2xl font-bold text-[#171310]">
                Certificate not found
              </p>
              <p className="mt-2 text-sm text-[#5c503c]">
                This verification token is invalid or the certificate was removed.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={certificate.status} />
                <p className="break-all font-mono text-xs text-[#5c503c]">
                  {certificate.verificationToken}
                </p>
              </div>
              <dl className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Certificate No.
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-[#171310]">
                    {certificate.certificateNo}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Customer
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {certificate.customer?.fullName || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Expire Date
                  </dt>
                  <dd className="mt-1">
                    {certificate.expireDate
                      ? new Date(certificate.expireDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Pages on file
                  </dt>
                  <dd className="mt-1">{certificate.pages.length}</dd>
                </div>
              </dl>
              {certificate.notes ? (
                <p className="rounded-xl bg-[#f6f1e7] px-4 py-3 text-sm text-[#5c503c]">
                  {certificate.notes}
                </p>
              ) : null}
              {certificate.pages.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Attached pages
                  </p>
                  <ul className="space-y-2">
                    {certificate.pages.map((page) => (
                      <li key={page.storedName}>
                        <a
                          className="text-sm font-semibold text-[#171310] underline"
                          href={`/api/cert/files/${page.storedName}/?token=${certificate.verificationToken}`}
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
          )}

          <div className="mt-8 border-t border-[#efe6d4] pt-5 text-xs text-[#8a7c61]">
            Issued through Skyhoist Engineering Services certificate registry.{" "}
            <Link href="/" className="font-semibold text-[#171310]">
              Company website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
