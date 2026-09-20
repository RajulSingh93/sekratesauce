import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import s from "./site.module.css";

type Props = {
  // Parallax is written to these directly while scrolling (see Site).
  bgRef: RefObject<HTMLDivElement | null>;
  fgRef: RefObject<HTMLDivElement | null>;
};

export default function Hero({ bgRef, fgRef }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // The loop is silent, and stays that way: React does not always render
    // the muted attribute on the server, and autoplay is only allowed while
    // a video is muted.
    video.muted = true;
    video.volume = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    void video.play().catch(() => {
      // Autoplay can still be refused; the poster frame stands in.
    });
  }, []);

  return (
    <section id="home" className={s.hero}>
      <div ref={bgRef} className={s.heroBg}>
        <video
          ref={videoRef}
          src="/assets/hero-loop.mp4"
          poster="/assets/hero-loop-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className={s.heroVideo}
        />
      </div>
      <div aria-hidden="true" className={s.heroScrim} />

      <div ref={fgRef} className={s.heroFg}>
        <p className={`${s.chip} ${s.chipLg}`} style={{ margin: 0, alignSelf: "center" }}>
          DJ / Producer / Open Format
        </p>
        <h1 className={s.heroTitle}>
          Sekrate
          <br />
          Sauce
        </h1>
        <p className={s.heroTag}>
          The playlist stays sekrate. The energy stays loud.
          <br />
          <span className={s.muted}>Welcome to the taste of SEKRATE SAUCE.</span>
        </p>
      </div>

      <div className={`${s.heroFoot} ${s.dim}`}>
        <span className={`${s.chip} ${s.chipStart}`}>
          Tech House · Dubstep · Trap House · Amapiano · Jersey House · UK Garage
        </span>
      </div>
    </section>
  );
}
