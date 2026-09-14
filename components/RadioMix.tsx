import s from "./site.module.css";
import { social } from "@/lib/site-data";

export default function RadioMix({ shift }: { shift: number }) {
  return (
    <section id="radio" data-reveal className={`${s.section} ${s.reveal}`}>
      <div className={s.sectionHead}>
        <h2
          className={`${s.display} ${s.radioTitle}`}
          style={{ transform: `translateX(${shift}px)` }}
        >
          Radio Mix
        </h2>
        <span className={s.radioChip}>
          <span className={s.blinkDot} />
          Broadcast coming soon
        </span>
      </div>

      <div className={s.radioWave}>
        <wave-lines seed="radio-teaser" ribbons="3" speed="0.6" active="true" />
      </div>

      <div className={s.radioFoot}>
        <p className={s.radioLede}>
          SEKRATE SAUCE Radio — a recurring mix series.{" "}
          <span className={s.muted45}>First episode in the works.</span>
        </p>
        <a
          href={social.youtube}
          target="_blank"
          rel="noopener"
          className={s.ghostBtn}
        >
          Get notified on YouTube ↗
        </a>
      </div>
    </section>
  );
}
