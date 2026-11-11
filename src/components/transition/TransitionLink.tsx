"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "@/components/transition/TransitionProvider";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** color of the wipe block, e.g. `cssVar.orange` */
  color: string;
};

/**
 * A normal next/link (real <a>, works without JS) that plays the fullscreen
 * wipe on plain left-clicks. Ctrl/Cmd/middle clicks open normally.
 */
export default function TransitionLink({
  href,
  color,
  onClick,
  onPointerEnter,
  onFocus,
  onTouchStart,
  ...rest
}: TransitionLinkProps) {
  const navigate = usePageTransition();
  const router = useRouter();

  // Link only prefetches in production and only when visible; prefetching on
  // intent as well means the page is ready by the time the wipe covers the screen
  const prefetch = () => router.prefetch(href);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      !navigate ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    navigate(href, e.currentTarget.getBoundingClientRect(), color);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      onPointerEnter={(e) => {
        prefetch();
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        prefetch();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        prefetch();
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
}
