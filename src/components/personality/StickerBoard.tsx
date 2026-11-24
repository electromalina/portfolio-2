"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";
import InkSweep, { INK_SWEEP_TEXT } from "@/components/InkSweep";
import BrandCard from "@/components/personality/BrandCard";
import { STICKER_BOARD_COLOR } from "@/lib/design-tokens";
import type { Brand, StickerSpot } from "@/lib/personality";

type Vec = { x: number; y: number };
/** a spot on the board, in % of its width / height */
type Pos = Vec;

/** white border around each logo, in CSS px */
const OUTLINE = 5;
/** room around the sticker on its canvas for the outline + shadows, in CSS px */
const PAD = OUTLINE + 16;
/** the fold moves this fraction of the pointer's travel */
const PEEL_RATIO = 0.8;
/** the longest pull (CSS px) any sticker needs to roll all the way off */
const FULL_PULL = 200;
/** radius of the rolled-up curl, in CSS px */
const CURL_RADIUS = 11;
/** arrow-key nudge, in % of the board */
const NUDGE = 2;
const ARROW_STEPS: Record<string, Pos> = {
  ArrowLeft: { x: -NUDGE, y: 0 },
  ArrowRight: { x: NUDGE, y: 0 },
  ArrowUp: { x: 0, y: -NUDGE },
  ArrowDown: { x: 0, y: NUDGE },
};
/** how long the brand card stays after a sticker is put down, in ms */
const CARD_LINGER = 1500;

const BACK_COLOR = "#f1ece1";
const SHADOW_COLOR = "rgba(20, 20, 24, 0.34)";

/**
 * A dark board covered in die-cut logo stickers that peel like real ones.
 * Pull a sticker: the edge facing away from your pointer rolls up towards it.
 * Pull until it's rolled off and it comes away, flattens out and follows you;
 * let go and it sticks down there. Let go earlier and it rolls back flat.
 */
