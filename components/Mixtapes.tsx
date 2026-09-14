import s from "./site.module.css";
import { mixtapes } from "@/lib/site-data";

type Props = {
  active: number | null;
  shift: number;
  onPlay: (i: number) => void;
  onToggle: (i: number) => void;
};

export default function Mixtapes({ active, shift, onPlay, onToggle }: Props) {
  return (
    <section id="mixtapes" data-reveal className={`${s.section} ${s.reveal}`}>
      <h2
        className={`${s.display} ${s.mixTitle}`}
        style={{ transform: `translateX(${shift}px)` }}
      >
        Mixtapes
      </h2>

      <div className={s.mixList}>
        {mixtapes.map((m, i) => {
          const on = active === i;
          return (
            <article
              key={m.youtubeId}
              className={s.mixRow}
              style={{ background: on ? "rgba(255,255,255,.04)" : "transparent" }}
            >
              <div
                aria-hidden="true"
                className={`${s.mixWave} ${s.mixWaveTop}`}
                style={{ opacity: on ? 1 : 0 }}
              >
                <wave-lines
                  seed={`mix${i * 2 + 1}`}
                  ribbons="2"
                  active={on ? "true" : "false"}
                />
              </div>
              <div
                aria-hidden="true"
                className={`${s.mixWave} ${s.mixWaveBottom}`}
                style={{ opacity: on ? 1 : 0 }}
              >
                <wave-lines
                  seed={`mix${i * 2 + 2}`}
                  ribbons="2"
                  active={on ? "true" : "false"}
                />
              </div>

              <div
                className={s.mixFrame}
                style={{ outline: on ? "1px solid #fff" : "1px solid transparent" }}
              >
                {on ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${m.youtubeId}?autoplay=1&rel=0`}
                    title={m.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={s.mixEmbed}
                  />
                ) : (
                  <button
                    onClick={() => onPlay(i)}
                    aria-label={`Play ${m.title}`}
                    className={s.mixThumbBtn}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${m.youtubeId}/hqdefault.jpg`}
                      alt={m.title}
                      loading="lazy"
                      className={s.mixThumb}
                    />
                    <span className={s.mixPlay}>▶</span>
                  </button>
                )}
              </div>

              <div className={s.mixInfo}>
                <div className={s.mixLabelRow}>
                  <span className={s.chip}>{m.label}</span>
                  <span className={s.nowPlaying} style={{ opacity: on ? 1 : 0 }}>
                    ● Now playing
                  </span>
                </div>
                <span className={s.mixName}>{m.title}</span>
                <span className={s.mixMeta}>
                  {m.genre} · {m.year} · {m.duration}
                </span>
                <span className={s.mixDesc}>{m.description}</span>
                <div className={s.mixActions}>
                  <button
                    onClick={() => onToggle(i)}
                    className={s.outlineBtn}
                    style={{
                      background: on ? "#fff" : "transparent",
                      color: on ? "#000" : "#fff",
                    }}
                  >
                    {on ? "Stop" : "Play mix"}
                  </button>
                  <a
                    href={`https://youtu.be/${m.youtubeId}`}
                    target="_blank"
                    rel="noopener"
                    className={s.mixLink}
                  >
                    Open on YouTube ↗
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
