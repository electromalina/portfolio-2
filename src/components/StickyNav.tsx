"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";

type StickyNavProps = {
  /** id of the big page title; when it scrolls under this bar, the bar goes compact */
  titleId: string;
  /** small copy of the page title shown in the bar once the big one is gone */
  title: string;
  /** band colour class, so the bar and the title band read as one block at the top */
  bandClass: string;
  left: ReactNode;
  /** desktop switcher (hidden on phones) */
  right: ReactNode;
  /** full, labelled list of sections shown in the phone menu panel */
  menu: ReactNode;
};

/**
 * Top row of every category page (back button + section switcher). It sticks to
 * the top of the viewport; the big title below it scrolls away normally.
 *
 * IntersectionObserver (not a scroll listener) tells us when the big title has
 * passed under the bar: the browser does the math off the main thread and only
 * calls us when the answer flips, instead of on every scroll frame.
 *
 * On phones the switcher has no room for labels, so it becomes a Menu button
 * that opens a panel with every section written out.
 */
export default function StickyNav({
  titleId,
  title,
  bandClass,
  left,
  right,
  menu,
}: StickyNavProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const target = document.getElementById(titleId);
    const bar = barRef.current;
    if (!target || !bar) return;

    // shrink the observed area from the top by the bar's height, so "not
    // intersecting" means "fully hidden behind the bar", not "off screen"
    const observer = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { rootMargin: `-${bar.offsetHeight}px 0px 0px 0px` }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [titleId]);

  // menu: Escape or a tap outside the bar closes it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const showRule = compact || open;

  return (
    <div
      ref={barRef}
      // TransitionProvider remembers this band's color for back/forward
      data-page-band
      // at the top the bar blends into the title band (transparent border);
      // once compact (or with the menu open) it gets the ink rule.
      // translateZ(0): own GPU layer from the first paint, so iOS Safari doesn't
      // draw the page one frame before the sticky bar after a navigation
      className={`sticky top-0 z-40 border-b-[3px] [transform:translateZ(0)] transition-colors duration-200 ${bandClass} ${
        showRule ? "border-ink" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        {left}
        <p
          aria-hidden="true"
          className={`hidden min-w-0 flex-1 truncate text-center font-display text-2xl font-semibold lowercase leading-none text-ink transition-opacity duration-200 md:block ${
            compact ? "opacity-100" : "opacity-0"
          }`}
        >
          {title}
        </p>

        <div className="hidden sm:block">{right}</div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="focus-bauhaus inline-flex min-h-11 shrink-0 items-center gap-2 border-[3px] border-ink bg-cream px-4 font-body text-sm font-bold uppercase tracking-wide text-ink shadow-bauhaus-sm sm:hidden"
        >
          {open ? (
            <FaXmark className="h-4 w-4" aria-hidden="true" />
          ) : (
            <FaBars className="h-4 w-4" aria-hidden="true" />
          )}
          Menu
        </button>
      </div>

      {/* phone menu panel: hangs under the bar, over the page content.
          Drop-down / pull-up animation: the grid row animates between 0fr and
          1fr, which (unlike height: auto) the browser can transition smoothly.
          `inert` while closed: links can't be tabbed to or read out when hidden.
          Any click inside (i.e. on a link) closes it. */}
      <div
        id={panelId}
        inert={!open}
        onClick={() => setOpen(false)}
        className={`absolute inset-x-0 top-full grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-b-[3px] border-ink bg-cream">{menu}</div>
        </div>
      </div>
    </div>
  );
}
