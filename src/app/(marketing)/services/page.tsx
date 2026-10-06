import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Inspection, calibration, testing, training, fabrication, PWHT, wellhead maintenance, QHSE, and logistics from Skyhoist Engineering Services.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative min-h-[52vh] overflow-hidden pt-24">
        <Image
          src="/images/refinery-night.jpg"
          alt="Illuminated industrial facility at night"
          fill
          priority
          className="object-cover hero-media"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,28,92,0.88),rgba(15,28,92,0.4))]" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-7xl items-end px-5 pb-14 md:px-8">
          <FadeUp>
            <div className="section-rule mb-5" />
            <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
              SERVICES
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold tracking-wide text-white md:text-6xl">
              A full technical service line for industrial work
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/78">
              Independent inspection, reliable calibration, practical training,
              and fabrication support—delivered with clear reporting and field
              discipline.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Stagger className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <StaggerItem key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="service-tile group block overflow-hidden rounded-[1.5rem] bg-white"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute left-5 top-5 text-xs font-bold tracking-[0.22em] text-white/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="font-display text-2xl font-bold tracking-wide text-[var(--brand-ink)] md:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-[var(--brand-steel)]">
                    {service.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-orange)]">
                    View service
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
