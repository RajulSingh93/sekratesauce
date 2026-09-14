import type { RefObject } from "react";
import s from "./site.module.css";

type Props = {
  cellRefs: RefObject<HTMLSpanElement | null>[];
  pctRef: RefObject<HTMLSpanElement | null>;
};

export default function EnergyMeter({ cellRefs, pctRef }: Props) {
  return (
    <div aria-live="off" className={s.meter}>
      <span className={s.meterLabel}>Reading the room</span>
      <span className={s.meterCells}>
        {cellRefs.map((ref, i) => (
          <span key={i} ref={ref} className={s.meterCell} />
        ))}
      </span>
      <span ref={pctRef} className={s.meterPct}>
        0%
      </span>
    </div>
  );
}
