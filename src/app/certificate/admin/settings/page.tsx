"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Field,
  inputClass,
  PageHeader,
  Panel,
  PanelBody,
  PrimaryButton,
  SecondaryButton,
} from "@/components/cert/ui";
import type { SessionUser } from "@/lib/cert/types";

type DirectoryUser = SessionUser & { createdAt?: string };

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [verificationBaseUrl, setVerificationBaseUrl] = useState("");
  const [uploadDirectory, setUploadDirectory] = useState("");
  const [storeBackend, setStoreBackend] = useState("");
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [resetUserId, setResetUserId] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cert/settings/", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to load settings.");
        return;
      }
      setCurrentUser(data.currentUser);
      setUsers(Array.isArray(data.users) ? data.users : []);
      setVerificationBaseUrl(data.verificationBaseUrl);
      setUploadDirectory(data.uploadDirectory);
      setStoreBackend(data.storeBackend || "");
      const others = (data.users as DirectoryUser[] | undefined)?.filter(
        (u) => u.id !== data.currentUser?.id,
      );
      if (others?.length) setResetUserId(others[0]!.id);
    }
    void load();
  }, []);

  async function onChangeOwnPassword(event: FormEvent) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/cert/password/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPasswordError(data.error || "Could not change password.");
        setPasswordLoading(false);
        return;
      }
      setPasswordMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordLoading(false);
    } catch {
      setPasswordError("Could not change password.");
      setPasswordLoading(false);
    }
  }

  async function onAdminResetPassword(event: FormEvent) {
    event.preventDefault();
    setResetError("");
    setResetMessage("");
    if (!resetUserId) {
      setResetError("Select a user.");
      return;
    }
    if (resetPassword !== resetConfirm) {
      setResetError("New password and confirmation do not match.");
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch("/api/cert/password/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resetUserId,
          newPassword: resetPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResetError(data.error || "Could not reset password.");
        setResetLoading(false);
        return;
      }
      const name =
        users.find((u) => u.id === resetUserId)?.fullName || "User";
      setResetMessage(`Password updated for ${name}.`);
      setResetPassword("");
      setResetConfirm("");
      setResetLoading(false);
    } catch {
      setResetError("Could not reset password.");
      setResetLoading(false);
    }
  }

  const otherUsers = users.filter((u) => u.id !== currentUser?.id);
  const isAdmin = currentUser?.role === "admin";

  return (
    <>
      <PageHeader
        eyebrow="SECURITY SETTINGS"
        title="Account & Access"
        description="Change your password, review registry paths, and — for super admins — reset inspector passwords."
        breadcrumb={[{ label: "Security" }, { label: "Settings" }]}
      />

      {error ? (
        <Panel>
          <PanelBody>
            <p className="text-sm text-rose-700">{error}</p>
          </PanelBody>
        </Panel>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel accent>
            <PanelBody>
              <h2 className="font-display text-xl font-bold text-[var(--brand-ink)]">
                Signed-in Account
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-steel)]">
                    Name
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {currentUser?.fullName || "…"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-steel)]">
                    Username
                  </dt>
                  <dd className="mt-1">{currentUser?.username || "…"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-steel)]">
                    Email
                  </dt>
                  <dd className="mt-1">{currentUser?.email || "…"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-steel)]">
                    Role
                  </dt>
                  <dd className="mt-1 font-bold uppercase tracking-[0.14em] text-[var(--brand-orange)]">
                    {isAdmin ? "SUPER_ADMIN" : "INSPECTOR"}
                  </dd>
                </div>
              </dl>
              {isAdmin ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/certificate/admin/inspectors/">
                    <PrimaryButton type="button">Add Inspector</PrimaryButton>
                  </Link>
                </div>
              ) : null}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelBody>
              <h2 className="font-display text-xl font-bold text-[var(--brand-ink)]">
                Change Your Password
              </h2>
              <p className="mt-2 text-sm text-[var(--brand-steel)]">
                Enter your current password, then choose a new one (min. 10
                characters with upper, lower, and a number).
              </p>
              <form className="mt-5 space-y-4" onSubmit={onChangeOwnPassword}>
                {passwordError ? (
                  <div className="rounded-xl bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
                    {passwordError}
                  </div>
                ) : null}
                {passwordMessage ? (
                  <div className="rounded-xl bg-[#e8f5fc] px-4 py-3 text-sm text-[#013baa]">
                    {passwordMessage}
                  </div>
                ) : null}
                <Field label="Current Password" required>
                  <input
                    className={inputClass}
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field label="New Password" required>
                  <input
                    className={inputClass}
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={10}
                  />
                </Field>
                <Field label="Confirm New Password" required>
                  <input
                    className={inputClass}
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={10}
                  />
                </Field>
                <PrimaryButton type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Saving…" : "Update Password"}
                </PrimaryButton>
              </form>
            </PanelBody>
          </Panel>

          {isAdmin ? (
            <Panel accent>
              <PanelBody>
                <h2 className="font-display text-xl font-bold text-[var(--brand-ink)]">
                  Reset Another User&apos;s Password
                </h2>
                <p className="mt-2 text-sm text-[var(--brand-steel)]">
                  Super admins can set a new password for any inspector (or
                  other admin). To change your own password, use the form
                  above with your current password.
                </p>
                <form className="mt-5 space-y-4" onSubmit={onAdminResetPassword}>
                  {resetError ? (
                    <div className="rounded-xl bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
                      {resetError}
                    </div>
                  ) : null}
                  {resetMessage ? (
                    <div className="rounded-xl bg-[#e8f5fc] px-4 py-3 text-sm text-[#013baa]">
                      {resetMessage}
                    </div>
                  ) : null}
                  <Field label="User" required>
                    <select
                      className={inputClass}
                      value={resetUserId}
                      onChange={(e) => setResetUserId(e.target.value)}
                      required
                      disabled={otherUsers.length === 0}
                    >
                      {otherUsers.length === 0 ? (
                        <option value="">No other users yet</option>
                      ) : (
                        otherUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.fullName} ({user.username}) —{" "}
                            {user.role === "admin" ? "SUPER_ADMIN" : "INSPECTOR"}
                          </option>
                        ))
                      )}
                    </select>
                  </Field>
                  <Field label="New Password" required>
                    <input
                      className={inputClass}
                      type="password"
                      autoComplete="new-password"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      required
                      minLength={10}
                      disabled={otherUsers.length === 0}
                    />
                  </Field>
                  <Field label="Confirm New Password" required>
                    <input
                      className={inputClass}
                      type="password"
                      autoComplete="new-password"
                      value={resetConfirm}
                      onChange={(e) => setResetConfirm(e.target.value)}
                      required
                      minLength={10}
                      disabled={otherUsers.length === 0}
                    />
                  </Field>
                  <PrimaryButton
                    type="submit"
                    disabled={resetLoading || otherUsers.length === 0}
                  >
                    {resetLoading ? "Saving…" : "Reset Password"}
                  </PrimaryButton>
                </form>
              </PanelBody>
            </Panel>
          ) : null}

          <Panel>
            <PanelBody>
              <h2 className="font-display text-xl font-bold text-[var(--brand-ink)]">
                Registry Paths
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-steel)]">
                    Verification Base URL
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    {verificationBaseUrl || "…"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-steel)]">
                    Upload Directory
                  </dt>
                  <dd className="mt-1 font-mono text-xs">
                    {uploadDirectory || "…"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-steel)]">
                    Data Backend
                  </dt>
                  <dd className="mt-1 font-mono text-xs">
                    {storeBackend || "…"}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <Link href="/certificate/admin/certificates/">
                  <SecondaryButton type="button">
                    Back To Certificates
                  </SecondaryButton>
                </Link>
              </div>
            </PanelBody>
          </Panel>
        </div>
      )}
    </>
  );
}
