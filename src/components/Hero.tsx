"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

const ROLES = [
  "React Developer",
  "Web Developer",
  "UI/UX Designer",
  "Creative Coder",
];

const CREAM = "#EEDFBF";
const ORANGE = "#E45815";
const BLUE = "#7FA1BC";
const YELLOW = "#F5BE5D";
const INK = "#302E2F";

const SHAPE_BAG = [ORANGE, BLUE, INK, ORANGE, BLUE, INK, YELLOW];
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
        background: CREAM,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          transform: `rotate(${baseRot + rotation}deg)`,
          transition: "transform 650ms cubic-bezier(0.34, 1.4, 0.5, 1)",
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
    <div
      className="flex flex-col justify-center overflow-hidden border-b border-r border-ink/12 bg-cream px-5 sm:px-7"
      style={style}
    >
      <p className="mb-1.5 font-body text-[0.6rem] uppercase tracking-[0.35em] text-ink/55 sm:text-xs">
        I&apos;m a
      </p>
      <h2 className="flex min-h-[1.2em] items-center font-display text-3xl leading-none text-ink sm:text-4xl lg:text-5xl xl:text-6xl">
        <span>{typed}</span>
        <span className="type-cursor" aria-hidden="true" />
      </h2>
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
        className="pointer-events-auto min-w-0 flex-1 truncate font-body text-sm text-ink underline-offset-4 hover:underline sm:text-base"
      >
        kalinovskiydan@gmail.com
      </a>
      <div className="flex shrink-0 gap-2.5">
        <a
          href="https://github.com/electromalina"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-orange text-cream transition-transform hover:-translate-y-0.5"
        >
          <FaGithub className="h-5 w-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/electromalina/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-blue text-cream transition-transform hover:-translate-y-0.5"
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
    <section id="home" className="bg-cream px-3 pt-3 pb-6 sm:px-5 sm:pt-5">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden border-[3px] border-ink bg-cream shadow-bauhaus">
        {/* desktop: 10×5 grid, role at cols 7-10 / rows 2-3, contact at cols 7-10 / row 5 */}
        <MosaicGrid
          className="hidden md:grid"
          cols={10}
          rows={5}
          react={{ cs: 7, ce: 11, rs: 2, re: 4 }}
          contact={{ cs: 7, ce: 11, rs: 5, re: 6 }}
          typed={typed}
        />

        {/* mobile: simpler 4-col grid, role + contact span full width */}
        <MosaicGrid
          className="grid md:hidden"
          cols={4}
          rows={5}
          react={{ cs: 1, ce: 5, rs: 2, re: 4 }}
          contact={{ cs: 1, ce: 5, rs: 5, re: 6 }}
          typed={typed}
        />
      </div>
    </section>
  );
}
