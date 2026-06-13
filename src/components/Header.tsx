"use client";

import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "About Me", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#home"
          onClick={() => setOpen(false)}
          className="focus-bauhaus shrink-0 py-3 font-display text-2xl lowercase leading-none text-cream sm:text-4xl"
        >
          kalynovskyi danylo
        </a>

        {/* desktop nav */}
        <nav aria-label="Primary" className="hidden items-stretch sm:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-bauhaus min-h-11 px-3 py-3 font-body text-xs font-medium text-cream transition-colors hover:bg-orange sm:px-5 sm:py-4 sm:text-base"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="focus-bauhaus flex h-10 w-10 items-center justify-center border-[3px] border-cream text-cream transition-colors hover:bg-orange sm:hidden"
        >
          {open ? <FaXmark className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
        </button>
      </div>

      {/* mobile dropdown nav */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        className={`overflow-hidden border-cream/20 bg-ink transition-[max-height] duration-300 ease-out sm:hidden ${
          open ? "max-h-80 border-t-[3px]" : "max-h-0"
        }`}
      >
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="focus-bauhaus block border-b border-cream/15 px-5 py-4 font-body text-base font-medium text-cream transition-colors hover:bg-orange"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
