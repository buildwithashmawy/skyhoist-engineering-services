import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[var(--brand-navy)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(0,124,193,0.35),transparent_34%),radial-gradient(circle_at_90%_100%,rgba(224,89,20,0.22),transparent_30%)]" />
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1.1fr] md:px-8 md:py-20">
        <div>
          <SiteLogo height={72} />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Independent inspection, calibration, testing, training, and
            industrial support with dependable technical standards.
          </p>
        </div>

        <div>
          <h3 className="font-display text-xs font-bold tracking-[0.24em] text-white/90">
            EXPLORE
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs font-bold tracking-[0.24em] text-white/90">
            CONTACT
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--brand-orange)]" />
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-[var(--brand-orange)]" />
              <span className="space-y-1">
                {site.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    className="block transition hover:text-white"
                  >
                    {phone}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-[var(--brand-orange)]" />
              <a
                href={`mailto:${site.email}`}
                className="transition hover:text-white"
              >
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-5 py-5 text-center text-xs text-white/45 md:px-8">
        © {new Date().getFullYear()} {site.name}. {site.mark} All rights reserved.
      </div>
    </footer>
  );
}
