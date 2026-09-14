import Image from "next/image";
import type { RefObject } from "react";
import s from "./site.module.css";
import { live } from "@/lib/site-data";

type Props = {
  wide: boolean;
  collageRef: RefObject<HTMLDivElement | null>;
};

// Grid areas for the 12-column collage, wide vs stacked.
const AREAS = {
  wide: {
    rowH: "clamp(40px,5.2vw,80px)",
    gap: "clamp(10px,1.2vw,18px)",
    minH: "0",
    cells: [
      "1/1/7/6",
      "1/6/4/10",
      "1/10/4/13",
      "4/6/7/9",
      "7/1/10/4",
      "7/4/10/9",
      "7/9/10/13",
    ],
    quote: "4/9/7/13",
  },
  narrow: {
    rowH: "auto",
    gap: "10px",
    minH: "52vw",
    cells: [
      "auto/1/auto/13",
      "auto/1/auto/7",
      "auto/7/auto/13",
      "auto/1/auto/7",
      "auto/7/auto/13",
      "auto/1/auto/7",
      "auto/7/auto/13",
    ],
    quote: "auto/1/auto/13",
  },
} as const;

export default function Photos({ wide, collageRef }: Props) {
  const col = wide ? AREAS.wide : AREAS.narrow;
  // Quote card sits between the fourth and fifth photo.
  const before = live.slice(0, 4);
  const after = live.slice(4);

  const figure = (photo: (typeof live)[number], index: number) => (
    <figure
      key={photo.slot}
      className={s.photo}
      style={{ gridArea: col.cells[index], minHeight: col.minH }}
    >
      <div className={s.zoom}>
        <Image
          src={photo.src}
          alt={`${photo.event} — ${photo.meta}`}
          fill
          sizes="(max-width: 900px) 100vw, 45vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <figcaption className={s.caption}>
        <span className={s.captionEvent}>{photo.event}</span>
        <span className={s.captionMeta}>{photo.meta}</span>
      </figcaption>
    </figure>
  );

  return (
    <section id="photos" data-reveal className={`${s.section} ${s.reveal}`}>
      <div className={s.sectionHead}>
        <h2 className={`${s.display} ${s.photosTitle}`}>Photos</h2>
        <span className={`${s.chip} ${s.headChip}`}>
          Live · Backstage · Studio · Off duty
        </span>
      </div>

      <div
        ref={collageRef}
        className={s.collage}
        style={{ gridAutoRows: col.rowH, gap: col.gap }}
      >
        {before.map((photo, i) => figure(photo, i))}

        <blockquote className={s.collageQuote} style={{ gridArea: col.quote }}>
          <span className={`${s.chip} ${s.chipSm} ${s.chipStart}`}>
            In his words
          </span>
          <p className={s.collageQuoteText}>
            “It’s not just love for music; it’s my passion. It goes beyond liking
            and beyond a hobby.”
          </p>
        </blockquote>

        {after.map((photo, i) => figure(photo, i + 4))}
      </div>
    </section>
  );
}
