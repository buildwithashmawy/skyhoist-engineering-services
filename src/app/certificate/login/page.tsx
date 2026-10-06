"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Field, inputClass, PrimaryButton } from "@/components/cert/ui";

export default function CertificateLoginPage() {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cert/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Incorrect username/email or password.");
        setLoading(false);
        return;
      }

      // Confirm the session cookie is readable before leaving the login page.
      const me = await fetch("/api/cert/me/", { credentials: "include" });
      if (!me.ok) {
        setError(
          "Signed in, but the session cookie was not kept. Check that the site is on HTTPS and refresh once.",
        );
        setLoading(false);
        return;
      }

      // Full navigation so the server layout always sees the new cookie.
      window.location.assign("/certificate/admin/customers/");
    } catch {
      setError("Unable to sign in right now.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.8rem] bg-[#fffdf8] shadow-[0_30px_80px_rgba(23,19,16,0.16)] md:grid-cols-2">
        <section className="relative flex flex-col justify-between bg-black px-8 py-10 text-white md:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,74,0.28),transparent_42%)]" />
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="Skyhoist Engineering Services"
              width={824}
              height={548}
              className="h-auto w-56 object-contain md:w-64"
              priority
            />
          </div>
          <div className="relative mt-10 md:mt-0">
            <p className="text-sm font-bold tracking-[0.22em] text-[#c9a24a]">
              CERTIFICATE REGISTRY
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-wide md:text-4xl">
              Admin Login
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Use the saved username or email with the admin password to open
              the site.
            </p>
          </div>
        </section>

        <section className="px-8 py-10 md:px-10">
          <h2 className="font-display text-2xl font-bold tracking-wide text-[#171310]">
            Open Dashboard
          </h2>
          <p className="mt-2 text-sm text-[#5c503c]">
            Sign in to manage customers, certificates, and operator access.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            {error ? (
              <div className="rounded-xl bg-[#ffdad6] px-4 py-3 text-sm font-medium text-[#93000a]">
                {error}
              </div>
            ) : null}
            <Field label="Username or Email">
              <input
                className={inputClass}
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="Enter admin username or email"
                autoComplete="username"
                required
              />
            </Field>
            <Field label="Password">
              <input
                className={inputClass}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
              />
            </Field>
            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Opening…" : "Open Dashboard"}
            </PrimaryButton>
          </form>
        </section>
      </div>
    </div>
  );
}
