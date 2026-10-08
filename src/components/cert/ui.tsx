import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {breadcrumb?.length ? (
          <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c61]">
            {breadcrumb.map((item, index) => (
              <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
                {index > 0 ? <span className="text-[#c9a24a]">›</span> : null}
                {item.href ? (
                  <Link href={item.href} className="transition hover:text-[#171310]">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#c9a24a]">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? (
          <p className="text-xs font-bold tracking-[0.22em] text-[#c9a24a]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-3xl font-bold tracking-wide text-[#171310] md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-[#5c503c]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  children,
  className,
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.4rem] border border-[#d7c8ad] bg-[#fffdf8] shadow-[0_18px_40px_rgba(23,19,16,0.06)]",
        accent && "border-t-[3px] border-t-[#c9a24a]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PanelBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6 md:p-8", className)}>{children}</div>;
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5c503c]">
        {label}
      </span>
      {children}
      {hint ? <span className="block text-xs text-[#8a7c61]">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-[#d7c8ad] bg-[#f6f1e7] px-4 py-3 text-sm text-[#171310] outline-none transition placeholder:text-[#8a7c61] focus:border-[#c9a24a] focus:bg-[#fffdf8]";

export function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized === "valid" || normalized === "verified"
      ? "bg-[#ffe7ad] text-[#674500]"
      : normalized === "pending"
        ? "bg-[#e6dac2] text-[#5c503c]"
        : normalized === "expired" || normalized === "flagged"
          ? "bg-[#ffdad6] text-[#93000a]"
          : "bg-[#ffdad6] text-[#93000a]";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]",
        tone,
      )}
    >
      {status === "verified" ? "valid" : status}
    </span>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl bg-[#013baa] px-5 text-sm font-bold text-white transition hover:bg-[#012f8a] disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl bg-[#f6f1e7] px-5 text-sm font-bold text-[#171310] transition hover:bg-[#ede4d3] disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Monogram({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
  return (
    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#013baa] text-xs font-bold tracking-wide text-white">
      {initials || "?"}
    </span>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "valid" | "pending" | "danger";
}) {
  const styles = {
    default: "bg-[#fffdf8] border-[#d7c8ad]",
    valid: "bg-[#fff7e0] border-[#ffe7ad]",
    pending: "bg-[#f6f1e7] border-[#e6dac2]",
    danger: "bg-[#fff1f0] border-[#ffdad6]",
  }[tone];
  return (
    <div className={cn("rounded-2xl border px-5 py-4", styles)}>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8a7c61]">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-[#171310]">{value}</p>
    </div>
  );
}

export function ComplianceCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-[#013baa] px-5 py-5 text-white shadow-[0_18px_40px_rgba(1,59,170,0.22)]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb087]">
        {title}
      </p>
      <ul className="mt-4 space-y-3 text-sm text-white/80">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[0.65rem] text-[#ffb087]">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RecordsBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#ffe7ad] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#674500]">
      {count} record{count === 1 ? "" : "s"}
    </span>
  );
}
