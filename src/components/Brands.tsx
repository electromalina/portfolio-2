"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Brand = {
  id: string;
  name: string;
  blurb: string;
  src: string;
  w: number;
  h: number;
  rotation: number;
  // resting position as a fraction of the field (center of the sticker)
  cx: number;
  cy: number;
};

// sizes vary on purpose: wide wordmarks (Levi's, ASICS, Valve, Spalding, OG)
// run bigger; the square marks (Cursor, Spotify, Vivaldi, Notion, Figma,
// Logitech) run smaller. Positions are a deliberately chaotic scatter.
const BRANDS: Brand[] = [
  { id: "valve", name: "Valve", blurb: "Steam is just home for me.", src: "/valve.svg", w: 196, h: 56, rotation: -8, cx: 0.19, cy: 0.13 },
  { id: "vivaldi", name: "Vivaldi", blurb: "Browser that lets me have 47 tabs open without judgment.", src: "/vivaldi.svg", w: 84, h: 84, rotation: 8, cx: 0.45, cy: 0.16 },
  { id: "levis", name: "Levi's", blurb: "A pair of jeans that will outlive every trend. Always.", src: "/levis.svg", w: 170, h: 70, rotation: -5, cx: 0.71, cy: 0.11 },
  { id: "logitech", name: "Logitech", blurb: "Plug it in, forget about it. Still works five years later.", src: "/logitech.svg", w: 58, h: 58, rotation: 10, cx: 0.91, cy: 0.2 },
  { id: "asics", name: "ASICS", blurb: "Shoes my feet and outfit both agree on.", src: "/asics.svg", w: 190, h: 66, rotation: -7, cx: 0.15, cy: 0.45 },
  { id: "og", name: "Optimus Gang", blurb: "Local, raw, homemade, no hype.", src: "/og.svg", w: 156, h: 74, rotation: 6, cx: 0.43, cy: 0.41 },
  { id: "notion", name: "Notion", blurb: "Where all my thoughts go to become something useful.", src: "/notion.svg", w: 68, h: 70, rotation: -11, cx: 0.64, cy: 0.43 },
  { id: "figma", name: "Figma", blurb: "Design with my team, in real time, no excuses.", src: "/figma.svg", w: 56, h: 84, rotation: 7, cx: 0.87, cy: 0.47 },
  { id: "cursor", name: "Cursor", blurb: "This (and at least 10+ others) website were built in cursor.", src: "/cursor.svg", w: 78, h: 88, rotation: -6, cx: 0.17, cy: 0.78 },
  { id: "spotify", name: "Spotify", blurb: "Every mood, every moment.", src: "/spotify.svg", w: 76, h: 76, rotation: 9, cx: 0.44, cy: 0.79 },
  { id: "spalding", name: "Spalding", blurb: "If you've ever touched a basketball, you've touched a Spalding.", src: "/spalding.svg", w: 182, h: 74, rotation: -9, cx: 0.72, cy: 0.76 },
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

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const layout = () => {
      const { width, height } = field.getBoundingClientRect();
      if (!width || !height) return;
      setPositions((prev) => {
        const next: Record<string, Pos> = { ...prev };
        BRANDS.forEach((brand) => {
          if (next[brand.id]) return;
          const x = clamp(
            brand.cx * width - brand.w / 2,
            6,
            Math.max(6, width - brand.w - 6)
          );
          const y = clamp(
            brand.cy * height - brand.h / 2,
            6,
            Math.max(6, height - brand.h - 6)
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
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
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
        rect.width - brand.w
      );
      const y = clamp(
        e.clientY - rect.top - offset.current.y,
        0,
        rect.height - brand.h
      );
      setPositions((prev) => ({ ...prev, [dragId]: { x, y } }));
    },
    [dragId]
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
    <section className="relative bg-cream px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <span className="section-tab font-display text-2xl lowercase">
            my favorite brands
          </span>
          <p className="font-body text-sm font-medium text-ink/60">
            ✦ drag the stickers · hover for the story
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
            return (
              <div
                key={brand.id}
                className="group absolute select-none"
                style={{
                  left: pos?.x ?? 0,
                  top: pos?.y ?? 0,
                  width: brand.w,
                  height: brand.h,
                  zIndex: isDragging ? 999 : zMap[brand.id] ?? 10,
                  opacity: pos ? 1 : 0,
                  cursor: isDragging ? "grabbing" : "grab",
                  touchAction: "none",
                }}
                onPointerDown={handlePointerDown(brand.id)}
              >
                {/* hover tooltip — small text menu */}
                <div
                  className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 w-56 -translate-x-1/2 border-[3px] border-ink bg-cream p-3 text-left opacity-0 shadow-bauhaus-sm transition-opacity duration-200 group-hover:opacity-100"
                  style={{ opacity: isDragging ? 0 : undefined }}
                >
                  <p className="font-display text-base lowercase text-ink">
                    {brand.name}
                  </p>
                  <p className="mt-1 font-body text-xs leading-snug text-ink/75">
                    {brand.blurb}
                  </p>
                  <span
                    className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b-[3px] border-r-[3px] border-ink"
                    style={{ background: "#EEDFBF" }}
                  />
                </div>

                {/* the logo itself is the sticker — no background */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.src}
                  alt={brand.name}
                  draggable={false}
                  className="pointer-events-none h-full w-full select-none object-contain"
                  style={{ transform: `rotate(${brand.rotation}deg)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
