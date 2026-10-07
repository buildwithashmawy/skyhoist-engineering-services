"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ShieldCheck } from "lucide-react";
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
    <div className="relative min-h-svh overflow-hidden bg-[#eef5fb]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(4,181,255,0.22),transparent_42%),radial-gradient(circle_at_88%_82%,rgba(224,89,20,0.14),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(1,59,170,0.08),transparent)]" />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid min-h-[min(40rem,calc(100svh-4rem))] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_80px_rgba(1,59,170,0.16)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative flex flex-col justify-between bg-[linear-gradient(155deg,#013baa_0%,#007cc1_55%,#04b5ff_100%)] px-8 py-10 text-white sm:px-10 lg:px-12 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(224,89,20,0.28),transparent_44%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,rgba(1,40,120,0.35),transparent)]" />

            <div className="relative">
              <Image
                src="/images/logo-white.png"
                alt="Skyhoist Engineering Services"
                width={1538}
                height={1023}
                className="h-auto w-52 object-contain sm:w-60 lg:w-64"
                priority
              />
            </div>

            <div className="relative mt-12 max-w-md lg:mt-0">
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#ffb087]">
                <ShieldCheck className="size-3.5" />
                CERTIFICATE REGISTRY
              </p>
              <h1 className="mt-4 font-display text-[clamp(1.85rem,3vw,2.65rem)] font-bold leading-tight tracking-wide">
                Sign in to manage certificates
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/78 sm:text-base">
                Private operator access for customers, certificate records, and
                public verification tokens.
              </p>
              <ul className="mt-8 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ff8a3d]" />
                  Customer and certificate ledger
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ff8a3d]" />
                  Operator access controlled by admin
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ff8a3d]" />
                  Public verify links for issued certificates
                </li>
              </ul>
            </div>
          </section>

          <section className="flex flex-col justify-center px-8 py-10 sm:px-10 lg:px-12 lg:py-12">
            <div className="mx-auto w-full max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#007cc1]">
                Secure access
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-wide text-[#0f1c3d]">
                Open Dashboard
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5a6b82]">
                Enter your username or email and password to continue.
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
                <PrimaryButton
                  type="submit"
                  className="w-full bg-[#013baa] hover:bg-[#012f8a]"
                  disabled={loading}
                >
                  {loading ? "Opening…" : "Open Dashboard"}
                </PrimaryButton>
              </form>

              <p className="mt-8 text-center text-xs text-[#7a8799]">
                Looking for the public site?{" "}
                <Link
                  href="/"
                  className="font-semibold text-[#013baa] underline-offset-2 hover:underline"
                >
                  Return home
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
