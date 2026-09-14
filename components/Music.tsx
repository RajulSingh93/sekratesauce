import type { PointerEvent } from "react";
import s from "./site.module.css";
import { music } from "@/lib/site-data";
import { formatTime } from "@/lib/format";

type Props = {
  active: number | null;
  progress: number;
  current: number;
  duration: number;
  simulated: boolean;
  durations: Record<number, number>;
  onToggle: (i: number) => void;
  onSeekDown: (e: PointerEvent<HTMLDivElement>, i: number) => void;
  onSeekMove: (e: PointerEvent<HTMLDivElement>, i: number) => void;
  onSeekUp: (e: PointerEvent<HTMLDivElement>, i: number) => void;
};

export default function Music({
  active,
  progress,
  current,
  duration,
  simulated,
  durations,
  onToggle,
  onSeekDown,
  onSeekMove,
  onSeekUp,
}: Props) {
  return (
    <section id="music" data-reveal className={`${s.section} ${s.reveal}`}>
      <h2 className={`${s.display} ${s.musicTitle}`}>Music</h2>
      <div className={s.musicGrid}>
        {music.map((t, i) => {
          const on = active === i;
          const pct = on ? `${(progress * 100).toFixed(2)}%` : "0%";
          const status = on
            ? simulated
              ? "Preview pulse"
              : "Now playing"
            : "Play";
          const time = on
            ? duration
              ? `−${formatTime(duration - current)} left`
              : formatTime(current)
            : durations[i]
              ? formatTime(durations[i])
              : "";

          return (
            <article key={t.title} className={s.trackCard}>
              <div className={s.trackArt}>
                <wave-ring seed={String(t.seed)} />
                <span className={`${s.chip} ${s.chipSm} ${s.artChipL}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`${s.chip} ${s.chipSm} ${s.artChipR}`}>
                  {t.genre}
                </span>
              </div>

              <div className={s.trackMeta}>
                <span className={s.trackYear}>{t.year}</span>
                <span className={s.trackName}>{t.title}</span>
              </div>

              <div className={s.trackControls}>
                <button
                  onClick={() => onToggle(i)}
                  aria-label={`Play or pause ${t.title}`}
                  className={s.playBtn}
                  style={{
                    background: on ? "#fff" : "transparent",
                    color: on ? "#000" : "#fff",
                  }}
                >
                  {on ? "❚❚" : "▶"}
                </button>

                <div className={s.seekWrap}>
                  <div
                    onPointerDown={(e) => onSeekDown(e, i)}
                    onPointerMove={(e) => onSeekMove(e, i)}
                    onPointerUp={(e) => onSeekUp(e, i)}
                    role="slider"
                    aria-label={`Seek ${t.title}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={on ? Math.round(progress * 100) : 0}
                    tabIndex={0}
                    className={s.seek}
                    style={{ cursor: on ? "ew-resize" : "default" }}
                  >
                    <div className={s.seekTrack}>
                      <div className={s.seekFill} style={{ width: pct }} />
                      <div
                        className={s.seekKnob}
                        style={{
                          left: pct,
                          transform: `translate(-50%,-50%) scale(${on ? 1 : 0})`,
                        }}
                      />
                    </div>
                  </div>
                  <span className={s.seekLabels}>
                    <span>{status}</span>
                    <span>{time}</span>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
