"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComplianceCard,
  Field,
  inputClass,
  Monogram,
  PageHeader,
  Panel,
  PanelBody,
  PrimaryButton,
  SecondaryButton,
} from "@/components/cert/ui";

type Inspector = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

export function InspectorsPanel({ inspectors }: { inspectors: Inspector[] }) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const res = await fetch("/api/cert/operators/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, username, email, password }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setFormError(data.error || "Could not create inspector.");
      return;
    }
    setFullName("");
    setUsername("");
    setEmail("");
    setPassword("");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remove this inspector account?")) return;
    const res = await fetch(`/api/cert/operators/${id}/`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not remove inspector.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <PageHeader
        eyebrow="ACCESS CONTROL"
        title="Add Inspector Account"
        description="Create another inspector who can access the dashboard with their own username or email and password. No email invite is sent."
        breadcrumb={[
          { label: "Security", href: "/certificate/admin/settings/" },
          { label: "Admin Access", href: "/certificate/admin/settings/" },
          { label: "Add Inspector" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel accent>
          <PanelBody>
            <form className="space-y-4" onSubmit={onSubmit}>
              {formError ? (
                <div className="rounded-xl bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
                  {formError}
                </div>
              ) : null}
              <Field label="Full Name">
                <input
                  className={inputClass}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Inspector full name"
                  required
                />
              </Field>
              <Field label="Username">
                <input
                  className={inputClass}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Unique username"
                  required
                />
              </Field>
              <Field label="Email Address">
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="inspector@example.com"
                  required
                />
              </Field>
              <Field
                label="Password"
                hint="At least 10 characters with upper, lower, and numeric characters."
              >
                <input
                  className={inputClass}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create strong password"
                  required
                />
              </Field>
              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? "Creating…" : "Create Inspector"}
                </PrimaryButton>
                <Link href="/certificate/admin/settings/">
                  <SecondaryButton type="button">Cancel</SecondaryButton>
                </Link>
              </div>
            </form>
          </PanelBody>
        </Panel>

        <div className="space-y-6">
          <ComplianceCard
            title="Access Control"
            items={[
              "Each inspector should have a separate account for traceability.",
              "Passwords must be at least 10 characters with mixed case and numbers.",
              "Inspectors can manage customers and certificates, but not other users.",
              "Admins can remove inspectors at any time from the list below.",
            ]}
          />

          <Panel>
            {inspectors.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-display text-xl font-bold">No inspectors yet</p>
                <p className="mt-2 text-sm text-[#5c503c]">
                  Add the first inspector from the form.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-[#d7c8ad] bg-[#f6f1e7] text-xs uppercase tracking-[0.14em] text-[#8a7c61]">
                    <tr>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Username</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectors.map((inspector) => (
                      <tr key={inspector.id} className="border-b border-[#efe6d4]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Monogram name={inspector.fullName} />
                            <span className="font-semibold">{inspector.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">{inspector.username}</td>
                        <td className="px-5 py-4 text-[#5c503c]">{inspector.email}</td>
                        <td className="px-5 py-4">
                          <SecondaryButton
                            type="button"
                            className="min-h-9 px-3"
                            onClick={() => void remove(inspector.id)}
                          >
                            Remove
                          </SecondaryButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
