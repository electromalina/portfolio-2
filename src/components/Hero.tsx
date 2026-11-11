"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { cssVar } from "@/lib/design-tokens";

const ROLES = [
  "React Developer",
  "Web Developer",
  "UI/UX Designer",
  "Creative Coder",
];

const SHAPE_BAG = [
  cssVar.orange,
  cssVar.blue,
  cssVar.ink,
  cssVar.orange,
  cssVar.blue,
  cssVar.ink,
  cssVar.yellow,
];
// ONE consistent geometry so tiles connect like a puzzle: every motif's dividing
// edge runs corner-to-corner (the cell diagonal) at the same full-cell scale.
// Quarter-circles dominate so 4 around a shared corner build a full circle.
const MOTIF_BAG = [
  "quarter",
  "quarter",
  "quarter",
  "quarter",
  "quarter",
  "quarter",
  "triangle",
  "triangle",
  "triangle",
  "block",
] as const;

type Motif = (typeof MOTIF_BAG)[number];

// grid line numbers (1-indexed). cols 7..10 = lines 7..11
type Region = { cs: number; ce: number; rs: number; re: number };

// deterministic per-tile pseudo-random so SSR and client agree
function hash(n: number) {
  let x = (n + 1) * 2654435761;
  x = (x ^ (x >>> 13)) >>> 0;
  return x;
}

function motifStyle(motif: Motif, color: string): CSSProperties {
  switch (motif) {
    case "quarter":
      // quarter disc, radius = full cell, centred on one corner. Its two straight
      // edges run the full cell edges; the arc spans the opposite two corners, so
      // four tiles meeting at a corner form one complete circle.
      return { inset: 0, background: color, borderRadius: "100% 0 0 0" };
    case "triangle":
      // same corner-to-corner diagonal as the quarter, but straight
      return {
        inset: 0,
        background: color,
        clipPath: "polygon(0 0, 100% 0, 0 100%)",
      };
    case "block":
    default:
      return { inset: 0, background: color };
  }
}

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
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
  }, [text, deleting, wordIndex, words]);

  return text;
}

