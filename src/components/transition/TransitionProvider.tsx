"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { cssVar } from "@/lib/design-tokens";
import { CATEGORIES } from "@/lib/navigation";

/** `color`: the destination's color, when it can't be derived from the URL */
type Navigate = (href: string, color?: string) => void;

const TransitionContext = createContext<Navigate | null>(null);

// ease-in-out: soft start and end, so the panel never "jumps" into motion
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const IN_MS = 380;
const OUT_MS = 420;
// if the route never arrives (e.g. a failed navigation), don't leave the screen covered
const SAFETY_MS = 5000;

/**
 * idle    → nothing on screen
 * in      → panel sliding up to cover the screen
 * covered → screen covered, waiting for the new route to render
 * out     → panel sliding up and off the top, revealing the new page
 */
type Phase = "idle" | "in" | "covered" | "out";

/**
 * Navigate without the slide: when the user asks for reduced motion, and on
 * phones (below Tailwind's sm = 640px), where it only delays the next page.
 * Checked on every navigation, so rotating or resizing takes effect right away.
 */
function skipTransition() {
  return window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 639px)").matches;
}

/** jump without the smooth scroll-behavior set on <html> */
function scrollInstant(top: number) {
  window.scrollTo({ top, behavior: "instant" });
}

/** color of the page on screen: its band (StickyNav marks it), null on home */
function bandColor(): string | null {
  const band = document.querySelector("[data-page-band]");
  return band ? getComputedStyle(band).backgroundColor : null;
}

/** category color from the URL: /about, /projects(/...), /personality */
function categoryColor(path: string): string | null {
  const c = CATEGORIES.find((c) => path === c.href || path.startsWith(`${c.href}/`));
  return c ? cssVar[c.accent] : null;
}

/**
 * Run `fn` once the browser has painted the current frame. Starting an
 * animation in the same frame as a big first paint drops its first frames
 * (visible stutter); one frame later it runs smoothly.
 */
function afterPaint(fn: () => void) {
  let id = requestAnimationFrame(() => {
    id = requestAnimationFrame(fn);
  });
  return () => cancelAnimationFrame(id);
}

/**
 * Page transition: a panel in the destination page's color (ink edges)
 * slides up over the screen, the route changes underneath, then the panel
 * keeps sliding up and off the top. Used for TransitionLink clicks AND
 * browser back/forward.
 *
 * - The latest navigation always wins: a click or Back during a transition
 *   retargets it instead of being ignored.
 * - Back/forward: the popstate event is held back from Next.js (capture
 *   phase, before Next's own listener) until the screen is covered, then
 *   re-dispatched unchanged.
 * - Only `transform` is animated, which the GPU compositor handles, so it
 *   stays smooth while React renders the next page.
 */
