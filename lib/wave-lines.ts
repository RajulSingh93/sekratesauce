// <wave-lines> — flowing dotted wave ribbons (canvas), white dots on transparent.
// Attributes: seed, speed, ribbons (default 3), active ("true"/"false").
// Resolved lazily so this module can be imported during server rendering,
// where HTMLElement does not exist. The stub is never instantiated.
const Base = (
  typeof HTMLElement !== "undefined" ? HTMLElement : class {}
) as typeof HTMLElement;

class WaveLines extends Base {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  // ECMAScript-private so React 19 passes seed/speed as attributes instead of
  // overwriting these with property assignments.
  #seed = 1;
  #speed = 1;
  private nR = 3;
  private t = 0;
  private energy = 0;
  private dpr = 1;
  private visible: boolean | undefined;
  private raf: number | null = null;
  private ro?: ResizeObserver;
  private io?: IntersectionObserver;

  static get observedAttributes() {
    return ["active"];
  }

  connectedCallback() {
    this.style.display = "block";
    this.style.position = this.style.position || "absolute";
    this.style.inset = "0";
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = "width:100%;height:100%;display:block";
    this.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    const sa = this.getAttribute("seed") || "1";
    this.#seed = parseFloat(sa);
    if (isNaN(this.#seed)) {
      let hsh = 0;
      for (const ch of sa) hsh = (hsh * 31 + ch.charCodeAt(0)) % 997;
      this.#seed = 1 + hsh / 100;
    }
    this.#speed = parseFloat(this.getAttribute("speed") || "1");
    this.nR = parseInt(this.getAttribute("ribbons") || "3", 10);
    this.t = this.#seed * 10;
    this.energy = 0;
    (window.__waveLines = window.__waveLines || new Set()).add(this);
    this.ro = new ResizeObserver(() => {
      this.resize();
      this.draw();
    });
    this.ro.observe(this);
    this.resize();
    this.io = new IntersectionObserver((es) => {
      this.visible = es[0].isIntersecting;
      this.sync();
    });
    this.io.observe(this);
    this.sync();
  }

  setEnergy(v: number) {
    this.energy = Math.max(0, Math.min(1, v || 0));
  }

  attributeChangedCallback() {
    if (this.canvas) this.sync();
  }

  get active() {
    return this.getAttribute("active") !== "false";
  }

  // React 19 sets a custom element's prop as a property whenever that name
  // exists on the element, so the property must reflect to the attribute.
  set active(value: boolean | string) {
    this.setAttribute("active", String(value));
  }

  private sync() {
    if (this.active && this.visible !== false) {
      if (!this.raf) this.loop();
    } else {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
      this.draw();
    }
  }

  disconnectedCallback() {
    window.__waveLines?.delete(this);
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.ro?.disconnect();
    this.io?.disconnect();
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = this.clientWidth || 300;
    const h = this.clientHeight || 60;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.dpr = dpr;
  }

  private loop() {
    this.raf = requestAnimationFrame(() => {
      this.raf = null;
      this.t += 0.012 * this.#speed * (1 + (this.energy || 0) * 2.2);
      this.draw();
      if (this.active && this.visible !== false) this.loop();
    });
  }

  private draw() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const dpr = this.dpr;
    const t = this.t;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    const cols = Math.max(40, Math.round(W / (4.5 * dpr)));
    const lines = 12;
    const thick = H * 0.34;
    for (let r = 0; r < this.nR; r++) {
      const ph = this.#seed * 3 + r * 2.1;
      const yBase = H * ((r + 0.5) / this.nR);
      const k = 1.6 + r * 0.5;
      const k2 = 3.1 + r * 0.7;
      for (let l = 0; l < lines; l++) {
        const v = l / (lines - 1);
        const off = (v - 0.5) * thick;
        const a = 0.18 + 0.82 * Math.pow(Math.abs(v - 0.5) * 2, 1.5);
        ctx.globalAlpha = a;
        for (let c = 0; c <= cols; c++) {
          const u = c / cols;
          const x = u * W;
          const twist = Math.sin(u * k2 * 6.28 + t * 1.3 + ph) * 0.5 + 0.5;
          const wave = Math.sin(u * k * 6.28 - t + ph) * H * 0.22 * (0.6 + 0.4 * Math.sin(t * 0.5 + r));
          const y = yBase + wave + off * (0.25 + 0.75 * twist);
          const edge = Math.min(1, Math.min(y, H - y) / (H * 0.18));
          if (edge <= 0) continue;
          if (edge < 1) ctx.globalAlpha = a * edge;
          const s = dpr * (0.8 + 1.6 * (1 - twist) * a);
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
          if (edge < 1) ctx.globalAlpha = a;
        }
      }
    }
    ctx.globalAlpha = 1;
  }
}

export function registerWaveLines() {
  if (typeof window === "undefined") return;
  if (customElements.get("wave-lines")) return;
  customElements.define("wave-lines", WaveLines);
}
