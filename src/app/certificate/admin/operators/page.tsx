"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
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

type Operator = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function OperatorsPage() {
  const router = useRouter();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/cert/operators/");
    const data = await res.json();
    if (res.status === 403) {
      setError("Only admins can manage operators.");
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setError(data.error || "Failed to load operators.");
      setLoading(false);
      return;
    }
    setOperators(data.operators);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

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
      setFormError(data.error || "Could not create operator.");
      return;
    }
    setFullName("");
    setUsername("");
    setEmail("");
    setPassword("");
    await load();
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remove this operator account?")) return;
    const res = await fetch(`/api/cert/operators/${id}/`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not remove operator.");
      return;
    }
    await load();
  }

  if (error) {
    return (
      <Panel>
        <PanelBody>
          <p className="text-sm text-rose-700">{error}</p>
        </PanelBody>
      </Panel>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="ACCESS CONTROL"
        title="Add Operator Account"
        description="Create another operator who can access the dashboard with their own username or email and password. No email invite is sent."
        breadcrumb={[
          { label: "Security", href: "/certificate/admin/settings/" },
          { label: "Admin Access", href: "/certificate/admin/settings/" },
          { label: "Add Operator" },
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
                  placeholder="Operator full name"
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
                  placeholder="operator@example.com"
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
                  {saving ? "Creating…" : "Create Operator"}
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
              "Each operator should have a separate account for traceability.",
              "Passwords must be at least 10 characters with mixed case and numbers.",
              "Operators can manage customers and certificates, but not other users.",
              "Admins can remove operators at any time from the list below.",
            ]}
          />

          <Panel>
            {loading ? (
              <p className="p-6 text-sm text-[#5c503c]">Loading operators…</p>
            ) : operators.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-display text-xl font-bold">No operators yet</p>
                <p className="mt-2 text-sm text-[#5c503c]">
                  Add the first operator from the form.
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
                    {operators.map((operator) => (
                      <tr key={operator.id} className="border-b border-[#efe6d4]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Monogram name={operator.fullName} />
                            <span className="font-semibold">{operator.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">{operator.username}</td>
                        <td className="px-5 py-4 text-[#5c503c]">{operator.email}</td>
                        <td className="px-5 py-4">
                          <SecondaryButton
                            type="button"
                            className="min-h-9 px-3"
                            onClick={() => void remove(operator.id)}
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
