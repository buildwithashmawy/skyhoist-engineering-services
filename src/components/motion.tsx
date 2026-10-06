"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

function useMotionReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready;
}

export function FadeUp({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18, margin: "0px 0px -6% 0px" });
  const [safe, setSafe] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setSafe(true), 1800);
    return () => window.clearTimeout(t);
  }, []);

  const show = !ready || reduce || inView || safe;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        show
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 28 }
      }
      transition={{ duration: 0.75, delay: show && ready && !reduce ? delay : 0, ease }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const [safe, setSafe] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setSafe(true), 1800);
    return () => window.clearTimeout(t);
  }, []);

  const show = !ready || reduce || inView || safe;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={show ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce || !ready ? 0 : 0.1,
            delayChildren: reduce || !ready ? 0 : delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  return (
    <motion.div
      className={className}
      variants={{
        hidden:
          reduce || !ready
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeroEnter({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  return (
    <motion.div
      className={className}
      initial={ready && !reduce ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce || !ready ? 0 : 0.85,
        delay: reduce || !ready ? 0 : delay,
        ease,
      }}
    >
      {children}
    </motion.div>
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
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduce, inView]);

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
}
