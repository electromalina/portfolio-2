"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { cssVar } from "@/lib/design-tokens";

const ROLES = [
  "React Developer",
  "Web Developer",
  "UI/UX Designer",
  "Creative Coder",
];

// ---------------------------------------------------------------------------
// Tile vocabulary. Every shape is drawn in a 1×1 unit box centred on (0,0), so
// a rotation around the tile centre always lands back on the same grid square.
// All edges are built from the same three measures (full edge, half edge, cell
// diagonal), so neighbouring tiles snap together into bigger Bauhaus figures:
// 4 quarters → one big circle, 2 quarters → a dome, 2 halves → a disc, etc.
// ---------------------------------------------------------------------------
type Shape =
  | "block" // full square
  | "bar" // top half of the square
  | "quarter" // quarter disc, radius 1, pivot on the bottom-right corner
  | "half" // half disc, diameter on the bottom edge
  | "triangle" // top-left half of the square, cut on the diagonal
  | "circle"; // disc touching all four edges

type Color = "orange" | "blue" | "yellow" | "ink";
type Rot = 0 | 90 | 180 | 270;

type TileSpec = { shape: Shape; color: Color; rot: Rot };

function ShapePath({ shape }: { shape: Shape }) {
  switch (shape) {
    case "block":
      return <rect x={-0.5} y={-0.5} width={1} height={1} />;
    case "bar":
      return <rect x={-0.5} y={-0.5} width={1} height={0.5} />;
    case "quarter":
      return <path d="M0.5 0.5 L-0.5 0.5 A1 1 0 0 1 0.5 -0.5 Z" />;
    case "half":
      return <path d="M-0.5 0.5 A0.5 0.5 0 0 1 0.5 0.5 Z" />;
    case "triangle":
      return <path d="M-0.5 -0.5 L0.5 -0.5 L-0.5 0.5 Z" />;
    case "circle":
      return <circle r={0.5} />;
  }
}

// ---------------------------------------------------------------------------
// Desktop composition (12×4), hand-placed so the resting state already shows
// clear figures. Random rotations then break them apart and rebuild new ones.
//   • big orange sun: 4 quarters around the corner shared by (2,2)…(3,3)
//   • yellow dome rising over row 1: quarters (6,1)+(7,1)
//   • ink dome on an orange plinth: quarters (5,3)+(6,3) over blocks (5,4)+(6,4)
//   • blue "eye": half (4,2) up + half (4,3) down → one disc on their shared edge
// Key = "col-row" (1-indexed). Cells under the name/contact cards are omitted.
// ---------------------------------------------------------------------------
const t = (shape: Shape, color: Color, rot: Rot = 0): TileSpec => ({
  shape,
  color,
  rot,
});

const DESKTOP: Record<string, TileSpec> = {
  // row 1
  "1-1": t("block", "yellow"),
  "2-1": t("triangle", "ink", 90),
  "3-1": t("half", "blue", 180),
  "4-1": t("bar", "orange", 180),
  "5-1": t("triangle", "blue", 270),
  "6-1": t("quarter", "yellow", 0),
  "7-1": t("quarter", "yellow", 90),
  "8-1": t("block", "blue"),
  "9-1": t("circle", "orange"),
  "10-1": t("triangle", "ink", 0),
  "11-1": t("half", "ink", 0),
  "12-1": t("quarter", "blue", 180),
  // row 2
  "1-2": t("half", "ink", 90),
  "2-2": t("quarter", "orange", 0),
  "3-2": t("quarter", "orange", 90),
  "4-2": t("half", "blue", 0),
  "5-2": t("triangle", "yellow", 180),
  "6-2": t("circle", "ink"),
  "7-2": t("triangle", "orange", 90),
  // row 3
  "1-3": t("bar", "blue", 270),
  "2-3": t("quarter", "orange", 270),
  "3-3": t("quarter", "orange", 180),
  "4-3": t("half", "blue", 180),
  "5-3": t("quarter", "ink", 0),
  "6-3": t("quarter", "ink", 90),
  "7-3": t("block", "blue"),
  // row 4
  "1-4": t("triangle", "yellow", 0),
  "2-4": t("block", "ink"),
  "3-4": t("half", "yellow", 0),
  "4-4": t("quarter", "blue", 270),
  "5-4": t("block", "orange"),
  "6-4": t("block", "orange"),
  "7-4": t("quarter", "yellow", 180),
  "8-4": t("triangle", "ink", 270),
  // blue dome under the name card
  "9-4": t("quarter", "blue", 0),
  "10-4": t("quarter", "blue", 90),
  "11-4": t("bar", "yellow", 180),
  "12-4": t("triangle", "orange", 90),
};

