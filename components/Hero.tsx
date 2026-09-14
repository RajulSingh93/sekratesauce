import Image from "next/image";
import s from "./site.module.css";

export default function Hero({ y }: { y: number }) {
  return (
    <section id="home" className={s.hero}>
      <div
        className={s.heroBg}
        style={{ transform: `translateY(${y * 0.22}px) scale(1.04)` }}
      >
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

      <div
        className={s.heroFg}
        style={{
          transform: `translateY(${y * -0.1}px)`,
          opacity: Math.max(0, 1 - y / 800),
        }}
      >
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
