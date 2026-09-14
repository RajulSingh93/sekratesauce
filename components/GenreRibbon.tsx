import type { RefObject } from "react";
import s from "./site.module.css";
import { genres } from "@/lib/site-data";

type Props = {
  trackRef: RefObject<HTMLDivElement | null>;
  onSlow: () => void;
  onFast: () => void;
};

export default function GenreRibbon({ trackRef, onSlow, onFast }: Props) {
  // Doubled so the marquee can wrap seamlessly at half its scroll width.
  const items = [...genres, ...genres];

  return (
    <section
      aria-label="Genres"
      className={s.ribbon}
      onMouseEnter={onSlow}
      onMouseLeave={onFast}
    >
      <div ref={trackRef} className={s.ribbonTrack}>
        {items.map((genre, i) => (
          <span key={`${genre}-${i}`} className={s.ribbonItem}>
            {genre}
            <span className={s.ribbonDot} />
          </span>
        ))}
      </div>
    </section>
  );
}
