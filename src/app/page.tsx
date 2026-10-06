import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Gauge } from "lucide-react";
import {
  CountUp,
  FadeUp,
  HeroEnter,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { services, site, values } from "@/lib/site";

const featured = services.slice(0, 6);

const stats = [
  { value: 95, suffix: "%", label: "Certified systems mindset" },
  { value: 8, suffix: "+", label: "Core service lines" },
  { value: 24, suffix: "/7", label: "Operational readiness" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src="/images/hero-rig-night.jpg"
          alt="Industrial drilling operations at night"
          fill
          priority
          className="object-cover hero-media"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,28,92,0.88)_0%,rgba(15,28,92,0.55)_52%,rgba(15,28,92,0.25)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(0,124,193,0.28),transparent_42%)]" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24">
          <div className="max-w-3xl">
            <HeroEnter delay={0.1}>
              <Image
                src="/images/logo.png"
                alt={site.name}
                width={824}
                height={548}
                priority
                className="h-auto w-[min(100%,22rem)] object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:w-[min(100%,28rem)] md:w-[min(100%,34rem)]"
                sizes="(max-width: 640px) 22rem, (max-width: 768px) 28rem, 34rem"
              />
            </HeroEnter>

            <HeroEnter delay={0.28}>
              <h1 className="mt-8 max-w-2xl text-[clamp(1.35rem,3.2vw,2.35rem)] font-semibold leading-tight text-white">
                {site.tagline}
              </h1>
            </HeroEnter>

            <HeroEnter delay={0.4}>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/78 md:text-lg">
                Inspection, calibration, testing, training, fabrication, and
                logistics support for teams that operate under pressure.
              </p>
            </HeroEnter>

            <HeroEnter delay={0.52}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "btn-lift orange-glow h-12 bg-[var(--brand-orange)] px-6 text-white hover:bg-[var(--brand-orange-dark)]",
                  )}
                >
                  Talk to our team
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "btn-lift h-12 border-white/35 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/18 hover:text-white",
                  )}
                >
                  Explore services
                </Link>
              </div>
            </HeroEnter>
          </div>

          <HeroEnter delay={0.7} className="mt-14 hidden md:block md:max-w-2xl">
            <div className="grid grid-cols-3 gap-8 border-t border-white/15 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-bold tracking-wide text-white">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-1 text-xs font-medium tracking-wide text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </HeroEnter>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <FadeUp>
            <div className="section-rule mb-6" />
            <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
              WHO WE ARE
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-wide text-[var(--brand-ink)] md:text-5xl">
              Technical discipline for{" "}
              <span className="text-brand-gradient">demanding industries</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--brand-steel)]">
              {site.intro}
            </p>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "btn-lift mt-8 border-[var(--brand-blue-deep)] text-[var(--brand-blue-deep)]",
              )}
            >
              About Skyhoist
              <ArrowUpRight className="size-4" />
            </Link>
          </FadeUp>

          <FadeUp delay={0.15} className="relative group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] shadow-[0_30px_80px_rgba(15,28,92,0.18)]">
              <Image
                src="/images/process-towers.jpg"
                alt="Process towers at industrial facility"
                fill
                className="object-cover image-lift"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,28,92,0.55)] to-transparent" />
            </div>
            <div className="float-soft absolute -bottom-6 -left-4 max-w-xs rounded-2xl border border-white/40 bg-white/90 p-5 shadow-xl backdrop-blur md:-left-8">
              <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-orange)]">
                SES®
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink)]">
                Independent services that improve quality, reduce risk, and
                verify compliance.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[linear-gradient(180deg,#eef5fa_0%,#f7fbfe_100%)] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="section-rule mb-6" />
                <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
                  SERVICES
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-wide text-[var(--brand-ink)] md:text-5xl">
                  Built for real field conditions
                </h2>
              </div>
              <Link
                href="/services"
                className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-blue-deep)]"
              >
                View all services
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeUp>

          <Stagger className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={0.05}>
            {featured.map((service, index) => (
              <StaggerItem key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="service-tile group block overflow-hidden rounded-[1.4rem] bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,28,92,0.85)] via-[rgba(15,28,92,0.2)] to-transparent" />
                    <span className="absolute left-5 top-5 text-xs font-bold tracking-[0.22em] text-white/75">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-bold tracking-wide text-[var(--brand-ink)]">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--brand-steel)]">
                      {service.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-orange)]">
                      Learn more
                      <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ATMOSPHERE BAND */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Image
          src="/images/offshore-vessel.jpg"
          alt="Offshore engineering vessel at night"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(15,28,92,0.92),rgba(40,22,112,0.78))]" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.2fr_1fr] md:px-8">
          <FadeUp>
            <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
              QUALITY & SAFETY
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-wide text-white md:text-5xl">
              Transparent reporting. Field-ready delivery.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              From inspection support to full technical service programs,
              Skyhoist helps clients maintain high standards across oil and gas,
              manufacturing, and industrial facilities.
            </p>
          </FadeUp>

          <Stagger className="grid gap-4" delay={0.1}>
            {[
              {
                icon: ShieldCheck,
                title: "Integrity first",
                text: "Quality and safety thinking built into every workflow.",
              },
              {
                icon: Gauge,
                title: "Operational speed",
                text: "Efficient processes without sacrificing precision.",
              },
              {
                icon: Sparkles,
                title: "Continuous improvement",
                text: "Better tools, standards, and reporting every cycle.",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="card-glow flex gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md hover:border-white/30 hover:bg-white/14">
                  <item.icon className="mt-1 size-6 shrink-0 text-[var(--brand-orange)]" />
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-wide text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">{item.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <div className="section-rule mb-6" />
            <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
              HOW WE WORK
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-wide text-[var(--brand-ink)] md:text-5xl">
              Standards that hold under pressure
            </h2>
          </FadeUp>

          <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="group border-t-2 border-[var(--brand-orange)] pt-6 transition hover:border-[var(--brand-blue)]">
                  <h3 className="font-display text-2xl font-bold tracking-wide text-[var(--brand-blue-deep)] transition group-hover:text-[var(--brand-blue)]">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--brand-steel)]">
                    {value.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <FadeUp>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(15,28,92,0.2)]">
            <Image
              src="/images/industrial-dusk.jpg"
              alt="Industrial skyline at dusk"
              fill
              className="object-cover drift-soft"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,28,92,0.92),rgba(40,22,112,0.72))]" />
            <div className="shimmer-line relative px-8 py-14 md:px-14 md:py-16">
              <h2 className="max-w-2xl font-display text-4xl font-bold tracking-wide text-white md:text-5xl">
                Ready for your next industrial scope?
              </h2>
              <p className="mt-4 max-w-xl text-white/75">
                Talk with {site.contactName}, {site.contactTitle}, about
                inspection, testing, calibration, training, and technical
                support.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "btn-lift orange-glow h-12 bg-[var(--brand-orange)] px-6 text-white hover:bg-[var(--brand-orange-dark)]",
                  )}
                >
                  Get in touch
                </Link>
                <a
                  href={`tel:${site.phones[0]}`}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "btn-lift h-12 border-white/35 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  Call {site.phones[0]}
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