function Tile({
  c,
  r,
  seed,
  rotation,
  onRotate,
}: {
  c: number;
  r: number;
  seed: number;
  rotation: number;
  onRotate: (key: string) => void;
}) {
  const h = hash(seed);
  const motif = MOTIF_BAG[h % MOTIF_BAG.length];
  const shape = SHAPE_BAG[(h >>> 4) % SHAPE_BAG.length];
  const baseRot = ((h >>> 8) % 4) * 90;

  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={() => onRotate(`${c}-${r}`)}
      className="relative cursor-pointer overflow-hidden border-b border-r border-ink/12 p-0"
      style={{
        gridColumn: c,
        gridRow: r,
        background: cssVar.cream,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          transform: `rotate(${baseRot + rotation}deg)`,
          transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <span className="absolute" style={motifStyle(motif, shape)} />
      </span>
    </button>
  );
}

function RoleCard({
  typed,
  style,
}: {
  typed: string;
  style: CSSProperties;
}) {
  return (
    // @container: children are sized in cqi (% of this card's width), so the
    // name always fits on one line. cqi on the container itself would measure
    // its parent instead, hence the inner wrapper carries padding + gap.
    <div
      className="@container overflow-hidden border-b border-r border-ink/12 bg-cream"
      style={style}
    >
      <div className="flex h-full flex-col justify-center gap-[1.6cqi] px-[4cqi]">
        <h1 className="whitespace-nowrap font-display font-semibold text-[5.6cqi] lowercase leading-none text-ink">
          danylo kalynovskyi
        </h1>
        {/* screen readers get the full list once instead of every typed letter */}
        <p className="sr-only">{ROLES.join(", ")}</p>
        <p
          aria-hidden="true"
          className="flex min-h-[1.2em] items-center gap-[1.6cqi] font-display text-[max(0.85rem,3.2cqi)] leading-none text-ink/85"
        >
          <span className="block h-[3px] w-[5cqi] shrink-0 bg-orange" />
          <span>{typed}</span>
          <span className="type-cursor" />
        </p>
      </div>
    </div>
  );
}

function ContactCard({ style }: { style: CSSProperties }) {
  return (
    <div
      className="flex items-center justify-between gap-3 overflow-hidden border-b border-r border-ink/12 bg-cream px-4 py-3 sm:px-6"
      style={style}
    >
      <a
        href="mailto:kalinovskiydan@gmail.com"
        className="focus-bauhaus pointer-events-auto min-w-0 flex-1 truncate font-body text-sm text-ink underline-offset-4 hover:underline sm:text-base"
      >
        kalinovskiydan@gmail.com
      </a>
      <div className="flex shrink-0 gap-2.5">
        <a
          href="https://github.com/electromalina"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="focus-bauhaus pointer-events-auto flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-orange text-cream transition-transform hover:-translate-y-0.5"
        >
          <FaGithub className="h-5 w-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/electromalina/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="focus-bauhaus pointer-events-auto flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-blue text-cream transition-transform hover:-translate-y-0.5"
        >
          <FaLinkedinIn className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}

function MosaicGrid({
  cols,
  rows,
  react,
  contact,
  typed,
  className,
}: {
  cols: number;
  rows: number;
  react: Region;
  contact: Region;
  typed: string;
  className: string;
}) {
  const [rotations, setRotations] = useState<Record<string, number>>({});

  const cells = useMemo(() => {
    const covers = (reg: Region, c: number, r: number) =>
      c >= reg.cs && c < reg.ce && r >= reg.rs && r < reg.re;
    const arr: { c: number; r: number; seed: number }[] = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        if (covers(react, c, r) || covers(contact, c, r)) continue;
        arr.push({ c, r, seed: (r - 1) * cols + c });
      }
    }
    return arr;
  }, [cols, rows, react, contact]);

  // the site's own touch: rotate a random tile every so often (not constant)
  useEffect(() => {
    if (cells.length === 0) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = setInterval(() => {
      const cell = cells[Math.floor(Math.random() * cells.length)];
      const key = `${cell.c}-${cell.r}`;
      setRotations((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 90 }));
    }, 1300);

    return () => clearInterval(id);
  }, [cells]);

  const rotate = (key: string) =>
    setRotations((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 90 }));

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    // square cells → arcs are true circles that line up as a puzzle
    aspectRatio: `${cols} / ${rows}`,
  };

  return (
    <div
      className={`w-full border-l border-t border-ink/12 ${className}`}
      style={gridStyle}
    >
      {cells.map(({ c, r, seed }) => (
        <Tile
          key={`${c}-${r}`}
          c={c}
          r={r}
          seed={seed}
          rotation={rotations[`${c}-${r}`] ?? 0}
          onRotate={rotate}
        />
      ))}
      <RoleCard
        typed={typed}
        style={{
          gridColumn: `${react.cs} / ${react.ce}`,
          gridRow: `${react.rs} / ${react.re}`,
        }}
      />
      <ContactCard
        style={{
          gridColumn: `${contact.cs} / ${contact.ce}`,
          gridRow: `${contact.rs} / ${contact.re}`,
        }}
      />
    </div>
  );
}

export default function Hero() {
  const typed = useTypewriter(ROLES);

  return (
    <section id="home" className="bg-cream px-3 pt-3 pb-4 sm:px-5 sm:pt-5">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden border-[3px] border-ink bg-cream shadow-bauhaus">
        {/* The name card is one row tall everywhere, leaving more room for tiles.
            desktop (lg+): 10×4, name cols 5-10 / row 2, contact cols 7-10 / row 4 */}
        <MosaicGrid
          className="hidden lg:grid"
          cols={10}
          rows={4}
          react={{ cs: 5, ce: 11, rs: 2, re: 3 }}
          contact={{ cs: 7, ce: 11, rs: 4, re: 5 }}
          typed={typed}
        />

        {/* tablet (md): 8×4, name cols 1-6 / row 2, contact cols 5-8 / row 4 */}
        <MosaicGrid
          className="hidden md:grid lg:hidden"
          cols={8}
          rows={4}
          react={{ cs: 1, ce: 7, rs: 2, re: 3 }}
          contact={{ cs: 5, ce: 9, rs: 4, re: 5 }}
          typed={typed}
        />

        {/* mobile: 4×5, name full width / row 2, contact full width / row 5 */}
        <MosaicGrid
          className="grid md:hidden"
          cols={4}
          rows={5}
          react={{ cs: 1, ce: 5, rs: 2, re: 3 }}
          contact={{ cs: 1, ce: 5, rs: 5, re: 6 }}
          typed={typed}
        />
      </div>
    </section>
  );
}