export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  const phaseRef = useRef<Phase>("idle");
  // where the current transition is heading, and how to get there once covered
  const targetRef = useRef<string | null>(null);
  const goRef = useRef<(() => void) | null>(null);
  const pathnameRef = useRef(pathname);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // back/forward: newest held-back history state, and the scroll position
  // the browser restored for it (applied once the new page is covered)
  const popStateRef = useRef<unknown>(null);
  const popScrollRef = useRef<number | null>(null);
  const replayingRef = useRef(false);
  const lastScrollRef = useRef(0);
  // band color of every page visited this session (exact for project pages,
  // whose accent can't be derived from the URL)
  const colorsRef = useRef(new Map<string, string | null>());

  /** the destination's color: explicit, remembered, by category, else cream */
  const colorFor = useCallback(
    (path: string, explicit?: string) =>
      explicit ?? colorsRef.current.get(path) ?? categoryColor(path) ?? cssVar.cream,
    []
  );

  const clearSafety = useCallback(() => {
    if (safetyRef.current) clearTimeout(safetyRef.current);
    safetyRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clearSafety();
    phaseRef.current = "idle";
    targetRef.current = null;
    goRef.current = null;
    popScrollRef.current = null;
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.getAnimations().forEach((a) => a.cancel());
    overlay.style.visibility = "hidden";
  }, [clearSafety]);

  const slideOut = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    clearSafety();
    if (popScrollRef.current !== null) {
      scrollInstant(popScrollRef.current);
      popScrollRef.current = null;
    }
    phaseRef.current = "out";
    targetRef.current = null;
    overlay.getAnimations().forEach((a) => a.cancel());
    overlay
      .animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], {
        duration: OUT_MS,
        easing: EASE,
        fill: "forwards",
      })
      .finished.then(() => {
        // a new transition may have taken over in the meantime
        if (phaseRef.current === "out") reset();
      })
      .catch(() => {}); // cancelled by a new transition
  }, [clearSafety, reset]);

  /** screen is covered: navigate, or reveal right away if we're already there */
  const runGo = useCallback(() => {
    const go = goRef.current;
    goRef.current = null;
    // only guard the "covered, waiting for the route" phase: never drop a
    // navigation that hasn't been started yet
    clearSafety();
    safetyRef.current = setTimeout(slideOut, SAFETY_MS);
    go?.();
    // e.g. Back then Forward to the page that's still showing: no route
    // change will follow, so don't wait for one
    if (phaseRef.current === "covered" && targetRef.current === pathnameRef.current) {
      afterPaint(slideOut);
    }
  }, [clearSafety, slideOut]);

  const start = useCallback(
    (target: string, color: string, go: () => void) => {
      const overlay = overlayRef.current;
      if (!overlay) {
        go();
        return;
      }
      // the latest navigation wins
      targetRef.current = target;
      goRef.current = go;

      const phase = phaseRef.current;
      if (phase === "in") return; // the running slide-in calls the latest `go`
      if (phase === "covered") {
        runGo();
        return;
      }

      // idle: come up from below. out: reverse from wherever the panel is now
      // (read before cancelling, which would reset it)
      const current = getComputedStyle(overlay).transform;
      const from =
        phase === "out" && current !== "none" ? current : "translateY(100%)";
      overlay.getAnimations().forEach((a) => a.cancel());
      // set only when a slide-in starts: retargeting mid-way keeps the color,
      // so the panel never flickers between colors
      overlay.style.background = color;
      overlay.style.visibility = "visible";
      phaseRef.current = "in";
      overlay
        .animate([{ transform: from }, { transform: "translateY(0)" }], {
          duration: IN_MS,
          easing: EASE,
          fill: "forwards",
        })
        .finished.then(() => {
          if (phaseRef.current !== "in") return;
          phaseRef.current = "covered";
          runGo();
        })
        .catch(() => {});
    },
    [runGo]
  );

  const navigate = useCallback<Navigate>(
    (href, color) => {
      const target = new URL(href, window.location.href).pathname;
      popScrollRef.current = null; // a click scrolls the new page to the top itself
      if (
        skipTransition() ||
        (phaseRef.current === "idle" && target === pathnameRef.current)
      ) {
        router.push(href);
        return;
      }
      start(target, colorFor(target, color), () => router.push(href));
    },
    [router, start, colorFor]
  );

  // keep track of the page on screen, and remember its color
  useLayoutEffect(() => {
    pathnameRef.current = pathname;
    colorsRef.current.set(pathname, bandColor());
  }, [pathname]);

  // the new route rendered under the cover → slide the panel away
  useEffect(() => {
    if (phaseRef.current !== "covered" || targetRef.current !== pathname) return;
    return afterPaint(slideOut);
  }, [pathname, slideOut]);

  // the browser restores scroll *before* popstate fires; knowing where we
  // were lets us keep the old page still while the panel covers it
  useEffect(() => {
    const onScroll = () => {
      lastScrollRef.current = window.scrollY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // browser back/forward
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      if (replayingRef.current) return; // our own re-dispatch: Next handles it

      const state = e.state as { __NA?: boolean } | null;
      // not a Next.js history entry, reduced motion or a phone: leave it to the browser
      if (!state?.__NA || skipTransition()) return;

      const next = window.location.pathname;
      // same page with nothing in progress (e.g. a #hash change): ignore
      if (phaseRef.current === "idle" && next === pathnameRef.current) return;

      // Hold it back from Next.js. Always intercept while a transition runs,
      // so only the newest history entry is ever replayed.
      e.stopImmediatePropagation();
      popStateRef.current = e.state;
      popScrollRef.current = window.scrollY;
      scrollInstant(lastScrollRef.current); // keep the current page still

      start(next, colorFor(next), () => {
        replayingRef.current = true;
        window.dispatchEvent(new PopStateEvent("popstate", { state: popStateRef.current }));
        replayingRef.current = false;
      });
    };
    window.addEventListener("popstate", onPop, { capture: true });
    return () => window.removeEventListener("popstate", onPop, { capture: true });
  }, [start, colorFor]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[200] border-y-[3px] border-ink will-change-transform"
        style={{ visibility: "hidden" }}
      />
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(TransitionContext);
}
