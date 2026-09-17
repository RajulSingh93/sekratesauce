"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./site.module.css";

// Timings shared with the intro rules in site.module.css.
const CYCLE = 1600; // one pass of the chevron loop
const LIT_FROM = 1000; // all three chevrons are lit from here...
const LIT_TO = 1200; // ...to here
const REVEAL = 1650; // the logo-shaped zoom, plus a beat
const LATEST = 4500; // never hold the page longer than this after navigation

const chevrons = [s.introChevron1, s.introChevron2, s.introChevron3];

export default function Intro() {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">(
    "loading",
  );
  const lastChevron = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let cancelled = false;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });
    const budget = () => Math.max(0, LATEST - performance.now());

    const run = async () => {
      // The reveal shows the page through the mask image, so wait for both.
      const mask = new window.Image();
      mask.src = "/brand/logo-fwrd-mask.png";
      const loaded =
        document.readyState === "complete"
          ? null
          : new Promise((resolve) =>
              window.addEventListener("load", resolve, { once: true }),
            );
      await Promise.race([
        Promise.all([
          loaded,
          document.fonts.ready,
          mask.decode().catch(() => null),
        ]),
        wait(budget()),
      ]);
      if (cancelled) return;

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Open on a beat where all three chevrons are lit.
        const time = Number(
          lastChevron.current?.getAnimations()[0]?.currentTime ?? LIT_FROM,
        );
        const beat = time % CYCLE;
        const delay =
          beat >= LIT_FROM && beat <= LIT_TO
            ? 0
            : (LIT_FROM - beat + CYCLE) % CYCLE;
        await wait(Math.min(delay, budget()));
        if (cancelled) return;
        setPhase("reveal");
        await wait(REVEAL);
        if (cancelled) return;
      }
      setPhase("done");
    };
    void run();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={s.intro} data-phase={phase} aria-hidden="true">
      <noscript>
        <style>{`.${s.intro}{display:none}`}</style>
      </noscript>
      <div className={s.introBg} />
      <div className={s.introMask} />
      <div className={s.introLogo}>
        {chevrons.map((cls, i) => (
          <Image
            key={cls}
            ref={i === chevrons.length - 1 ? lastChevron : undefined}
            src="/brand/logo-fwrd-white.png"
            alt=""
            width={150}
            height={143}
            loading="eager"
            className={`${s.introChevron} ${cls}`}
          />
        ))}
      </div>
    </div>
  );
}
