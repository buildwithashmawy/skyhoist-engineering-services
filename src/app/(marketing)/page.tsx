import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Magnetic } from "@/components/magnetic";
import {
  CountUp,
  DriftX,
  FadeUp,
  HeroEnter,
  ParallaxMedia,
  RevealWipe,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl, services, site, values } from "@/lib/site";

const featured = services.slice(0, 5);
const stats = [
  { value: 95, suffix: "%", label: "Certified systems mindset" },
  { value: services.length, suffix: "", label: "Core service lines" },
  { value: 24, suffix: "/7", label: "Operational readiness" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO — brand, headline, line, CTAs, full-bleed image */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <ParallaxMedia className="absolute inset-0 scale-[1.12]" amount={16}>
          <Image
            src="/images/hero-rig-night.jpg"
            alt="Skyhoist field operations on an industrial site"
            fill
            priority
            className="object-cover hero-media"
            sizes="100vw"
          />
        </ParallaxMedia>
        <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(8,16,48,0.92)_0%,rgba(15,28,92,0.62)_48%,rgba(15,28,92,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(0,124,193,0.34),transparent_40%)]" />
        <div className="mesh-glow absolute inset-0" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-28 md:justify-center md:px-8 md:pb-28">
          <div className="max-w-3xl">
            <HeroEnter delay={0.08}>
              <Image
                src="/images/logo.png"
                alt={site.name}
                width={1537}
                height={1023}
                priority
                className="h-auto w-[min(100%,22rem)] object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:w-[min(100%,28rem)] md:w-[min(100%,34rem)]"
                sizes="(max-width: 640px) 22rem, (max-width: 768px) 28rem, 34rem"
              />
            </HeroEnter>

            <HeroEnter delay={0.26}>
              <h1 className="mt-8 max-w-2xl text-[clamp(1.4rem,3.4vw,2.45rem)] font-semibold leading-[1.15] text-white">
                {site.tagline}
              </h1>
            </HeroEnter>

            <HeroEnter delay={0.4}>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/78 md:text-lg">
                Inspection, calibration, testing, training, fabrication, and
                logistics support for teams that operate under pressure.
              </p>
            </HeroEnter>

            <HeroEnter delay={0.54}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Magnetic>
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
                </Magnetic>
                <Magnetic strength={0.25}>
                  <Link
                    href="/services"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "btn-lift h-12 border-white/35 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/18 hover:text-white",
                    )}
                  >
                    Explore services
                  </Link>
                </Magnetic>
              </div>
            </HeroEnter>
          </div>

          <HeroEnter delay={0.75} className="mt-16 hidden md:block">
            <a
              href="#who-we-are"
              className="cursor-link group inline-flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-white/55 transition hover:text-white"
            >
              <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-white/25">
                <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
                <span className="scroll-cue absolute inset-x-3 bottom-1.5 h-px bg-white/50" />
              </span>
              SCROLL
            </a>
          </HeroEnter>
        </div>
      </section>

      {/* STATS — below the fold */}
      <section className="relative border-y border-[var(--border)] bg-white/70 px-5 py-10 backdrop-blur md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.08}>
              <div className="flex items-baseline gap-3 border-l-2 border-[var(--brand-orange)] pl-4">
                <div className="font-display text-4xl font-bold tracking-wide text-[var(--brand-ink)] md:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="max-w-[9rem] text-xs font-semibold tracking-wide text-[var(--brand-steel)]">
                  {stat.label}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section
        id="who-we-are"
        className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32"
      >
        <div className="pointer-events-none absolute -left-24 top-20 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(0,124,193,0.12),transparent_68%)]" />
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <FadeUp>
            <div className="section-rule mb-6" />
            <p className="text-sm font-bold tracking-[0.24em] text-[var(--brand-orange)]">
              WHO WE ARE
            </p>
            <RevealWipe>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-wide text-[var(--brand-ink)] md:text-5xl">
                Technical discipline for{" "}
                <span className="text-brand-gradient">demanding industries</span>
              </h2>
            </RevealWipe>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--brand-steel)]">
              {site.intro}
            </p>
            <Magnetic className="mt-8 inline-block">
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "btn-lift border-[var(--brand-blue-deep)] text-[var(--brand-blue-deep)]",
                )}
              >
                About Skyhoist
                <ArrowUpRight className="size-4" />
              </Link>
            </Magnetic>
          </FadeUp>

          <FadeUp delay={0.12} className="relative group">
            <div
              data-cursor="media"
              className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] shadow-[0_30px_80px_rgba(15,28,92,0.18)]"
            >
              <Image
                src="/images/process-towers.jpg"
                alt="Industrial inspection and engineering operations"
                fill
                className="object-cover image-lift"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,28,92,0.55)] to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />
            </div>
            <div className="float-soft absolute -bottom-6 -left-4 max-w-xs rounded-2xl border border-white/50 bg-white/92 p-5 shadow-xl backdrop-blur md:-left-8">
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

      {/* SERVICES — editorial feature + grid */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#e8f2f9_0%,#f7fbfe_55%,#ffffff_100%)] px-5 py-24 md:px-8 md:py-32">
        <DriftX className="pointer-events-none absolute -right-10 top-10 hidden text-[11rem] font-display font-bold leading-none tracking-tight text-[rgba(1,59,170,0.05)] lg:block">
          SES
        </DriftX>
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
                className="cursor-link link-underline inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-blue-deep)]"
              >
                View all services
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>

          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            <FadeUp className="lg:col-span-7">
              <Link
                href={`/services/${featured[0]!.slug}`}
                className="service-tile group relative block overflow-hidden rounded-[1.6rem]"
              >
                <div data-cursor="media" className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={featured[0]!.image}
                    alt={featured[0]!.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(8,16,48,0.88)_100%)]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                  <span className="text-xs font-bold tracking-[0.22em] text-white/65">
                    01 · FEATURED
                  </span>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-wide text-white md:text-4xl">
                    {featured[0]!.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm text-white/75 md:text-base">
                    {featured[0]!.summary}
                  </p>
                </div>
              </Link>
            </FadeUp>

            <Stagger className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1" delay={0.08}>
              {featured.slice(1).map((service, index) => (
                <StaggerItem key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="service-tile group flex h-full overflow-hidden rounded-[1.35rem] bg-white"
                  >
                    <div
                      data-cursor="media"
                      className="relative w-[38%] min-w-[7.5rem] overflow-hidden"
                    >
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="180px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-5">
                      <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--brand-orange)]">
                        {String(index + 2).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-bold tracking-wide text-[var(--brand-ink)]">
                        {service.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--brand-steel)]">
                        {service.summary}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ATMOSPHERE BAND */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <ParallaxMedia className="absolute inset-0 scale-110" amount={10}>
          <Image
            src="/images/offshore-vessel.jpg"
            alt="Industrial facility operations"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </ParallaxMedia>
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,16,48,0.94),rgba(15,28,92,0.78))]" />
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
                <div className="glass-panel flex gap-4 rounded-2xl p-5 transition hover:bg-white/14">
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
            {values.map((value, index) => (
              <StaggerItem key={value.title}>
                <div className="group relative border-t-2 border-[var(--brand-orange)] pt-6 transition hover:border-[var(--brand-blue)]">
                  <span className="absolute -top-3 right-0 font-display text-5xl font-bold text-[rgba(1,59,170,0.07)] transition group-hover:text-[rgba(224,89,20,0.12)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
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
              alt="Skyhoist engineering services in the field"
              fill
              className="object-cover drift-soft"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,16,48,0.94),rgba(15,28,92,0.72))]" />
            <div className="shimmer-line relative px-8 py-14 md:px-14 md:py-16">
              <h2 className="max-w-2xl font-display text-4xl font-bold tracking-wide text-white md:text-5xl">
                Ready for your next industrial scope?
              </h2>
              <p className="mt-4 max-w-xl text-white/75">
                Talk with our team about inspection, testing, calibration,
                training, and technical support.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <a
                    href={getWhatsAppUrl(
                      `Hello Skyhoist — I'd like to discuss a service inquiry.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "btn-lift h-12 bg-[#25D366] px-6 text-white hover:bg-[#1ebe57]",
                    )}
                  >
                    <WhatsAppIcon className="size-4" />
                    WhatsApp us
                  </a>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "btn-lift h-12 border-white/35 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white",
                    )}
                  >
                    Get in touch
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
