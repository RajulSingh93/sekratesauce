import Image from "next/image";
import type { RefObject } from "react";
import s from "./site.module.css";

type Props = {
  // Parallax is written to these directly while scrolling (see Site).
  bgRef: RefObject<HTMLDivElement | null>;
  fgRef: RefObject<HTMLDivElement | null>;
};

export default function Hero({ bgRef, fgRef }: Props) {
  return (
    <section id="home" className={s.hero}>
      <div ref={bgRef} className={s.heroBg}>
        <Image
          src="/assets/hero-musica.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          style={{ objectFit: "cover" }}
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
