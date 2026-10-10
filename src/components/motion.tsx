"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type ReactNode } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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

function useRevealSafety(active: boolean) {
  const [safe, setSafe] = useState(false);
  useEffect(() => {
    if (active) {
      setSafe(true);
      return;
    }
    const t = window.setTimeout(() => setSafe(true), 1800);
    return () => window.clearTimeout(t);
  }, [active]);
  return safe;
}

export function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const safe = useRevealSafety(reduce);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce) return;

      gsap.set(el, { opacity: 0, y: 32 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    },
    { dependencies: [delay, reduce], revertOnUpdate: true },
  );

  return (
    <div
      ref={ref}
      className={className}
      style={safe || reduce ? undefined : { opacity: 0 }}
    >
      {children}
    </div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduce) return;
      const items = gsap.utils.toArray<HTMLElement>(".gsap-stagger-item", root);
      if (!items.length) return;

      gsap.set(items, { opacity: 0, y: 30 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        delay,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [delay, reduce], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const safe = useRevealSafety(reduce);

  return (
    <div
      className={`gsap-stagger-item${className ? ` ${className}` : ""}`}
      style={safe || reduce ? undefined : { opacity: 0 }}
    >
      {children}
    </div>
  );
}

export function HeroEnter({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
        },
      );
    },
    { dependencies: [delay, reduce], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const [n, setN] = useState(0);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduce) {
        setN(value);
        return;
      }

      const state = { n: 0 };
      const tween = gsap.to(state, {
        n: value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => setN(Math.round(state.n)),
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });

      return () => {
        tween.kill();
      };
    },
    { dependencies: [value, reduce], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
}

/** Subtle parallax scale/shift for hero media layers. */
export function ParallaxMedia({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce) return;
      gsap.to(el, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { dependencies: [reduce], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
