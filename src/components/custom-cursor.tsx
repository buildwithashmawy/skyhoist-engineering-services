"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "link" | "media" | "hidden";

function labelFor(mode: CursorMode) {
  if (mode === "link") return "Open";
  if (mode === "media") return "View";
  return "";
}

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const modeRef = useRef<CursorMode>("default");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setEnabled(fine && !reduce && !touch);
  }, []);

  useGSAP(
    () => {
      if (!enabled) return;
      const tip = tipRef.current;
      const ring = ringRef.current;
      const root = rootRef.current;
      if (!tip || !ring || !root) return;

      document.documentElement.classList.add("has-custom-cursor");

      const tipX = gsap.quickTo(tip, "x", { duration: 0.12, ease: "power3.out" });
      const tipY = gsap.quickTo(tip, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });

      const setMode = (mode: CursorMode) => {
        if (modeRef.current === mode) return;
        modeRef.current = mode;
        const label = labelRef.current;

        if (mode === "hidden") {
          gsap.to([tip, ring], { autoAlpha: 0, duration: 0.2 });
          return;
        }

        gsap.to([tip, ring], { autoAlpha: 1, duration: 0.2 });

        if (mode === "link" || mode === "media") {
          gsap.to(ring, {
            width: 72,
            height: 72,
            borderColor: "rgba(224, 89, 20, 0.95)",
            backgroundColor: "rgba(224, 89, 20, 0.16)",
            duration: 0.35,
            ease: "power3.out",
          });
          gsap.to(tip, {
            scale: 0,
            duration: 0.25,
            ease: "power2.out",
          });
          if (label) {
            label.textContent = labelFor(mode);
            gsap.to(label, { autoAlpha: 1, scale: 1, duration: 0.25 });
          }
        } else {
          gsap.to(ring, {
            width: 36,
            height: 36,
            borderColor: "rgba(255, 255, 255, 0.75)",
            backgroundColor: "rgba(1, 59, 170, 0.08)",
            duration: 0.35,
            ease: "power3.out",
          });
          gsap.to(tip, {
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          });
          if (label) {
            gsap.to(label, { autoAlpha: 0, scale: 0.85, duration: 0.2 });
          }
        }
      };

      const onMove = (event: MouseEvent) => {
        tipX(event.clientX);
        tipY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      const onOver = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        if (
          target.closest(
            "input, textarea, select, [data-cursor='hide'], .no-custom-cursor",
          )
        ) {
          setMode("hidden");
          return;
        }
        if (target.closest("[data-cursor='media'], .service-tile img, figure")) {
          setMode("media");
          return;
        }
        if (
          target.closest(
            "a, button, [role='button'], label[for], .cursor-link, summary",
          )
        ) {
          setMode("link");
          return;
        }
        setMode("default");
      };

      const onLeave = () => setMode("hidden");
      const onEnter = () => setMode("default");
      const onDown = () => {
        gsap.to(ring, { scale: 0.82, duration: 0.15, ease: "power2.out" });
        gsap.to(tip, { scale: modeRef.current === "default" ? 0.55 : 0, duration: 0.15 });
      };
      const onUp = () => {
        gsap.to(ring, { scale: 1, duration: 0.28, ease: "power3.out" });
        gsap.to(tip, {
          scale: modeRef.current === "default" ? 1 : 0,
          duration: 0.28,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseover", onOver, { passive: true });
      document.addEventListener("mouseleave", onLeave);
      document.addEventListener("mouseenter", onEnter);
      window.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);

      gsap.set([tip, ring], {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        xPercent: -50,
        yPercent: -50,
      });
      gsap.set(ring, { width: 36, height: 36 });
      gsap.set(labelRef.current, { autoAlpha: 0, scale: 0.85 });

      return () => {
        document.documentElement.classList.remove("has-custom-cursor");
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseover", onOver);
        document.removeEventListener("mouseleave", onLeave);
        document.removeEventListener("mouseenter", onEnter);
        window.removeEventListener("mousedown", onDown);
        window.removeEventListener("mouseup", onUp);
      };
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border border-white/80 bg-[rgba(8,16,48,0.22)] shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_8px_24px_rgba(8,16,48,0.25)] backdrop-blur-[2px]"
        style={{ width: 36, height: 36 }}
      >
        <span
          ref={labelRef}
          className="font-display text-[0.62rem] font-bold tracking-[0.18em] text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
        />
      </div>
      <div
        ref={tipRef}
        className="absolute top-0 left-0 size-2.5 rounded-full bg-[var(--brand-orange)] shadow-[0_0_20px_rgba(224,89,20,0.75)]"
      />
    </div>
  );
}
