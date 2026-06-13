"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  SiCss,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbApi, TbPhotoEdit } from "react-icons/tb";
import SectionHeading from "@/components/SectionHeading";
import type { AccentName } from "@/lib/design-tokens";

type SkillCategoryKey = "frontend" | "backend" | "design";

type SkillItem = { name: string; icon: IconType };
type SkillCategory = { title: string; accent: AccentName; items: SkillItem[] };

const skillCategories: Record<SkillCategoryKey, SkillCategory> = {
  frontend: {
    title: "Front-end",
    accent: "orange",
    items: [
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind", icon: SiTailwindcss },
    ],
  },
  backend: {
    title: "Back-end",
    accent: "blue",
    items: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Supabase", icon: SiSupabase },
      { name: "REST APIs", icon: TbApi },
      { name: "Git", icon: SiGit },
    ],
  },
  design: {
    title: "Design",
    accent: "yellow",
    items: [
      { name: "Figma", icon: SiFigma },
      { name: "Photoshop", icon: TbPhotoEdit },
    ],
  },
};

const ORDER: SkillCategoryKey[] = ["frontend", "backend", "design"];

const TAB_IDS: Record<SkillCategoryKey, string> = {
  frontend: "skills-tab-frontend",
  backend: "skills-tab-backend",
  design: "skills-tab-design",
};

const PANEL_ID = "skills-panel";

const ACTIVE_TAB_BG: Record<AccentName, string> = {
  orange: "bg-orange",
  blue: "bg-blue",
  yellow: "bg-yellow",
};

export default function Skills() {
  const [active, setActive] = useState<SkillCategoryKey>("frontend");
  const category = skillCategories[active];

  return (
    <section
      id="skills"
      className="relative bg-cream px-5 py-24 sm:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionHeading>skills</SectionHeading>
        </div>

        <div className="mb-20 flex flex-col items-center gap-3 sm:mb-24">
          <div
            role="tablist"
            aria-label="Skill categories"
            className="inline-flex overflow-hidden border-[3px] border-ink shadow-bauhaus-sm"
          >
            {ORDER.map((key, i) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={TAB_IDS[key]}
                  aria-controls={PANEL_ID}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(key)}
                  className={`focus-bauhaus cursor-pointer px-5 py-2.5 font-body text-sm font-bold uppercase tracking-wide transition-colors sm:px-7 ${
                    i > 0 ? "border-l-[3px] border-ink" : ""
                  } ${isActive ? "text-ink" : "text-ink/70 hover:text-ink"} ${
                    isActive ? ACTIVE_TAB_BG[skillCategories[key].accent] : "bg-transparent"
                  }`}
                >
                  {skillCategories[key].title}
                </button>
              );
            })}
          </div>
        </div>

        <div
          key={active}
          role="tabpanel"
          id={PANEL_ID}
          aria-labelledby={TAB_IDS[active]}
          tabIndex={0}
          className="mx-auto grid min-h-[26rem] max-w-4xl grid-cols-2 content-start gap-x-6 gap-y-10 sm:min-h-[21rem] sm:grid-cols-3 lg:min-h-[15rem] lg:grid-cols-4"
        >
          {category.items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="group flex flex-col items-center justify-center gap-3 text-ink transition-colors"
                style={
                  {
                    "--accent": `var(--color-${category.accent})`,
                  } as React.CSSProperties
                }
              >
                <Icon className="h-14 w-14 transition-colors duration-300 group-hover:text-[var(--accent)]" />
                <span className="font-body text-sm font-bold uppercase tracking-wide transition-colors duration-300 group-hover:text-[var(--accent)]">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
