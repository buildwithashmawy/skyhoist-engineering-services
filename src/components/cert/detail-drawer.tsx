"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function DetailDrawer({
  open,
  title,
  eyebrow,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-[rgba(23,19,16,0.45)] transition",
          open ? "opacity-100" : "opacity-0",
        )}
        aria-label="Close details"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-[-24px_0_60px_rgba(15,28,92,0.18)] transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="border-b border-[var(--border)] px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              {eyebrow ? (
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="mt-1 font-display text-2xl font-bold tracking-wide text-[var(--brand-ink)]">
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--brand-sky)] text-[var(--brand-ink)] transition hover:bg-[#d7ebf7]"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </aside>
    </div>
  );
}
