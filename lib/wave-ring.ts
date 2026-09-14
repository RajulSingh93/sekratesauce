// <wave-ring> — generative particle-ring artwork (canvas).
// Attributes: seed (number), speed (default 1), density (default 1).
// Reacts to pointer: tilts/rotates toward the cursor; slow auto-rotation otherwise.
// Points are batched per alpha level for speed.
const LEVELS = 6;

// Resolved lazily so this module can be imported during server rendering,
// where HTMLElement does not exist. The stub is never instantiated.
const Base = (
  typeof HTMLElement !== "undefined" ? HTMLElement : class {}
) as typeof HTMLElement;

class WaveRing extends Base {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private seed = 1;
  private speed = 1;
  private density = 1;
  private rx = 0.95;
  private ry = 0;
  private trx = 0.95;
  private tryy = 0;
  private t = 0;
  private hover = false;
  private frame = 0;
  private dpr = 1;
  private level = 0;
  private smooth = 0;
  private visible: boolean | undefined;
  private raf: number | null = null;
  private k: number[] = [];
  private ph: number[] = [];
  private paths: Path2D[] = [];
  private ro?: ResizeObserver;
  private io?: IntersectionObserver;
  private onMove?: (e: PointerEvent) => void;
  private onLeave?: () => void;

  connectedCallback() {
    this.style.display = "block";
    this.style.position = this.style.position || "absolute";
    this.style.inset = "0";
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = "width:100%;height:100%;display:block;background:#000";
    this.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;
    this.seed = parseFloat(this.getAttribute("seed") || "1");
    this.speed = parseFloat(this.getAttribute("speed") || "1");
    this.density = parseFloat(this.getAttribute("density") || "1");
    this.rx = 0.95;
    this.ry = 0;
    this.trx = 0.95;
    this.tryy = 0;
    this.t = this.seed * 100;
    this.hover = false;
    this.frame = 0;
    const rnd = (n: number) => {
      const x = Math.sin(n * 12.9898 + this.seed * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    this.k = [3 + Math.floor(rnd(1) * 3), 5 + Math.floor(rnd(2) * 4), 2 + Math.floor(rnd(3) * 2)];
    this.ph = [rnd(4) * 6.28, rnd(5) * 6.28, rnd(6) * 6.28];
    this.paths = Array.from({ length: LEVELS }, () => new Path2D());
    this.level = 0;
    this.smooth = 0;
    (window.__waveRings = window.__waveRings || {})[String(this.seed)] = this;
    this.onMove = (e: PointerEvent) => {
      const r = this.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      this.tryy = nx * 1.4;
      this.trx = 0.95 + ny * 1.2;
      this.hover = true;
    };
    this.onLeave = () => {
      this.hover = false;
      this.trx = 0.95;
    };
    this.addEventListener("pointermove", this.onMove);
    this.addEventListener("pointerleave", this.onLeave);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this);
    this.resize();
    this.io = new IntersectionObserver((es) => {
      this.visible = es[0].isIntersecting;
      if (this.visible && !this.raf) this.loop();
    });
    this.io.observe(this);
  }

  setLevel(v: number) {
    this.level = Math.max(0, Math.min(1, v || 0));
  }

  disconnectedCallback() {
    if (window.__waveRings && window.__waveRings[String(this.seed)] === this) {
      delete window.__waveRings[String(this.seed)];
    }
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.ro?.disconnect();
    this.io?.disconnect();
  }

  private resize() {
    const w = this.clientWidth || 300;
    const h = this.clientHeight || 300;
    const dpr = Math.min(window.devicePixelRatio || 1, w > 300 ? 1.25 : 1.5);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.dpr = dpr;
  }

  private loop() {
    this.raf = requestAnimationFrame(() => {
      this.raf = null;
      if (this.visible === false) return;
      this.frame++;
      if (this.hover || this.level > 0.01 || this.smooth > 0.01 || this.frame % 2 === 0) this.draw();
      this.loop();
    });
  }

  private draw() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const dpr = this.dpr;
    this.smooth += (this.level - this.smooth) * (this.level > this.smooth ? 0.5 : 0.12);
    const L = this.smooth;
    this.t += 0.011 * this.speed * (this.hover ? 0.55 : 1) * (1 + L * 2.5);
    if (!this.hover) this.tryy += 0.005 * this.speed;
    this.ry += (this.tryy - this.ry) * 0.08;
    this.rx += (this.trx - this.rx) * 0.08;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H / 2;
    const S = Math.min(W, H) * 0.42 * (1 + L * 0.16);
    const f = 2.6;
    const amp = 1 + L * 1.6;
    const rings = Math.round(38 * this.density);
    const pts = Math.round(170 * this.density);
    const cX = Math.cos(this.rx);
    const sX = Math.sin(this.rx);
    const cY = Math.cos(this.ry);
    const sY = Math.sin(this.ry);
    const [k1, k2, k3] = this.k;
    const [p1, p2, p3] = this.ph;
    const t = this.t;
    const sz = Math.max(1, dpr * 0.9);
    const paths = this.paths;
    for (let l = 0; l < LEVELS; l++) paths[l] = new Path2D();
    for (let i = 0; i < rings; i++) {
      const u = i / (rings - 1);
      const band = 0.55 + u * 0.45;
      const alphaBase = 0.12 + 0.55 * Math.pow(1 - Math.abs(u - 0.7) / 0.7, 2);
      for (let j = 0; j < pts; j++) {
        const a = (j / pts) * Math.PI * 2;
        const n =
          Math.sin(a * k1 + t + p1 + u * 3) * 0.5 +
          Math.sin(a * k2 - t * 1.3 + p2 + u * 7) * 0.3 +
          Math.sin(a * k3 + t * 0.7 + p3) * 0.2;
        const fold = Math.pow(Math.abs(n), 1.6) * (n < 0 ? -1 : 1);
        const r = band * (1 + fold * 0.14 * amp * (1 - u * 0.4));
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        const z = fold * 0.28 * amp * (0.4 + u);
        const x1 = x * cY + z * sY;
        const z1 = -x * sY + z * cY;
        const y1 = y * cX - z1 * sX;
        const z2 = y * sX + z1 * cX;
        const p = f / (f - z2);
        const alpha = Math.min(1, alphaBase * (0.5 + p * 0.5) + Math.min(1, Math.abs(fold) * 2.2) * 0.35);
        const lvl = Math.min(LEVELS - 1, Math.floor(alpha * LEVELS));
        paths[lvl].rect(cx + x1 * p * S, cy + y1 * p * S, sz, sz);
      }
    }
    ctx.fillStyle = "#fff";
    for (let l = 0; l < LEVELS; l++) {
      ctx.globalAlpha = (l + 0.5) / LEVELS;
      ctx.fill(paths[l]);
    }
    ctx.globalAlpha = 1;
  }
}

export function registerWaveRing() {
  if (typeof window === "undefined") return;
  if (customElements.get("wave-ring")) return;
  customElements.define("wave-ring", WaveRing);
}
