import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, Phone, Clock3 } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { FadeUp, ParallaxMedia } from "@/components/motion";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Skyhoist Engineering Services in Cairo for inspection, calibration, testing, training, and industrial support.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative min-h-[48vh] overflow-hidden pt-24">
        <ParallaxMedia className="absolute inset-0 scale-110">
          <Image
            src="/images/offshore-sunset.jpg"
            alt="Dropped-object and site safety inspection"
            fill
            priority
            className="object-cover hero-media"
            sizes="100vw"
          />
        </ParallaxMedia>
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,28,92,0.88),rgba(15,28,92,0.4))]" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-7xl items-end px-5 pb-14 md:px-8">
          <FadeUp>
            <div className="section-rule mb-5" />
            <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
              CONTACT
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold tracking-wide text-white md:text-6xl">
              Get in touch with our team
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/78">
              Reach Skyhoist for inspection, calibration, testing, training, and
              technical support across demanding industrial operations.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-32">
        <FadeUp>
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-wide text-[var(--brand-ink)]">
                Cairo office
              </h2>
            </div>

            <div className="space-y-5 text-[var(--brand-ink)]">
              <div className="flex gap-3">
                <MapPin className="mt-1 size-5 text-[var(--brand-orange)]" />
                <p>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </p>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-1 size-5 text-[var(--brand-orange)]" />
                <div className="space-y-1">
                  {site.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      className="block font-semibold transition hover:text-[var(--brand-blue-deep)]"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <WhatsAppIcon className="mt-1 size-5 text-[#25D366]" />
                <div>
                  <a
                    href={getWhatsAppUrl(
                      `Hello Skyhoist — I'd like to discuss a service inquiry.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-semibold transition hover:text-[var(--brand-blue-deep)]"
                  >
                    WhatsApp {site.whatsapp}
                  </a>
                  <p className="mt-1 text-sm text-[var(--brand-steel)]">
                    Fastest way to reach the team during working hours.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="mt-1 size-5 text-[var(--brand-orange)]" />
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold transition hover:text-[var(--brand-blue-deep)]"
                >
                  {site.email}
                </a>
              </div>
              <div className="flex gap-3">
                <Clock3 className="mt-1 size-5 text-[var(--brand-orange)]" />
                <div>
                  <p>{site.hours.weekdays}</p>
                  <p className="text-[var(--brand-steel)]">
                    {site.hours.weekend}
                  </p>
                </div>
              </div>
              <a
                href={getWhatsAppUrl(
                  `Hello Skyhoist — I'd like to discuss a service inquiry.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "btn-lift h-12 w-full bg-[#25D366] text-white hover:bg-[#1ebe57] sm:w-auto",
                )}
              >
                <WhatsAppIcon className="size-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <div className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[0_24px_60px_rgba(15,28,92,0.1)] md:p-8">
            <h2 className="font-display text-2xl font-bold tracking-wide text-[var(--brand-ink)]">
              Tell us what your operation needs
            </h2>
            <p className="mt-2 text-sm text-[var(--brand-steel)]">
              We typically respond within one business day. For urgent requests,
              WhatsApp is usually fastest.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
