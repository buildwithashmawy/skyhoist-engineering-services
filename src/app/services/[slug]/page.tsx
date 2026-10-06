import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { FadeUp } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getService, services } from "@/lib/site";

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
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          className="object-cover hero-media"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,28,92,0.9),rgba(15,28,92,0.4))]" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl flex-col justify-end px-5 pb-14 md:px-8">
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
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-[1.4fr_0.8fr] md:px-8 md:py-32">
        <FadeUp>
          <h2 className="font-display text-3xl font-bold tracking-wide text-[var(--brand-ink)] md:text-4xl">
            Scope overview
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[var(--brand-steel)]">
            {service.description}
          </p>
          <ul className="mt-8 space-y-4">
            {service.points.map((point) => (
              <li key={point} className="flex gap-3 text-[var(--brand-ink)]">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--brand-orange)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp delay={0.12}>
          <div className="rounded-[1.5rem] bg-[var(--brand-navy)] p-8 text-white">
            <h3 className="font-display text-2xl font-bold tracking-wide">
              Need this service?
            </h3>
            <p className="mt-3 text-sm text-white/75">
              Tell us about your site requirements and we will help shape a
              clear technical response.
            </p>
            <Link
              href="/contact"
              className={cn(
                buttonVariants(),
                "mt-6 orange-glow bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-dark)]",
              )}
            >
              Request a proposal
            </Link>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
