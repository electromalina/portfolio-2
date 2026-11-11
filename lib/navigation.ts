import type { AccentName } from "@/lib/design-tokens";

/** The three fullscreen categories opened from the homepage menu. */
export type Category = {
  id: "about" | "projects" | "personality";
  href: string;
  number: string;
  title: string;
  teaser: string;
  accent: AccentName;
};

export const CATEGORIES: readonly Category[] = [
  {
    id: "about",
    href: "/about",
    number: "01",
    title: "about me",
    teaser: "CV at a glance: education, experience, skills and contact.",
    accent: "orange",
  },
  {
    id: "projects",
    href: "/projects",
    number: "02",
    title: "featured projects",
    teaser: "Selected work, from brief to live demo.",
    accent: "blue",
  },
  {
    id: "personality",
    href: "/personality",
    number: "03",
    title: "personality",
    teaser: "The music, brands and habits behind the work.",
    accent: "yellow",
  },
];

/** Static class names so Tailwind can see them at build time. */
export const ACCENT_BG: Record<AccentName, string> = {
  orange: "bg-orange",
  blue: "bg-blue",
  yellow: "bg-yellow",
};