// Fallback for tablet/mobile: deterministic pseudo-random tiles (SSR-safe).
const SHAPE_BAG: Shape[] = [
  "quarter",
  "quarter",
  "quarter",
  "quarter",
  "half",
  "half",
  "triangle",
  "triangle",
  "block",
  "bar",
  "circle",
];
const COLOR_BAG: Color[] = ["orange", "blue", "ink", "orange", "blue", "ink", "yellow"];

function hash(n: number) {
  let x = (n + 1) * 2654435761;
  x = (x ^ (x >>> 13)) >>> 0;
  return x;
}

function randomTile(seed: number): TileSpec {
  const h = hash(seed);
  return {
    shape: SHAPE_BAG[h % SHAPE_BAG.length],
    color: COLOR_BAG[(h >>> 4) % COLOR_BAG.length],
    rot: (((h >>> 8) % 4) * 90) as Rot,
  };
}

// ---------------------------------------------------------------------------
// Which of the three CSS-switched mosaics is visible. All three are in the SSR
// markup (so there is no layout flash), but only the visible one runs timers.
// Server snapshot is null → nothing animates until the client knows its width.
// ---------------------------------------------------------------------------
type Layout = "lg" | "md" | "sm";
const MQ_LG = "(min-width: 1024px)";
const MQ_MD = "(min-width: 768px)";

function subscribeLayout(onChange: () => void) {
  const queries = [window.matchMedia(MQ_LG), window.matchMedia(MQ_MD)];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

function getLayout(): Layout {
  if (window.matchMedia(MQ_LG).matches) return "lg";
  if (window.matchMedia(MQ_MD).matches) return "md";
  return "sm";
}

function useActiveLayout(): Layout | null {
  return useSyncExternalStore(subscribeLayout, getLayout, () => null);
}

function useTypewriter(words: string[], enabled: boolean) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const current = words[wordIndex % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, 400);
    } else {
      const next = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      timeout = setTimeout(() => setText(next), deleting ? 55 : 95);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, enabled]);

  return text;
}

// memo: typing and other tiles rotating must not re-render every tile
const Tile = memo(function Tile({
  c,
  r,
  spec,
  rotation,
  onRotate,
}: {
  c: number;
  r: number;
  spec: TileSpec;
  rotation: number;
  onRotate: (key: string) => void;
}) {
  return (
    // outer <g>: moves the tile's centre onto its grid square (pure SVG units,
    // so every square is exactly 1×1 — no sub-pixel rounding, no borders)
    <g
      transform={`translate(${c - 0.5} ${r - 0.5})`}
      onClick={() => onRotate(`${c}-${r}`)}
      style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
    >
      {/* inner <g>: rotates around the tile centre. The full-size rect makes the
          fill-box exactly the tile, so "center" is the true centre. Scale 1.01
          overlaps neighbours by a hair → no anti-aliasing seams between shapes. */}
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `rotate(${spec.rot + rotation}deg) scale(1.01)`,
          transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <rect x={-0.5} y={-0.5} width={1} height={1} fill="transparent" />
        <g style={{ fill: cssVar[spec.color] }}>
          <ShapePath shape={spec.shape} />
        </g>
      </g>
    </g>
  );
});

