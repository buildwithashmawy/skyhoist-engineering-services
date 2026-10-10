import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { FadeUp, HeroEnter, ParallaxMedia } from "@/components/motion";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getService, getWhatsAppUrl, services } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <section className="relative min-h-[58vh] overflow-hidden pt-24">
        <ParallaxMedia className="absolute inset-0 scale-110">
          <Image
            src={service.image}
            alt={
              service.slug === "inspection-services"
                ? "Technician inspecting an elevator for safety compliance"
                : service.title
            }
            fill
            priority
            className="object-cover hero-media"
            sizes="100vw"
          />
        </ParallaxMedia>
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,28,92,0.9),rgba(15,28,92,0.4))]" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl flex-col justify-end px-5 pb-14 md:px-8">
          <HeroEnter>
            <Link
              href="/services"
              className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              All services
            </Link>
            <h1 className="max-w-3xl font-display text-5xl font-bold tracking-wide text-white md:text-6xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/78">
              {service.summary}
            </p>
          </HeroEnter>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.45fr_0.75fr] md:px-8 md:py-24">
        <div className="space-y-14">
          <FadeUp>
            <div className="section-rule mb-6" />
            <h2 className="font-display text-3xl font-bold tracking-wide text-[var(--brand-ink)] md:text-4xl">
              Scope overview
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--brand-steel)]">
              {service.description}
            </p>
            <ul className="mt-8 space-y-3">
              {service.points.map((point) => (
                <li key={point} className="flex gap-3 text-[var(--brand-ink)]">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--brand-orange)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </FadeUp>

          {service.outcomes.length ? (
            <FadeUp>
              <h2 className="font-display text-3xl font-bold tracking-wide text-[var(--brand-ink)] md:text-4xl">
                How we help
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {service.outcomes.map((outcome, index) => (
                  <div
                    key={outcome}
                    className="border-t-2 border-[var(--brand-orange)] pt-4"
                  >
                    <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-orange)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 text-[var(--brand-ink)]">{outcome}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          ) : null}

          {service.sections.map((section) => (
            <FadeUp key={section.heading}>
              <h2 className="font-display text-2xl font-bold tracking-wide text-[var(--brand-ink)] md:text-3xl">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-base leading-relaxed text-[var(--brand-steel)] md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-[var(--brand-ink)]"
                    >
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--brand-orange)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.12} className="md:sticky md:top-28 md:self-start">
          <div className="rounded-[1.5rem] bg-[var(--brand-navy)] p-8 text-white">
            <h3 className="font-display text-2xl font-bold tracking-wide">
              Need this service?
            </h3>
            <p className="mt-3 text-sm text-white/75">
              Tell us about your site requirements and we will help shape a
              clear technical response.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={getWhatsAppUrl(
                  `Hello Skyhoist — I'm interested in ${service.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "bg-[#25D366] text-white hover:bg-[#1ebe57]",
                )}
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp us
              </a>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Request a proposal
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-white p-6">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-orange)]">
              RELATED SERVICES
            </p>
            <ul className="mt-4 space-y-2">
              {(() => {
                const index = services.findIndex((item) => item.slug === service.slug);
                const related = [
                  ...services.slice(index + 1),
                  ...services.slice(0, index),
                ].slice(0, 5);
                return related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="text-sm font-semibold text-[var(--brand-blue-deep)] transition hover:text-[var(--brand-orange)]"
                    >
                      {item.title}
                    </Link>
                  </li>
                ));
              })()}
            </ul>
            <Link
              href="/services"
              className="mt-5 inline-flex text-sm font-semibold text-[var(--brand-ink)] underline-offset-2 hover:underline"
            >
              View all services
            </Link>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