export default function StickerBoard({ brands }: { brands: readonly Brand[] }) {
  // positions the visitor has moved stickers to (reset on reload)
  const [moved, setMoved] = useState<Record<string, Pos>>({});
  // stacking order: last touched sticker on top
  const [order, setOrder] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  // the brand whose card is showing: set while a sticker is off the board,
  // cleared a moment after it's stuck down (so you can finish reading)
  const [active, setActive] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const bringToFront = (id: string) => setOrder((o) => [...o.filter((x) => x !== id), id]);
  const onLift = (id: string, lifted: boolean) => {
    clearTimeout(hideTimer.current);
    if (lifted) setActive(id);
    else hideTimer.current = setTimeout(() => setActive(null), CARD_LINGER);
  };

  return (
    // Portrait on phones (stickers stay big), wide from sm up. The width is
    // capped by the viewport height × the aspect ratio, so the whole board
    // always fits on screen (8rem leaves room for the sticky nav).
    <div
      ref={boardRef}
      style={{ backgroundColor: STICKER_BOARD_COLOR }}
      className="relative mx-auto mt-8 aspect-[7/10] w-[min(100%,calc((100svh-8rem)*0.7))] border-[3px] border-ink shadow-bauhaus sm:aspect-[11/5] sm:w-[min(100%,calc((100svh-8rem)*2.2))]"
    >
      {brands.map((brand) => (
        <Sticker
          key={brand.id}
          brand={brand}
          moved={moved[brand.id]}
          z={order.indexOf(brand.id) + 1}
          boardRef={boardRef}
          onMove={(pos) => setMoved((m) => ({ ...m, [brand.id]: pos }))}
          onFront={() => bringToFront(brand.id)}
          onLift={(lifted) => onLift(brand.id, lifted)}
        />
      ))}

      <BrandCard brand={brands.find((b) => b.id === active) ?? null} />

      {/* bottom-right corner, so it never adds height to the section */}
      {Object.keys(moved).length > 0 && (
        <button
          type="button"
          onClick={() => {
            setMoved({});
            setOrder([]);
          }}
          className="focus-bauhaus group absolute right-3 bottom-3 z-[60] inline-flex min-h-11 items-center overflow-hidden border-[3px] border-ink bg-cream px-4 font-body text-sm font-bold uppercase tracking-wide text-ink shadow-bauhaus-sm"
        >
          <InkSweep />
          <span className={`relative inline-flex items-center gap-2 ${INK_SWEEP_TEXT}`}>
            <FaArrowRotateLeft className="h-3.5 w-3.5" aria-hidden="true" />
            start fresh
          </span>
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// One sticker
// ---------------------------------------------------------------------------

type StickerProps = {
  brand: Brand;
  moved: Pos | undefined;
  z: number;
  boardRef: RefObject<HTMLDivElement | null>;
  onMove: (pos: Pos) => void;
  onFront: () => void;
  /** it came off the board (true) or was stuck back down (false) */
  onLift: (lifted: boolean) => void;
};

/** what the canvas shows */
type PeelState = {
  /** pull direction, in the sticker's own (unrotated) space */
  dir: Vec;
  /** how far the trailing edge has rolled up (device px) */
  amount: number;
  /** 0 = stuck down, 1 = lifted off the board (softer, further shadow) */
  lift: number;
};

/** the wide board layout is in use (matches the sm: breakpoint in CSS) */
const isWide = () => window.matchMedia("(min-width: 640px)").matches;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

function Sticker({ brand, moved, z, boardRef, onMove, onFront, onLift }: StickerProps) {
  const boxRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const art = useRef<StickerBitmaps | null>(null);
  const [ready, setReady] = useState(false);
  const [lifted, setLifted] = useState(false);

  // changes every frame, so it lives in refs: React doesn't need to re-render
  const peel = useRef<PeelState>({ dir: { x: 1, y: 0 }, amount: 0, lift: 0 });
  /** extra canvas room (device px) while peeling: the flap reaches past the sticker */
  const margin = useRef(0);
  const raf = useRef(0);

  const spot = (wide: boolean): StickerSpot => {
    const base = wide ? brand.desktop : brand.mobile;
    return moved ? { ...base, ...moved } : base;
  };

  // --- drawing --------------------------------------------------------------
  const draw = () => {
    const canvas = canvasRef.current;
    const a = art.current;
    if (canvas && a) renderSticker(canvas, a, peel.current, margin.current);
  };

  /**
   * Size the canvas: the bitmap plus `m` device px of room on every side.
   * Its CSS size is exactly its pixel size ÷ dpr and it's centred on the
   * sticker, so the browser never rescales it (rescaling blurs and bands it).
   */
  const sizeCanvas = (m: number) => {
    const canvas = canvasRef.current;
    const a = art.current;
    if (!canvas || !a) return;
    margin.current = m;
    canvas.width = a.width + 2 * m;
    canvas.height = a.height + 2 * m;
    canvas.style.width = `${canvas.width / a.dpr}px`;
    canvas.style.height = `${canvas.height / a.dpr}px`;
  };

  /** grow the canvas while a sticker is being handled, shrink it back after */
  const setRoom = (big: boolean) => {
    const a = art.current;
    if (!a) return;
    const m = big ? Math.ceil(Math.hypot(a.box.w, a.box.h)) : 0;
    if (m === margin.current) return;
    sizeCanvas(m);
    draw(); // resizing a canvas wipes it: redraw at once, or it blinks out
  };

  /** run `set(progress)` every frame for `ms`, with an ease-out curve */
  const tween = (ms: number, set: (v: number) => void, done?: () => void) => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const step = (now: number) => {
      const t = reducedMotion() ? 1 : Math.min(1, (now - start) / ms);
      set(easeOut(t));
      draw();
      if (t < 1) raf.current = requestAnimationFrame(step);
      else done?.();
    };
    raf.current = requestAnimationFrame(step);
  };

  // (re)build the sticker bitmaps whenever the sticker's size changes
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let cancelled = false;
    const build = async () => {
      const w = box.offsetWidth;
      const h = box.offsetHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bitmaps = await buildBitmaps(brand.src, w, h, dpr);
      if (cancelled) return;
      art.current = bitmaps;
      sizeCanvas(0);
      draw();
      setReady(true);
    };
    const ro = new ResizeObserver(() => void build());
    ro.observe(box);
    const frame = raf;
    return () => {
      cancelled = true;
      ro.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [brand.src]);

  // --- pointer: pull to peel, pull further to take it off and move it -------
  //
  // Pointer events only record where the pointer is and how far the peel
  // should be. One animation loop (`drive`) does the rest every frame: it
  // eases the roll towards that target (so a fast flick still rolls instead
  // of jumping), peels the sticker off once fully rolled, and slides it so
  // the point you pressed ends up back under the cursor.
  const gesture = useRef<{
    /** pointer position at press, and the sticker's spot then */
    start: Vec;
    from: StickerSpot;
    /** latest pointer position */
    last: Vec;
    /** how far the roll should be (device px), and the sticker's full length */
    target: number;
    extent: number;
    /** time it came off (null while still stuck) */
    offAt: number | null;
    /** roll amount at that moment, unrolled from there */
    offAmount: number;
    /** last spot sent to the board, to skip identical re-renders */
    sent: Pos | null;
  } | null>(null);

  const drive = (now: number) => {
    const g = gesture.current;
    const a = art.current;
    const board = boardRef.current;
    if (!g || !a || !board) return;
    const p = peel.current;

    if (g.offAt === null) {
      // still stuck: ease the roll towards the target, at most ~150ms for a full roll
      const diff = g.target - p.amount;
      const maxStep = g.extent / 9;
      p.amount += Math.sign(diff) * Math.min(Math.abs(diff) * 0.35, maxStep);
      if (Math.abs(g.target - p.amount) < 0.3) p.amount = g.target;
      draw();
      if (g.extent > 0 && p.amount >= g.extent) {
        // fully rolled: it's off. Spring flat + pop, then catch up with the cursor.
        g.offAt = now;
        g.offAmount = p.amount;
        setLifted(true);
        onLift(true);
        if (!reducedMotion()) {
          boxRef.current?.animate([{ scale: "1" }, { scale: "1.09" }, { scale: "1.05" }], {
            duration: 320,
            easing: "ease-out",
          });
        }
      }
    } else {
      const t = reducedMotion() ? 1e4 : now - g.offAt;
      // spring flat: quick unroll while the shadow lifts
      const u = easeOut(Math.min(1, t / 180));
      if (p.lift < 1) {
        p.amount = g.offAmount * (1 - u);
        p.lift = u;
        draw();
      }
      // slide so the pressed point is back under the cursor, then follow 1:1
      const c = easeOut(Math.min(1, t / 200));
      const rect = board.getBoundingClientRect();
      const pos = clampPos({
        x: g.from.x + ((g.last.x - g.start.x) / rect.width) * 100 * c,
        y: g.from.y + ((g.last.y - g.start.y) / rect.height) * 100 * c,
      });
      if (!g.sent || g.sent.x !== pos.x || g.sent.y !== pos.y) {
        g.sent = pos;
        onMove(pos);
      }
    }
    raf.current = requestAnimationFrame(drive);
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const a = art.current;
    if (e.button !== 0 || !a) return;
    const from = spot(isWide());
    // only grab the sticker itself, not the empty corners of its box
    if (!hitTest(e.clientX, e.clientY, boxRef.current, a, from.r)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelAnimationFrame(raf.current);
    const start = { x: e.clientX, y: e.clientY };
    gesture.current = {
      start,
      from,
      last: start,
      target: peel.current.amount,
      extent: 0,
      offAt: null,
      offAmount: 0,
      sent: null,
    };
    setRoom(true);
    onFront();
    raf.current = requestAnimationFrame(drive);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    const a = art.current;
    if (!g || !a) return;
    g.last = { x: e.clientX, y: e.clientY };
    if (g.offAt !== null) return; // off: the loop follows `last`

    // still stuck: turn the pull into a peel target, in the sticker's own (rotated) space
    const d = rotate({ x: e.clientX - g.start.x, y: e.clientY - g.start.y }, -g.from.r);
    const len = Math.hypot(d.x, d.y);
    if (len < 2) return;
    const p = peel.current;
    p.dir = { x: d.x / len, y: d.y / len };
    const range = projRange(a, p.dir);
    // long stickers peel a bit faster, so no sticker needs more than ~FULL_PULL px
    g.extent = range.max - range.min;
    g.target = len * a.dpr * Math.max(PEEL_RATIO, g.extent / a.dpr / FULL_PULL);
  };

  const onPointerUp = () => {
    const g = gesture.current;
    if (!g) return;
    gesture.current = null;
    cancelAnimationFrame(raf.current);
    const p = peel.current;
    const amount = p.amount;
    const lift = p.lift;
    const wasOff = g.offAt !== null;
    setLifted(false);
    if (wasOff) onLift(false);
    // stick down where it is now (or roll back flat if it never came off),
    // then shrink the canvas back (setRoom redraws it)
    tween(
      wasOff ? 260 : 320,
      (v) => {
        p.amount = amount * (1 - v);
        p.lift = lift * (1 - v);
      },
      () => setRoom(false),
    );
  };

  // --- keyboard: arrow keys move the focused sticker -----------------------
  const onKeyDown = (e: KeyboardEvent) => {
    const s = ARROW_STEPS[e.key];
    if (!s) return;
    e.preventDefault();
    const cur = spot(isWide());
    onFront();
    // show its card too, so keyboard users get the text: "lift" shows it,
    // "drop" right away starts its linger timer, so it fades after a moment
    onLift(true);
    onLift(false);
    onMove(clampPos({ x: cur.x + s.x, y: cur.y + s.y }));
  };

  const m = spot(false);
  const d = spot(true);
  const vars = {
    "--x": `${m.x}%`,
    "--y": `${m.y}%`,
    "--w": `${m.w}%`,
    "--r": `${m.r}deg`,
    "--xl": `${d.x}%`,
    "--yl": `${d.y}%`,
    "--wl": `${d.w}%`,
    "--rl": `${d.r}deg`,
    zIndex: lifted ? 50 : z,
  } as CSSProperties;

  return (
    <div
      style={vars}
      className="absolute top-(--y) left-(--x) w-(--w) -translate-1/2 sm:top-(--yl) sm:left-(--xl) sm:w-(--wl)"
    >
      <button
        ref={boxRef}
        type="button"
        aria-label={`${brand.name} sticker`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        style={{ aspectRatio: brand.aspect }}
        className={`focus-bauhaus relative block w-full touch-none select-none rotate-(--r) transition-[scale] duration-300 ease-out motion-reduce:transition-none sm:rotate-(--rl) ${
          lifted ? "scale-105 cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* centred on the sticker and bigger than it, for outline, shadow and
            the peeled flap. Its size is set from JS (sizeCanvas). */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 left-1/2 max-w-none -translate-1/2 transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bitmaps: the die-cut sticker, its paper back and its shadow, drawn once
// ---------------------------------------------------------------------------

type StickerBitmaps = {
  front: HTMLCanvasElement;
  /** the paper back, with the print faintly showing through */
  back: HTMLCanvasElement;
  shadow: HTMLCanvasElement;
  /** the sticker shape in black, for shading */
  dark: HTMLCanvasElement;
  /** alpha of the sticker shape, for hit testing */
  alpha: Uint8ClampedArray;
  /** points on the shape's outline (left/right end of every other row) */
  hull: Vec[];
  width: number;
  height: number;
  dpr: number;
  /** the logo's box inside the bitmap (device px) */
  box: { x: number; y: number; w: number; h: number };
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const loadImage = (src: string) => {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
};

const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

async function buildBitmaps(
  src: string,
  cssW: number,
  cssH: number,
  dpr: number,
): Promise<StickerBitmaps> {
  const img = await loadImage(src);
  const pad = Math.round(PAD * dpr);
  const box = { x: pad, y: pad, w: Math.round(cssW * dpr), h: Math.round(cssH * dpr) };
  const width = box.w + 2 * pad;
  const height = box.h + 2 * pad;

  // 1. silhouette of the logo (every visible pixel → white)
  const sil = makeCanvas(width, height);
  const sctx = sil.getContext("2d")!;
  sctx.drawImage(img, box.x, box.y, box.w, box.h);
  sctx.globalCompositeOperation = "source-in";
  sctx.fillStyle = "#fff";
  sctx.fillRect(0, 0, width, height);

  // 2. grow it by OUTLINE px: stamp the silhouette around two circles
  const shape = makeCanvas(width, height);
  const shctx = shape.getContext("2d", { willReadFrequently: true })!;
  const r = OUTLINE * dpr;
  for (const radius of [r, r / 2]) {
    for (let i = 0; i < 32; i++) {
      const t = (i / 32) * Math.PI * 2;
      shctx.drawImage(sil, Math.cos(t) * radius, Math.sin(t) * radius);
    }
  }
  shctx.drawImage(sil, 0, 0);

  // 3. fill the holes: everything the outside can't reach is part of the
  //    sticker (so Valve's letters sit on solid white, not on the board)
  const data = shctx.getImageData(0, 0, width, height);
  fillHoles(data.data, width, height);
  shctx.putImageData(data, 0, 0);

  // 4. front = white shape + logo on top
  const front = makeCanvas(width, height);
  const fctx = front.getContext("2d")!;
  fctx.drawImage(shape, 0, 0);
  fctx.drawImage(img, box.x, box.y, box.w, box.h);

  // 5. back, shadow and shading = the same shape in other colours
  const tinted = (color: string) => {
    const c = makeCanvas(width, height);
    const ctx = c.getContext("2d")!;
    ctx.drawImage(shape, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return c;
  };
  const back = tinted(BACK_COLOR);
  const bctx = back.getContext("2d")!;
  bctx.globalCompositeOperation = "source-atop";
  bctx.globalAlpha = 0.08; // the print faintly shows through the paper
  bctx.drawImage(img, box.x, box.y, box.w, box.h);

  // 6. alpha for hit testing + outline points for measuring the shape
  const alpha = new Uint8ClampedArray(width * height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data.data[i * 4 + 3];
  const hull: Vec[] = [];
  for (let y = 0; y < height; y += 2) {
    let lo = -1;
    let hi = -1;
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] > 128) {
        if (lo < 0) lo = x;
        hi = x;
      }
    }
    if (lo >= 0) hull.push({ x: lo, y }, { x: hi, y });
  }

  return {
    front,
    back,
    shadow: tinted(SHADOW_COLOR),
    dark: tinted("#000"),
    alpha,
    hull,
    width,
    height,
    dpr,
    box,
  };
}

/** flood-fill the transparent outside from the edges; whatever's left is inside */
function fillHoles(px: Uint8ClampedArray, w: number, h: number) {
  const outside = new Uint8Array(w * h);
  const stack: number[] = [];
  const push = (i: number) => {
    if (!outside[i] && px[i * 4 + 3] < 128) {
      outside[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }
  for (let i = 0; i < w * h; i++) {
    if (!outside[i]) {
      px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = 255;
      px[i * 4 + 3] = 255;
    }
  }
}

// ---------------------------------------------------------------------------
// Rendering
//
// Everything is measured along the pull direction `dir`: a point p of the
// sticker has the coordinate u = p·dir. The trailing edge is the smallest u.
// ---------------------------------------------------------------------------

const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;

/** the sticker shape's extent along `dir` */
function projRange(a: StickerBitmaps, dir: Vec) {
  let min = Infinity;
  let max = -Infinity;
  for (const p of a.hull) {
    const u = dot(p, dir);
    if (u < min) min = u;
    if (u > max) max = u;
  }
  return { min, max };
}

/**
 * A transform that only stretches along `dir`: u ↦ k·u + t, and leaves the
 * direction across it alone. k < 0 mirrors (shows the sheet turned over).
 * `m` is the canvas margin, added as a plain offset.
 */
function alongDir(ctx: CanvasRenderingContext2D, dir: Vec, k: number, t: number, m: number) {
  const { x: ux, y: uy } = dir;
  ctx.setTransform(
    1 + (k - 1) * ux * ux,
    (k - 1) * ux * uy,
    (k - 1) * ux * uy,
    1 + (k - 1) * uy * uy,
    t * ux + m,
    t * uy + m,
  );
}

/** clip to the band lo ≤ u ≤ hi (in the current transform's coordinates) */
function clipBand(ctx: CanvasRenderingContext2D, dir: Vec, lo: number, hi: number) {
  const far = 1e5;
  const t = { x: -dir.y, y: dir.x };
  const at = (u: number, s: number) => [dir.x * u + t.x * s, dir.y * u + t.y * s] as const;
  ctx.beginPath();
  ctx.moveTo(...at(lo, -far));
  ctx.lineTo(...at(lo, far));
  ctx.lineTo(...at(hi, far));
  ctx.lineTo(...at(hi, -far));
  ctx.closePath();
  ctx.clip();
}

/**
 * Draws the sticker. `m` is the extra room around the bitmap on this canvas.
 *
 * Peeling: the trailing part rolls around a cylinder of radius R lying on the
 * sticker at the fold line u = s. A point t px behind the fold sits on the
 * cylinder at angle θ = t/R, which from above appears at u = s − R·sin θ:
 * printed side up (squeezed) for θ < 90°, paper back up for θ > 90°. Past
 * half a turn (t > πR) the paper lies flat on top, turned over. The curl is
 * drawn as thin strips, each with its own squeeze, side and shading.
 */
function renderSticker(canvas: HTMLCanvasElement, a: StickerBitmaps, p: PeelState, m: number) {
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const { dir, lift } = p;
  const { dpr } = a;
  const plain = (dx = 0, dy = 0) => ctx.setTransform(1, 0, 0, 1, m + dx, m + dy);

  // shadow: crisp and close when stuck, soft and further away when lifted
  const off = (3 + 7 * lift) * dpr;
  const drawShadow = () => {
    if (lift > 0.01) ctx.filter = `blur(${4 * lift * dpr}px)`;
    plain(off, off);
    ctx.drawImage(a.shadow, 0, 0);
    ctx.filter = "none";
    plain();
  };

  if (p.amount < 0.5) {
    drawShadow();
    ctx.drawImage(a.front, 0, 0);
    return;
  }

  const { min } = projRange(a, dir);
  const s = min + p.amount; // the fold line
  const R = CURL_RADIUS * dpr;

  // 1. the part still stuck down
  ctx.save();
  plain();
  clipBand(ctx, dir, s, 1e5);
  drawShadow();
  ctx.drawImage(a.front, 0, 0);
  ctx.restore();

  // 2. the curl, strip by strip from the fold upwards (higher strips on top)
  const arc = Math.min(p.amount, Math.PI * R);
  const n = Math.max(2, Math.ceil(arc / (1.5 * dpr)));
  for (let i = 0; i < n; i++) {
    const t0 = (arc * i) / n;
    const t1 = (arc * (i + 1)) / n;
    const u0 = s - t0;
    const u1 = s - t1;
    const v0 = s - R * Math.sin(t0 / R);
    const v1 = s - R * Math.sin(t1 / R);
    const k = (v1 - v0) / (u1 - u0); // squeeze: cos θ, negative = turned over
    const cos = Math.cos((t0 + t1) / 2 / R);
    ctx.save();
    alongDir(ctx, dir, k, v0 - k * u0, m);
    clipBand(ctx, dir, u1 - 0.75, u0 + 0.75);
    ctx.drawImage(cos >= 0 ? a.front : a.back, 0, 0);
    // light from above: darkest where the paper stands on edge (θ ≈ 90°)
    ctx.globalAlpha = 0.42 * (1 - Math.abs(cos)) + (cos < 0 ? 0.04 : 0);
    ctx.drawImage(a.dark, 0, 0);
    ctx.restore();
  }

  // 3. past half a turn: the paper lies flat on top, turned over
  if (p.amount > Math.PI * R) {
    ctx.save();
    alongDir(ctx, dir, -1, 2 * s - Math.PI * R, m);
    clipBand(ctx, dir, -1e5, s - Math.PI * R + 0.5);
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 8 * dpr;
    ctx.drawImage(a.back, 0, 0);
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** rotate a vector by `deg` degrees */
function rotate(v: Vec, deg: number): Vec {
  const t = (deg * Math.PI) / 180;
  return {
    x: v.x * Math.cos(t) - v.y * Math.sin(t),
    y: v.x * Math.sin(t) + v.y * Math.cos(t),
  };
}

/** is the pointer on the sticker shape (not an empty corner of its box)? */
function hitTest(cx: number, cy: number, box: HTMLElement | null, a: StickerBitmaps, deg: number) {
  if (!box) return false;
  const rect = box.getBoundingClientRect(); // axis-aligned bounds; same centre as the box
  const local = rotate(
    { x: cx - (rect.left + rect.width / 2), y: cy - (rect.top + rect.height / 2) },
    -deg,
  );
  const x = Math.round(a.width / 2 + local.x * a.dpr);
  const y = Math.round(a.height / 2 + local.y * a.dpr);
  if (x < 0 || y < 0 || x >= a.width || y >= a.height) return false;
  return a.alpha[y * a.width + x] > 40;
}

/** keep a sticker's centre on the board */
const clampPos = (p: Pos): Pos => ({
  x: Math.min(95, Math.max(5, p.x)),
  y: Math.min(94, Math.max(6, p.y)),
});
