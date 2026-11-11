"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type Navigate = (href: string, from: DOMRect | null, color: string) => void;

const TransitionContext = createContext<Navigate | null>(null);

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const IN_MS = 380;
const OUT_MS = 420;
// if the route never changes (e.g. a failed navigation), don't leave the screen covered
const SAFETY_MS = 5000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** transform that shrinks a fullscreen block onto the clicked element's box */
function transformFromRect(rect: DOMRect) {
  const sx = rect.width / window.innerWidth;
  const sy = rect.height / window.innerHeight;
  return `translate(${rect.left}px, ${rect.top}px) scale(${sx}, ${sy})`;
}

/**
 * Fullscreen "block wipe" between pages: a colored block grows from the
 * clicked element to cover the screen, the route changes underneath, then
 * the block wipes away to reveal the new page.
 *
 * Performance notes:
 * - Only `transform` is animated. The browser hands that to the GPU
 *   compositor, so it stays smooth even while React renders the next page.
 *   (Animating clip-path/width/height repaints every frame → stutter.)
 * - TransitionLink prefetches the route on hover/focus/touch, so by the time
 *   the block covers the screen the next page is already loaded.
 */
export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null);
  const growRef = useRef<Promise<unknown> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    if (safetyRef.current) clearTimeout(safetyRef.current);
    pendingRef.current = null;
    growRef.current = null;
    if (!overlay) return;
    overlay.getAnimations().forEach((a) => a.cancel());
    overlay.style.visibility = "hidden";
  }, []);

  const navigate = useCallback<Navigate>(
    (href, from, color) => {
      const overlay = overlayRef.current;
      const target = new URL(href, window.location.href).pathname;

      if (!overlay || prefersReducedMotion() || target === pathname) {
        router.push(href);
        return;
      }
      if (pendingRef.current) return; // ignore double clicks mid-transition

      pendingRef.current = target;
      overlay.style.background = color;
      overlay.style.visibility = "visible";

      const start = from ? transformFromRect(from) : "translateY(100%)";
      growRef.current = overlay
        .animate([{ transform: start }, { transform: "none" }], {
          duration: IN_MS,
          easing: EASE,
          fill: "forwards",
        })
        .finished.catch(() => {});

      // swap the page only once it's fully covered (otherwise a prefetched page
      // would flash around the growing block). TransitionLink prefetches on
      // hover, so this push is usually instant.
      growRef.current.then(() => {
        if (pendingRef.current === target) router.push(href);
      });

      if (safetyRef.current) clearTimeout(safetyRef.current);
      safetyRef.current = setTimeout(hideOverlay, SAFETY_MS);
    },
    [pathname, router, hideOverlay]
  );

  // route changed underneath the overlay → once the grow has finished,
  // slide the block down off the screen (top of the new page appears first)
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || pendingRef.current !== pathname) return;

    let cancelled = false;
    (growRef.current ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      overlay
        .animate([{ transform: "none" }, { transform: "translateY(100%)" }], {
          duration: OUT_MS,
          easing: EASE,
          fill: "forwards",
        })
        .finished.then(hideOverlay)
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, hideOverlay]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[200] origin-top-left will-change-transform"
        style={{ visibility: "hidden" }}
      />
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(TransitionContext);
}
