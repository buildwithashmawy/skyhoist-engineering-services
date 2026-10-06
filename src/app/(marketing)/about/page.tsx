import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Skyhoist Engineering Services — quality, safety, and technical delivery for industrial operations.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[58vh] overflow-hidden pt-24">
        <Image
          src="/images/plant-waterfront.jpg"
          alt="Industrial plant along the waterfront"
          fill
          priority
          className="object-cover hero-media"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,28,92,0.88),rgba(15,28,92,0.4))]" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl items-end px-5 pb-14 md:px-8">
          <FadeUp>
            <div className="section-rule mb-5 bg-[linear-gradient(90deg,var(--brand-orange),transparent)]" />
            <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
              WHO WE ARE
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold tracking-wide text-white md:text-6xl">
              Engineering services with industrial discipline
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/78">
              Skyhoist supports industrial teams that care about quality,
              safety, and integrity—across inspection, calibration, testing,
              training, and technical delivery.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:px-8 md:py-32">
        <FadeUp>
          <div className="section-rule mb-6" />
          <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
            OUR COMMITMENT
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-wide text-[var(--brand-ink)]">
            Quality assurance for demanding industries
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--brand-steel)]">
            {site.intro}
          </p>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--brand-steel)] md:text-lg">
            {site.mission.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.12} className="group">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] shadow-[0_30px_80px_rgba(15,28,92,0.16)]">
            <Image
              src="/images/process-towers.jpg"
              alt="Process towers at golden hour"
              fill
              className="object-cover image-lift"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </FadeUp>
      </section>

      <section className="bg-white/70 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeUp>
            <h2 className="font-display text-4xl font-bold tracking-wide text-[var(--brand-ink)] md:text-5xl">
              Mission, vision, and values
            </h2>
          </FadeUp>
          <Stagger className="mt-12 grid gap-8 lg:grid-cols-3">
            <StaggerItem>
              <div className="border-t-2 border-[var(--brand-blue)] pt-5">
                <h3 className="font-display text-2xl font-bold tracking-wide text-[var(--brand-blue-deep)]">
                  Mission
                </h3>
                <p className="mt-3 text-[var(--brand-steel)]">
                  Deliver world-class inspection, calibration, testing, and
                  training services that help clients achieve excellence in
                  quality, safety, and compliance.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="border-t-2 border-[var(--brand-orange)] pt-5">
                <h3 className="font-display text-2xl font-bold tracking-wide text-[var(--brand-blue-deep)]">
                  Vision
                </h3>
                <p className="mt-3 text-[var(--brand-steel)]">
                  Be a competitive, productive technical service organization
                  that continually strengthens competency, tools, and delivery
                  systems.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="border-t-2 border-[var(--brand-navy)] pt-5">
                <h3 className="font-display text-2xl font-bold tracking-wide text-[var(--brand-blue-deep)]">
                  Values
                </h3>
                <ul className="mt-3 space-y-2 text-[var(--brand-steel)]">
                  {values.map((value) => (
                    <li key={value.title}>
                      <span className="font-semibold text-[var(--brand-ink)]">
                        {value.title}.
                      </span>{" "}
                      {value.text}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <FadeUp>
          <div className="grid gap-8 rounded-[2rem] bg-[var(--brand-navy)] px-8 py-12 text-white md:grid-cols-[1.3fr_1fr] md:px-12">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-wide md:text-4xl">
                Based in Cairo, ready for industrial scopes
              </h2>
              <p className="mt-4 text-white/75">
                {site.address.line1}
                <br />
                {site.address.line2}
              </p>
            </div>
            <div className="flex items-end">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants(),
                  "btn-lift orange-glow bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-dark)]",
                )}
              >
                Contact Skyhoist
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
