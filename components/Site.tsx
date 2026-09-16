"use client";

import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Lenis from "lenis";

import s from "./site.module.css";
import { sendBooking } from "@/app/actions";
import { email, music } from "@/lib/site-data";
import { registerWaveLines } from "@/lib/wave-lines";
import { registerWaveRing } from "@/lib/wave-ring";

import About from "./About";
import Booking from "./Booking";
import EnergyMeter from "./EnergyMeter";
import Footer from "./Footer";
import GenreRibbon from "./GenreRibbon";
import Header from "./Header";
import Hero from "./Hero";
import MenuOverlay from "./MenuOverlay";
import Mixtapes from "./Mixtapes";
import Music from "./Music";
import Photos from "./Photos";
import RadioMix from "./RadioMix";
import Services from "./Services";
import Statement from "./Statement";

const CELLS = 24;
// Every scroll-driven value clamps at this point.
const SCROLL_CAP = 1400;
const SIM_LENGTH = 30;

export default function Site({ year }: { year: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [wide, setWide] = useState(true);
  const [menu, setMenu] = useState(false);
  const [mix, setMix] = useState<number | null>(null);
  const [track, setTrack] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [simulated, setSimulated] = useState(false);
  const [durations, setDurations] = useState<Record<number, number>>({});
  const [formNote, setFormNote] = useState("");
  const [sending, startSending] = useTransition();

  const cellRefs = useMemo(
    () => Array.from({ length: CELLS }, () => createRef<HTMLSpanElement>()),
    [],
  );
  const pctRef = useRef<HTMLSpanElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroFgRef = useRef<HTMLDivElement>(null);

  // Visitor energy, ribbon motion and playback all run off refs so their
  // animation frames never read stale state.
  const energyRef = useRef(0);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const moveTimeRef = useRef(0);
  const scrollYRef = useRef(0);
  const hoverRef = useRef(false);
  const rxRef = useRef(0);
  const speedRef = useRef(1.2);
  const targetRef = useRef(1.2);

  const trackRef = useRef<number | null>(null);
  const simRef = useRef(false);
  const simStartRef = useRef(0);
  const seekingRef = useRef<number | null>(null);
  const playRafRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Register the two canvas custom elements.
  useEffect(() => {
    registerWaveRing();
    registerWaveLines();
  }, []);

  // Scroll-driven motion, written straight to the DOM so scrolling never
  // re-renders the page: the hero parallax, each section's 3D entrance, and
  // headings and photos that keep drifting while they are on screen. All of
  // it follows the scroll position, so it plays in reverse when scrolling up.
  useEffect(() => {
    let raf: number | null = null;
    let disposed = false;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const sections = [
      ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ];
    const headings = [...document.querySelectorAll<HTMLElement>("[data-drift]")];
    const headingSections = headings.map(
      (h) => h.closest<HTMLElement>("[data-reveal]") ?? h,
    );
    const photos = [
      ...document.querySelectorAll<HTMLElement>("[data-parallax]"),
    ];
    const header = document.querySelector<HTMLElement>("header");
    const lightSections = [
      ...document.querySelectorAll<HTMLElement>('[data-tone="light"]'),
    ];
    let overLight: boolean | null = null;

    // Only touch the DOM when a value changes, so still elements cost nothing.
    const written = new WeakMap<HTMLElement, Map<string, string>>();
    const write = (el: HTMLElement, prop: string, value: string) => {
      let cache = written.get(el);
      if (!cache) written.set(el, (cache = new Map()));
      if (cache.get(prop) === value) return;
      cache.set(prop, value);
      el.style.setProperty(prop, value);
    };

    // Position from layout rather than getBoundingClientRect, so an element's
    // own transform never feeds back into its motion.
    const pageTop = (el: HTMLElement) => {
      let top = 0;
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
        top += n.offsetTop;
      }
      return top;
    };
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    // 0 as an element's top enters at the bottom of the screen, 1 once its
    // bottom has left at the top.
    const passage = (el: HTMLElement, scrollY: number, vh: number) =>
      clamp01((scrollY + vh - pageTop(el)) / (vh + el.offsetHeight));

    // How far each heading may drift sideways without running off-screen.
    let driftRoom: number[] = [];
    const measureDrift = () => {
      const vw = window.innerWidth;
      driftRoom = headings.map((h, i) => {
        const section = headingSections[i];
        const saved = section.style.transform;
        section.style.transform = "none";
        h.style.transform = "none";
        const range = document.createRange();
        range.selectNodeContents(h);
        const text = range.getBoundingClientRect();
        section.style.transform = saved;
        written.get(h)?.delete("transform");
        return Math.max(0, Math.min(vw * 0.05, text.left - 8, vw - text.right - 8));
      });
    };

    const update = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      setScrolled(scrollY > 40);

      // The header is white, so it turns black while its middle sits over a
      // light section (see the header rules in site.module.css).
      if (header) {
        const mid = header.offsetHeight / 2;
        const next = lightSections.some((el) => {
          const top = pageTop(el) - scrollY;
          return top <= mid && top + el.offsetHeight >= mid;
        });
        if (next !== overLight) {
          overLight = next;
          header.toggleAttribute("data-over-light", next);
        }
      }

      if (reducedMotion) return;

      const y = Math.min(scrollY, SCROLL_CAP);
      const bg = heroBgRef.current;
      const fg = heroFgRef.current;
      if (bg) write(bg, "transform", `translateY(${y * 0.22}px) scale(1.04)`);
      if (fg) {
        write(fg, "transform", `translateY(${y * -0.1}px)`);
        write(fg, "opacity", String(Math.max(0, 1 - y / 800)));
      }

      // Each section swings up out of a backward tilt while its top rises
      // from the bottom of the screen to 30% from the top, so the motion
      // plays out in plain view (matches the .reveal starting pose).
      for (const el of sections) {
        const p = clamp01((scrollY + vh - pageTop(el)) / (vh * 0.7));
        const rest = (1 - p) ** 2;
        write(el, "opacity", Math.min(1, (1 - rest) * 1.4).toFixed(3));
        write(
          el,
          "transform",
          rest < 0.001
            ? "none"
            : `perspective(1600px) translate3d(0, ${(90 * rest).toFixed(1)}px, ${(-80 * rest).toFixed(1)}px) rotateX(${(10 * rest).toFixed(2)}deg)`,
        );
      }

      // Big headings drift right to left while their section crosses the screen.
      headings.forEach((h, i) => {
        const q = passage(headingSections[i], scrollY, vh);
        write(h, "transform", `translate3d(${((0.5 - q) * 2 * driftRoom[i]).toFixed(1)}px, 0, 0)`);
      });

      // Photos slide within their frames.
      for (const el of photos) {
        const shift = (0.5 - passage(el, scrollY, vh)) * 2 * 0.06 * el.offsetHeight;
        write(el, "--parallax", `${shift.toFixed(1)}px`);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        update();
      });
    };

    const onResize = () => {
      setWide(window.innerWidth >= 900);
      measureDrift();
      update();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    onResize();
    // Heading widths change once the web font has loaded.
    void document.fonts?.ready.then(() => {
      if (disposed) return;
      measureDrift();
      update();
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Smooth, gliding wheel scrolling. Touch keeps its native momentum, and
  // reduced-motion users keep the browser's normal scrolling.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  // "Reading the room" — pointer, scroll and click energy drives the meter,
  // the idle ring levels, the wave ribbons and the genre marquee speed.
  useEffect(() => {
    const bump = (v: number) => {
      energyRef.current = Math.min(1, energyRef.current + v);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      const p = "touches" in e ? e.touches[0] : e;
      if (!p) return;
      const last = pointerRef.current;
      if (last) {
        const dt = Math.max(8, now - moveTimeRef.current);
        const d = Math.hypot(p.clientX - last.x, p.clientY - last.y);
        bump(Math.min(0.08, (d / dt) * 0.03));
      }
      pointerRef.current = { x: p.clientX, y: p.clientY };
      moveTimeRef.current = now;
    };

    const onScrollEnergy = () => {
      const next = window.scrollY;
      bump(Math.min(0.1, Math.abs(next - scrollYRef.current) * 0.0009));
      scrollYRef.current = next;
    };

    const onClick = () => bump(0.12);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("scroll", onScrollEnergy, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });

    let shown = 0;
    let id = 0;
    const tick = () => {
      energyRef.current *= 0.985;
      shown += (energyRef.current - shown) * 0.15;

      cellRefs.forEach((cell, i) => {
        const el = cell.current;
        if (!el) return;
        const lit = i / CELLS < shown;
        const height = lit
          ? 0.25 + 0.75 * Math.abs(Math.sin(performance.now() / 180 + i))
          : 0.15;
        el.style.transform = `scaleY(${height})`;
      });

      if (pctRef.current) {
        pctRef.current.textContent = `${Math.round(shown * 100)}%`;
      }

      if (trackRef.current == null) {
        const rings = window.__waveRings ?? {};
        Object.keys(rings).forEach((k) => rings[k].setLevel(shown * 0.7));
      }
      window.__waveLines?.forEach((wl) => wl.setEnergy(shown));

      targetRef.current = (hoverRef.current ? 0.25 : 1.2) * (1 + shown * 1.5);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("scroll", onScrollEnergy);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [cellRefs]);

  // Genre marquee — eases toward the energy-scaled target speed and wraps
  // at half its width, where the doubled list repeats. It stays still for
  // reduced-motion users and skips work while scrolled out of view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (ribbonRef.current) io.observe(ribbonRef.current);

    const tick = () => {
      const el = ribbonRef.current;
      if (el && visible) {
        speedRef.current += (targetRef.current - speedRef.current) * 0.06;
        rxRef.current -= speedRef.current;
        const half = el.scrollWidth / 2;
        if (half && -rxRef.current >= half) rxRef.current += half;
        el.style.transform = `translateX(${rxRef.current}px)`;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
    };
  }, []);

  // Stop the page behind the open menu from scrolling on touch screens.
  useEffect(() => {
    if (!menu) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [menu]);

  // Preload track durations so the cards can show a runtime before playback.
  useEffect(() => {
    const probes = music.map((t, i) => {
      const probe = new Audio();
      probe.preload = "metadata";
      probe.src = t.audio;
      const onMeta = () =>
        setDurations((d) => ({ ...d, [i]: probe.duration }));
      probe.addEventListener("loadedmetadata", onMeta);
      return { probe, onMeta };
    });
    return () =>
      probes.forEach(({ probe, onMeta }) => {
        probe.removeEventListener("loadedmetadata", onMeta);
        probe.src = "";
      });
  }, []);

  const stopTrack = useCallback(() => {
    if (playRafRef.current) cancelAnimationFrame(playRafRef.current);
    playRafRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    const rings = window.__waveRings ?? {};
    Object.keys(rings).forEach((k) => rings[k].setLevel(0));
    trackRef.current = null;
    simRef.current = false;
    setTrack(null);
    setProgress(0);
    setCurrent(0);
    setDuration(0);
    setSimulated(false);
  }, []);

  const toggleTrack = useCallback(
    (i: number) => {
      if (trackRef.current === i) {
        stopTrack();
        return;
      }
      stopTrack();

      // A fresh element per play: a media element can only be wired into
      // Web Audio once, and the old one is released in stopTrack.
      const audio = new Audio(music[i].audio);
      // With no audio file present the design falls back to its beat-pulse
      // preview, so the artwork still responds.
      audio.onerror = () => {
        simRef.current = true;
        simStartRef.current = performance.now();
        setSimulated(true);
      };
      audio.onended = () => stopTrack();
      audioRef.current = audio;

      let analyser: AnalyserNode | null = null;
      try {
        // iOS Safari mutes Web Audio while the ringer switch is on silent;
        // declaring a playback session keeps the music audible (Safari 16.4+).
        const session = (
          navigator as Navigator & { audioSession?: { type: string } }
        ).audioSession;
        if (session) session.type = "playback";
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = ctxRef.current ?? new Ctx();
        ctxRef.current = ctx;
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        ctx.createMediaElementSource(audio).connect(analyser);
        analyser.connect(ctx.destination);
        void ctx.resume();
      } catch {
        // Web Audio unavailable — playback still works, the ring just idles.
        analyser = null;
      }
      analyserRef.current = analyser;

      trackRef.current = i;
      simRef.current = false;
      simStartRef.current = performance.now();
      setTrack(i);
      setSimulated(false);
      void audio.play().catch(() => {});

      const bins = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

      const tick = () => {
        const index = trackRef.current;
        if (index == null) return;

        let level = 0;
        let nextProgress = 0;
        let nextCurrent = 0;
        let nextDuration = 0;

        if (simRef.current) {
          const elapsed = (performance.now() - simStartRef.current) / 1000;
          const beat = ((elapsed * 128) / 60) % 1;
          level =
            Math.pow(1 - beat, 5) * 0.9 +
            Math.pow(Math.max(0, Math.sin(elapsed * 6.28 * 0.5)), 4) * 0.15;
          nextProgress = (elapsed % SIM_LENGTH) / SIM_LENGTH;
          nextCurrent = elapsed % SIM_LENGTH;
          nextDuration = SIM_LENGTH;
        } else {
          if (analyser && bins) {
            analyser.getByteFrequencyData(bins);
            let sum = 0;
            for (let k = 0; k < 12; k++) sum += bins[k];
            level = Math.pow(sum / (12 * 255), 1.4);
          }
          nextCurrent = audio.currentTime;
          nextDuration = isFinite(audio.duration) ? audio.duration : 0;
          nextProgress = nextDuration ? audio.currentTime / nextDuration : 0;
        }

        const rings = window.__waveRings ?? {};
        Object.keys(rings).forEach((k) =>
          rings[k].setLevel(String(music[index].seed) === k ? level : 0),
        );

        setProgress((p) => (Math.abs(nextProgress - p) > 0.004 ? nextProgress : p));
        setCurrent((c) =>
          Math.floor(nextCurrent) !== Math.floor(c) ? nextCurrent : c,
        );
        setDuration((d) => (nextDuration !== d ? nextDuration : d));

        playRafRef.current = requestAnimationFrame(tick);
      };

      if (playRafRef.current) cancelAnimationFrame(playRafRef.current);
      playRafRef.current = requestAnimationFrame(tick);
    },
    [stopTrack],
  );

  useEffect(() => stopTrack, [stopTrack]);

  const seekTo = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const audio = audioRef.current;

    if (simRef.current) {
      simStartRef.current = performance.now() - p * SIM_LENGTH * 1000;
      setCurrent(p * SIM_LENGTH);
    } else if (audio && isFinite(audio.duration)) {
      audio.currentTime = p * audio.duration;
      setCurrent(p * audio.duration);
    }
    setProgress(p);
  }, []);

  const onSeekDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, i: number) => {
      if (trackRef.current !== i) return;
      seekingRef.current = i;
      e.currentTarget.setPointerCapture(e.pointerId);
      seekTo(e);
    },
    [seekTo],
  );

  const onSeekMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, i: number) => {
      if (seekingRef.current === i) seekTo(e);
    },
    [seekTo],
  );

  const onSeekUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, i: number) => {
      if (seekingRef.current !== i) return;
      seekingRef.current = null;
      seekTo(e);
    },
    [seekTo],
  );

  // Submitting through onSubmit rather than <form action> keeps what the
  // visitor typed if sending fails — React resets action forms either way.
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();

    startSending(async () => {
      const result = await sendBooking(data).catch(() => "failed" as const);
      if (result === "sent") {
        form.reset();
        setFormNote(`Thanks${name ? `, ${name}` : ""} — request sent. You'll hear back soon.`);
      } else if (result === "invalid") {
        setFormNote("Please add your name and a valid email address.");
      } else {
        setFormNote(`That didn't go through. Try again, or email ${email} directly.`);
      }
    });
  }, []);

  return (
    <div className={s.root}>
      <EnergyMeter cellRefs={cellRefs} pctRef={pctRef} />

      <Header
        scrolled={scrolled}
        open={menu}
        onToggle={() => setMenu((m) => !m)}
        onClose={() => setMenu(false)}
      />
      <MenuOverlay open={menu} onClose={() => setMenu(false)} />

      <Hero bgRef={heroBgRef} fgRef={heroFgRef} />

      <div className={`${s.scrollHint} ${s.dim}`}>
        <span className={`${s.chip} ${s.chipStart}`}>Scroll to explore</span>
        <span className={s.scrollTrack}>
          <span className={s.scrollBar} />
        </span>
      </div>

      <Statement />
      <About />

      <Music
        active={track}
        progress={progress}
        current={current}
        duration={duration}
        simulated={simulated}
        durations={durations}
        onToggle={toggleTrack}
        onSeekDown={onSeekDown}
        onSeekMove={onSeekMove}
        onSeekUp={onSeekUp}
      />

      <Mixtapes
        active={mix}
        onPlay={(i) => setMix(i)}
        onToggle={(i) => setMix((m) => (m === i ? null : i))}
      />

      <Photos wide={wide} collageRef={collageRef} />

      <RadioMix />

      <Services />

      <GenreRibbon
        trackRef={ribbonRef}
        onSlow={() => {
          hoverRef.current = true;
        }}
        onFast={() => {
          hoverRef.current = false;
        }}
      />

      <Booking note={formNote} sending={sending} onSubmit={onSubmit} />
      <Footer year={year} />
    </div>
  );
}