/** Typing lives in this leaf, so only these few spans re-render per letter. */
function TypedRole({ active }: { active: boolean }) {
  const typed = useTypewriter(ROLES, active);
  return (
    <>
      <span>{typed}</span>
      <span className="type-cursor" />
    </>
  );
}

// Cards are absolutely positioned in the same grid units as the SVG, so their
// edges sit exactly on tile edges.
function regionStyle(reg: Region, cols: number, rows: number): CSSProperties {
  return {
    left: `${((reg.cs - 1) / cols) * 100}%`,
    top: `${((reg.rs - 1) / rows) * 100}%`,
    width: `${((reg.ce - reg.cs) / cols) * 100}%`,
    height: `${((reg.re - reg.rs) / rows) * 100}%`,
  };
}

function RoleCard({
  active,
  style,
}: {
  active: boolean;
  style: CSSProperties;
}) {
  return (
    // @container: children are sized in cqi (% of this card's width), so the
    // name always fits on one line. cqi on the container itself would measure
    // its parent instead, hence the inner wrapper carries padding + gap.
    <div className="@container absolute overflow-hidden bg-cream" style={style}>
      {/* Card is 5 tiles × 2 (2.5:1). Josefin "Danylo Kalynovskyi" is ~8.8× its
          font-size wide, so 8.5cqi fills ~75% of the card, leaving even margins. */}
      {/* Two lines: the name, then one shared row with the typed role on the
          left and contact icons pinned right (so typing never shifts them). */}
      <div className="flex h-full flex-col justify-center gap-[5cqi] px-[6cqi]">
        <h1 className="whitespace-nowrap font-display font-semibold text-[8.5cqi] leading-[0.9] text-ink">
          Danylo Kalynovskyi
        </h1>
        {/* screen readers get the full list once instead of every typed letter */}
        <p className="sr-only">{ROLES.join(", ")}</p>
        <div className="flex items-center justify-between gap-4">
          <p
            aria-hidden="true"
            className="flex min-h-[1.2em] min-w-0 items-center gap-[2.5cqi] whitespace-nowrap font-display text-[max(0.9rem,5cqi)] leading-none text-ink/85"
          >
            <span className="block h-[3px] w-[8cqi] shrink-0 bg-orange" />
            <TypedRole active={active} />
          </p>
          <ContactLinks />
        </div>
      </div>
    </div>
  );
}

