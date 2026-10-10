"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl, nav, site } from "@/lib/site";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

function MenuIcon({ open }: { open: boolean }) {
  const top = useRef<HTMLSpanElement>(null);
  const mid = useRef<HTMLSpanElement>(null);
  const bot = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!top.current || !mid.current || !bot.current) return;
      if (open) {
        gsap.to(top.current, { y: 7, rotate: 45, duration: 0.35, ease: "power2.out" });
        gsap.to(mid.current, {
          opacity: 0,
          scaleX: 0.4,
          x: 6,
          duration: 0.22,
          ease: "power2.out",
        });
        gsap.to(bot.current, { y: -7, rotate: -45, duration: 0.35, ease: "power2.out" });
      } else {
        gsap.to(top.current, { y: 0, rotate: 0, duration: 0.35, ease: "power2.out" });
        gsap.to(mid.current, {
          opacity: 1,
          scaleX: 1,
          x: 0,
          duration: 0.22,
          ease: "power2.out",
        });
        gsap.to(bot.current, { y: 0, rotate: 0, duration: 0.35, ease: "power2.out" });
      }
    },
    { dependencies: [open] },
  );

  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <span
        ref={top}
        className="absolute left-0 top-0 h-[2px] w-full origin-center rounded-full bg-current"
      />
      <span
        ref={mid}
        className="absolute left-0 top-[7px] h-[2px] w-full rounded-full bg-current"
      />
      <span
        ref={bot}
        className="absolute left-0 top-[14px] h-[2px] w-full origin-center rounded-full bg-current"
      />
    </span>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const aside = asideRef.current;
      const links = linksRef.current
        ? gsap.utils.toArray<HTMLElement>(".mobile-nav-link", linksRef.current)
        : [];
      if (!panel || !aside) return;

      if (!open) {
        gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });
      gsap.set(panel, { autoAlpha: 1, pointerEvents: "auto" });
      tl.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.28 }).fromTo(
        aside,
        { x: "105%" },
        { x: 0, duration: reduce ? 0 : 0.48 },
        0,
      );
      if (links.length && !reduce) {
        tl.fromTo(
          links,
          { opacity: 0, x: 28 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.07 },
          0.18,
        );
      }
    },
    { dependencies: [open, reduce] },
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || open
            ? "glass-nav py-2 shadow-[0_10px_40px_rgba(8,16,50,0.25)]"
            : "bg-transparent py-4",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center transition duration-500 hover:scale-[1.02]"
            onClick={() => setOpen(false)}
          >
            <SiteLogo
              priority
              height={52}
              className="drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-semibold tracking-wide text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "btn-lift ml-3 orange-glow bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-dark)]",
              )}
            >
              Request a proposal
            </Link>
          </nav>

          <button
            type="button"
            className={cn(
              "relative z-[60] inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition md:hidden",
              "hover:bg-white/18 active:scale-95",
              open && "border-[var(--brand-orange)]/55 bg-[var(--brand-orange)]/25",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </header>

      <div
        ref={panelRef}
        className="fixed inset-0 z-40 md:hidden"
        style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute inset-0 bg-[rgba(6,12,36,0.62)] backdrop-blur-[10px]"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />

        <aside
          ref={asideRef}
          className="absolute inset-y-0 right-0 flex w-[min(100%,22.5rem)] flex-col overflow-hidden border-l border-white/10 text-white shadow-[-24px_0_80px_rgba(0,0,0,0.4)]"
          style={{
            background:
              "linear-gradient(165deg, #0c1749 0%, #162a7c 42%, #281670 100%)",
          }}
        >
          <div className="pointer-events-none absolute -right-20 top-16 size-64 rounded-full bg-[radial-gradient(circle,rgba(224,89,20,0.32),transparent_68%)]" />
          <div className="pointer-events-none absolute -left-14 bottom-24 size-56 rounded-full bg-[radial-gradient(circle,rgba(0,124,193,0.3),transparent_68%)]" />
          <div className="grain pointer-events-none absolute inset-0 opacity-35" />

          <div className="relative flex items-end justify-between px-6 pb-1 pt-[5rem]">
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.32em] text-[var(--brand-orange)]">
                NAVIGATE
              </p>
              <p className="mt-1.5 font-display text-2xl font-bold tracking-[0.14em]">
                SKYHOIST
              </p>
            </div>
            <div className="mb-1 h-px w-16 bg-gradient-to-l from-[var(--brand-orange)] to-transparent" />
          </div>

          <nav ref={linksRef} className="relative mt-8 flex flex-1 flex-col gap-1.5 px-4">
            {nav.map((item, index) => (
              <div key={item.href} className="mobile-nav-link">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-4 transition"
                >
                  <span className="pointer-events-none absolute inset-0 bg-white/0 transition duration-300 group-hover:bg-white/10 group-active:bg-white/14" />
                  <span className="pointer-events-none absolute inset-y-3 left-0 w-[3px] origin-top scale-y-0 rounded-full bg-[var(--brand-orange)] transition duration-300 group-hover:scale-y-100" />
                  <span className="relative flex items-baseline gap-3.5">
                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-white/30 transition group-hover:text-[var(--brand-orange)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[1.65rem] font-bold tracking-[0.08em]">
                      {item.label}
                    </span>
                  </span>
                  <ArrowUpRight className="relative size-4 -translate-x-1 text-[var(--brand-orange)] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </div>
            ))}
          </nav>

          <div className="relative mt-auto space-y-5 border-t border-white/10 px-5 py-6">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ size: "lg" }),
                "btn-lift orange-glow h-12 w-full bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-dark)]",
              )}
            >
              Request a proposal
              <ArrowUpRight className="size-4" />
            </Link>
            <div className="space-y-2.5 text-sm text-white/70">
              <a
                href={getWhatsAppUrl(
                  `Hello Skyhoist — I'd like to discuss a service inquiry.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition hover:text-white"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#25D366]/20">
                  <WhatsAppIcon className="size-3.5 text-[#25D366]" />
                </span>
                WhatsApp {site.whatsapp}
              </a>
              <a
                href={`tel:${site.phones[0]}`}
                className="flex items-center gap-2.5 transition hover:text-white"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/10">
                  <Phone className="size-3.5 text-[var(--brand-orange)]" />
                </span>
                {site.phones[0]}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2.5 transition hover:text-white"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/10">
                  <Mail className="size-3.5 text-[var(--brand-orange)]" />
                </span>
                {site.email}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
