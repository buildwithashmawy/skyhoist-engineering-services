"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  PageHeader,
  Panel,
  PanelBody,
  PrimaryButton,
  SecondaryButton,
} from "@/components/cert/ui";
import type { SessionUser } from "@/lib/cert/types";

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [verificationBaseUrl, setVerificationBaseUrl] = useState("");
  const [uploadDirectory, setUploadDirectory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cert/settings/");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load settings.");
        return;
      }
      setCurrentUser(data.currentUser);
      setVerificationBaseUrl(data.verificationBaseUrl);
      setUploadDirectory(data.uploadDirectory);
    }
    void load();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="SECURITY SETTINGS"
        title="Admin Access"
        description="Review the active account, verification route, and upload location used by the live registry."
        breadcrumb={[{ label: "Security" }, { label: "Settings" }]}
      />

      {error ? (
        <Panel>
          <PanelBody>
            <p className="text-sm text-rose-700">{error}</p>
          </PanelBody>
        </Panel>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel accent>
            <PanelBody>
              <h2 className="font-display text-xl font-bold text-[#171310]">
                Current Admin
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Name
                  </dt>
                  <dd className="mt-1 font-semibold">{currentUser?.fullName || "…"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Admin Username
                  </dt>
                  <dd className="mt-1">{currentUser?.username || "…"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Admin Email
                  </dt>
                  <dd className="mt-1">{currentUser?.email || "…"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Role
                  </dt>
                  <dd className="mt-1 font-bold uppercase tracking-[0.14em] text-[#c9a24a]">
                    {currentUser?.role === "admin" ? "SUPER_ADMIN" : "OPERATOR"}
                  </dd>
                </div>
              </dl>
              {currentUser?.role === "admin" ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/certificate/admin/operators/">
                    <PrimaryButton type="button">Add Operator</PrimaryButton>
                  </Link>
                </div>
              ) : null}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelBody>
              <h2 className="font-display text-xl font-bold text-[#171310]">
                Registry Paths
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Verification Base URL
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    {verificationBaseUrl || "…"}
                  </dd>
                  <p className="mt-1 text-xs text-[#8a7c61]">
                    This is the public path QR codes should open after scanning.
                  </p>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Upload Directory
                  </dt>
                  <dd className="mt-1 font-mono text-xs">
                    {uploadDirectory || "…"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7c61]">
                    Database Host
                  </dt>
                  <dd className="mt-1 font-mono text-xs">local file store</dd>
                </div>
              </dl>
              <div className="mt-6">
                <Link href="/certificate/admin/certificates/">
                  <SecondaryButton type="button">Back To Certificates</SecondaryButton>
                </Link>
              </div>
            </PanelBody>
          </Panel>
        </div>
      )}
    </>
  );
}
