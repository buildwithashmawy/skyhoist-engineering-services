"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileBadge2,
  FilePlus2,
  LogOut,
  Settings,
  ShieldUser,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/cert/types";

const links = [
  {
    href: "/certificate/admin/inspectors/",
    label: "Add Inspector",
    icon: ShieldUser,
    adminOnly: true,
  },
  { href: "/certificate/admin/customers/new/", label: "Add Customer", icon: UserPlus },
  { href: "/certificate/admin/customers/", label: "Customer Ledger", icon: Users },
  {
    href: "/certificate/admin/certificates/new/",
    label: "Add Certificate",
    icon: FilePlus2,
  },
  {
    href: "/certificate/admin/certificates/",
    label: "Certificates",
    icon: FileBadge2,
  },
] as const;

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/certificate/admin/customers/") {
    return pathname === href;
  }
  if (href === "/certificate/admin/certificates/") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(href);
}

export function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/cert/logout/", { method: "POST" });
    router.replace("/certificate/login/");
    router.refresh();
  }

  const visible = links.filter(
    (link) => !("adminOnly" in link && link.adminOnly) || user.role === "admin",
  );

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#171310]">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-[linear-gradient(165deg,#013baa_0%,#007cc1_58%,#04b5ff_100%)] py-8 text-white shadow-[12px_0_40px_rgba(1,59,170,0.28)] md:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(224,89,20,0.28),transparent_46%)]" />
        <div className="relative px-6">
          <Image
            src="/images/logo-white.png"
            alt="Skyhoist"
            width={1538}
            height={1023}
            className="h-auto w-full object-contain"
            priority
          />
          <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#ffb087]">
            Certificate Registry
          </p>
        </div>

        <nav className="relative mt-8 flex-1 space-y-1">
          {visible.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-6 py-4 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white",
                  active &&
                    "bg-white/14 font-bold text-white before:absolute before:left-0 before:h-full before:w-1 before:bg-[#ff8a3d]",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto space-y-1 border-t border-white/15 pt-4">
          <Link
            href="/certificate/admin/settings/"
            className={cn(
              "relative flex items-center gap-3 px-6 py-4 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white",
              isActive(pathname, "/certificate/admin/settings/") &&
                "bg-white/14 font-bold text-white before:absolute before:left-0 before:h-full before:w-1 before:bg-[#ff8a3d]",
            )}
          >
            <Settings className="size-4 shrink-0" />
            Settings
          </Link>
          <div className="px-6 pb-2 pt-3">
            <p className="font-display text-sm font-bold tracking-wide">
              {user.fullName}
            </p>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#ffb087]">
              {user.role === "admin" ? "SUPER_ADMIN" : "INSPECTOR"}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 px-6 py-4 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="md:ml-64">
        <header className="flex items-center justify-between gap-3 border-b border-[#d7c8ad] bg-[#fffdf8]/90 px-5 py-3 backdrop-blur">
          <div className="md:hidden">
            <p className="font-display text-sm font-bold tracking-wide">
              Certificate Portal
            </p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center rounded-full border border-[#d7c8ad] bg-[#f6f1e7] px-3 py-1.5 text-xs font-semibold text-[#5c503c]">
              {user.email}
            </span>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-[#d7c8ad] bg-[#fffdf8] px-3 py-2 md:hidden">
          {[
            ...visible,
            {
              href: "/certificate/admin/settings/",
              label: "Settings",
              icon: Settings,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold",
                isActive(pathname, item.href)
                  ? "bg-[#013baa] text-white"
                  : "bg-[#f6f1e7] text-[#171310]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <main className="min-h-[calc(100vh-3.5rem)] px-5 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
