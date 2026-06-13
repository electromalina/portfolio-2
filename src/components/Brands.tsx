"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import SectionHeading from "@/components/SectionHeading";

type Brand = {
  id: string;
  name: string;
  blurb: string;
  src: string;
  w: number;
  h: number;
  rotation: number;
  cx: number;
  cy: number;
};

// chaotic scatter: overlapping clusters, varied rotations — a real sticker pile
const BRANDS: Brand[] = [
  { id: "valve", name: "Valve", blurb: "Steam is just home for me.", src: "/valve.svg", w: 196, h: 56, rotation: -13, cx: 0.24, cy: 0.17 },
  { id: "vivaldi", name: "Vivaldi", blurb: "Browser that lets me have 47 tabs open without judgment.", src: "/vivaldi.svg", w: 84, h: 84, rotation: 15, cx: 0.53, cy: 0.12 },
  { id: "levis", name: "Levi's", blurb: "A pair of jeans that will outlive every trend. Always.", src: "/levis.svg", w: 170, h: 70, rotation: -6, cx: 0.78, cy: 0.19 },
  { id: "logitech", name: "Logitech", blurb: "Plug it in, forget about it. Still works five years later.", src: "/logitech.svg", w: 58, h: 58, rotation: 18, cx: 0.92, cy: 0.46 },
  { id: "asics", name: "ASICS", blurb: "Shoes my feet and outfit both agree on.", src: "/asics.svg", w: 190, h: 66, rotation: 9, cx: 0.33, cy: 0.4 },
  { id: "og", name: "Optimus Gang", blurb: "Local, raw, homemade, no hype.", src: "/og.svg", w: 156, h: 74, rotation: -10, cx: 0.62, cy: 0.39 },
  { id: "notion", name: "Notion", blurb: "Where all my thoughts go to become something useful.", src: "/notion.svg", w: 68, h: 70, rotation: -16, cx: 0.12, cy: 0.6 },
  { id: "figma", name: "Figma", blurb: "Design with my team, in real time, no excuses.", src: "/figma.svg", w: 56, h: 84, rotation: 12, cx: 0.83, cy: 0.66 },
  { id: "cursor", name: "Cursor", blurb: "This (and at least 10+ others) website were built in cursor.", src: "/cursor.svg", w: 78, h: 88, rotation: -7, cx: 0.42, cy: 0.69 },
  { id: "spotify", name: "Spotify", blurb: "Every mood, every moment.", src: "/spotify.svg", w: 76, h: 76, rotation: 14, cx: 0.63, cy: 0.78 },
  { id: "spalding", name: "Spalding", blurb: "If you've ever touched a basketball, you've touched a Spalding.", src: "/spalding.svg", w: 182, h: 74, rotation: -11, cx: 0.27, cy: 0.83 },
];

const BRAND_BY_ID = Object.fromEntries(BRANDS.map((b) => [b.id, b]));

type Pos = { x: number; y: number };

export default function Brands() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, Pos>>({});
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const topZ = useRef(10);
  const offset = useRef<Pos>({ x: 0, y: 0 });
  // stickers shrink on small fields so the chaotic pile still fits
  const [sizeScale, setSizeScale] = useState(1);
  const scaleRef = useRef(1);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const layout = () => {
      const { width, height } = field.getBoundingClientRect();
      if (!width || !height) return;

      const scale = clamp(width / 760, 0.46, 1);
      const reseed = scale !== scaleRef.current;
      scaleRef.current = scale;
      setSizeScale(scale);

      setPositions((prev) => {
        // crossing a breakpoint reshuffles to fit the new sizes; otherwise we
        // keep whatever the visitor has already dragged
        const next: Record<string, Pos> = reseed ? {} : { ...prev };
        BRANDS.forEach((brand) => {
          if (next[brand.id]) return;
          const w = brand.w * scale;
          const h = brand.h * scale;
          const x = clamp(brand.cx * width - w / 2, 6, Math.max(6, width - w - 6));
          const y = clamp(
            brand.cy * height - h / 2,
            6,
            Math.max(6, height - h - 6)
          );
          next[brand.id] = { x, y };
        });
        return next;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, []);

  const handlePointerDown = (id: string) => (e: React.PointerEvent) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const pos = positions[id] ?? { x: 0, y: 0 };
    offset.current = {
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top - pos.y,
    };
    topZ.current += 1;
    setZMap((m) => ({ ...m, [id]: topZ.current }));
    setDragId(id);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragId) return;
      const field = fieldRef.current;
      if (!field) return;
      const brand = BRAND_BY_ID[dragId];
      const rect = field.getBoundingClientRect();
      const x = clamp(
        e.clientX - rect.left - offset.current.x,
        0,
        rect.width - brand.w * sizeScale
      );
      const y = clamp(
        e.clientY - rect.top - offset.current.y,
        0,
        rect.height - brand.h * sizeScale
      );
      setPositions((prev) => ({ ...prev, [dragId]: { x, y } }));
    },
    [dragId, sizeScale]
  );

  const endDrag = useCallback(() => setDragId(null), []);

  useEffect(() => {
    if (!dragId) return;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [dragId, handlePointerMove, endDrag]);

  return (
    <section className="relative overflow-x-clip bg-cream px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading>my favorite brands</SectionHeading>
          <p className="font-body text-sm font-medium text-ink/70">
            ✦ drag the stickers · focus or hover for the story
          </p>
        </div>

        <div
          ref={fieldRef}
          className="relative h-[480px] w-full touch-none border-[3px] border-ink bg-cream shadow-bauhaus sm:h-[540px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(48,46,47,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(48,46,47,0.07) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        >
          {BRANDS.map((brand) => {
            const pos = positions[brand.id];
            const isDragging = dragId === brand.id;
            const tooltipId = `brand-tip-${brand.id}`;
            return (
              <button
                key={brand.id}
                type="button"
                aria-label={brand.name}
                aria-describedby={tooltipId}
                className="group absolute select-none border-0 bg-transparent p-0 focus-bauhaus"
                style={{
                  left: pos?.x ?? 0,
                  top: pos?.y ?? 0,
                  width: brand.w * sizeScale,
                  height: brand.h * sizeScale,
                  zIndex: isDragging ? 999 : zMap[brand.id] ?? 10,
                  opacity: pos ? 1 : 0,
                  cursor: isDragging ? "grabbing" : "grab",
                  touchAction: "none",
                }}
                onPointerDown={handlePointerDown(brand.id)}
              >
                <div
                  id={tooltipId}
                  role="tooltip"
                  className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 w-56 -translate-x-1/2 border-[3px] border-ink bg-cream p-3 text-left opacity-0 shadow-bauhaus-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ opacity: isDragging ? 0 : undefined }}
                >
                  <p className="font-display text-lg lowercase text-ink">
                    {brand.name}
                  </p>
                  <p className="mt-1 font-body text-xs leading-snug text-ink/75">
                    {brand.blurb}
                  </p>
                  <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b-[3px] border-r-[3px] border-ink bg-cream" />
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.src}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="pointer-events-none h-full w-full select-none object-contain"
                  style={{ transform: `rotate(${brand.rotation}deg)` }}
                />
              </button>
            );
          })}
        </div>

        <ul
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:hidden"
          aria-label="Brand stories"
        >
          {BRANDS.map((brand) => (
            <li
              key={brand.id}
              className="border-2 border-ink bg-cream px-4 py-3 font-body text-sm text-ink"
            >
              <span className="font-display text-lg lowercase">{brand.name}</span>
              <span className="text-ink/75">: {brand.blurb}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
