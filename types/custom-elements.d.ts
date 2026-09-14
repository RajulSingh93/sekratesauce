import type { DetailedHTMLProps, HTMLAttributes } from "react";

type WaveElement = HTMLElement & {
  setLevel?: (v: number) => void;
  setEnergy?: (v: number) => void;
};

declare global {
  interface Window {
    __waveRings?: Record<string, { setLevel: (v: number) => void }>;
    __waveLines?: Set<{ setEnergy: (v: number) => void }>;
  }
}

type WaveProps = DetailedHTMLProps<HTMLAttributes<WaveElement>, WaveElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "wave-ring": WaveProps & {
        seed?: string | number;
        speed?: string | number;
        density?: string | number;
      };
      "wave-lines": WaveProps & {
        seed?: string | number;
        speed?: string | number;
        ribbons?: string | number;
        active?: string;
      };
    }
  }
}