/** Three equal square icon buttons (mail, GitHub, LinkedIn), one per accent colour. */
function ContactLinks() {
  const icon =
    // hover: the button fills with ink and the icon turns cream
    "focus-bauhaus flex h-7 w-7 shrink-0 items-center justify-center border-2 border-ink transition-colors duration-200 hover:bg-ink hover:text-cream focus-visible:bg-ink focus-visible:text-cream";
  return (
    <div className="flex shrink-0 items-center gap-2">
      <a
        href="mailto:kalinovskiydan@gmail.com"
        aria-label="Email kalinovskiydan@gmail.com"
        title="kalinovskiydan@gmail.com"
        // yellow is too light for cream icons, so this one uses an ink icon
        className={`${icon} bg-yellow text-ink`}
      >
        <FaEnvelope className="h-3.5 w-3.5" />
      </a>
      <a
        href="https://github.com/electromalina"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub"
        className={`${icon} bg-orange text-cream`}
      >
        <FaGithub className="h-3.5 w-3.5" />
      </a>
      <a
        href="https://www.linkedin.com/in/electromalina/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        title="LinkedIn"
        className={`${icon} bg-blue text-cream`}
      >
        <FaLinkedinIn className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

// grid line numbers (1-indexed), end-exclusive
type Region = { cs: number; ce: number; rs: number; re: number };

function MosaicGrid({
  cols,
  rows,
  react,
  composition,
  active,
  className,
}: {
  cols: number;
  rows: number;
  react: Region;
  /** hand-placed tiles; any missing cell falls back to a seeded random tile */
  composition?: Record<string, TileSpec>;
  /** only the visible grid animates */
  active: boolean;
  className: string;
}) {
  const [rotations, setRotations] = useState<Record<string, number>>({});

  const cells = useMemo(() => {
    const covers = (reg: Region, c: number, r: number) =>
      c >= reg.cs && c < reg.ce && r >= reg.rs && r < reg.re;
    const arr: { c: number; r: number; spec: TileSpec }[] = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        if (covers(react, c, r)) continue;
        const spec = composition?.[`${c}-${r}`] ?? randomTile((r - 1) * cols + c);
        arr.push({ c, r, spec });
      }
    }
    return arr;
  }, [cols, rows, react, composition]);

  // the site's own touch: rotate a random tile every so often (not constant)
  useEffect(() => {
    if (!active || cells.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // a chain of timeouts instead of setInterval, so each pause can differ:
    // 2.5–3s feels less mechanical than a fixed beat
    let id: ReturnType<typeof setTimeout>;
    const schedule = () => {
      id = setTimeout(() => {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        const key = `${cell.c}-${cell.r}`;
        setRotations((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 90 }));
        schedule();
      }, 2500 + Math.random() * 500);
    };
    schedule();

    return () => clearTimeout(id);
  }, [cells, active]);

  // stable identity so memoised tiles skip re-rendering
  const rotate = useCallback(
    (key: string) =>
      setRotations((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 90 })),
    []
  );

  // grid lines as one path, drawn on top of the tiles at exact integer units
  const gridLines = useMemo(() => {
    let d = "";
    for (let c = 1; c < cols; c++) d += `M${c} 0V${rows}`;
    for (let r = 1; r < rows; r++) d += `M0 ${r}H${cols}`;
    return d;
  }, [cols, rows]);

  return (
    <div
      className={`relative w-full bg-cream ${className}`}
      // square cells → arcs are true circles that line up as a puzzle
      style={{ aspectRatio: `${cols} / ${rows}` }}
    >
      <svg
        viewBox={`0 0 ${cols} ${rows}`}
        className="absolute inset-0 h-full w-full overflow-hidden"
        aria-hidden="true"
      >
        {cells.map(({ c, r, spec }) => (
          <Tile
            key={`${c}-${r}`}
            c={c}
            r={r}
            spec={spec}
            rotation={rotations[`${c}-${r}`] ?? 0}
            onRotate={rotate}
          />
        ))}
        <path
          d={gridLines}
          fill="none"
          stroke={cssVar.ink}
          strokeOpacity={0.12}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      </svg>
      <RoleCard active={active} style={regionStyle(react, cols, rows)} />
    </div>
  );
}

export default function Hero() {
  const layout = useActiveLayout();

  return (
    <section id="home" className="bg-cream px-3 pt-3 pb-4 sm:px-5 sm:pt-5">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden border-[3px] border-ink bg-cream shadow-bauhaus">
        {/* desktop (lg+): 12×4, name card (with contact inside) cols 8-12 / rows 2-3;
            every other cell is a tile; hand-placed composition */}
        <MosaicGrid
          className="hidden lg:block"
          cols={12}
          rows={4}
          react={{ cs: 8, ce: 13, rs: 2, re: 4 }}
          composition={DESKTOP}
          active={layout === "lg"}
        />

        {/* tablet (md): 10×5, name card cols 1-5 / rows 2-3 */}
        <MosaicGrid
          className="hidden md:block lg:hidden"
          cols={10}
          rows={5}
          react={{ cs: 1, ce: 6, rs: 2, re: 4 }}
          active={layout === "md"}
        />

        {/* mobile: 5×6, name card full width / rows 2-3 */}
        <MosaicGrid
          className="block md:hidden"
          cols={5}
          rows={6}
          react={{ cs: 1, ce: 6, rs: 2, re: 4 }}
          active={layout === "sm"}
        />
      </div>
    </section>
  );
}
