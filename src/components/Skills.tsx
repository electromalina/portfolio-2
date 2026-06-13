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

type SkillCategoryKey = "frontend" | "backend" | "design";

type SkillItem = { name: string; icon: IconType };
type SkillCategory = { title: string; color: string; items: SkillItem[] };

const skillCategories: Record<SkillCategoryKey, SkillCategory> = {
  frontend: {
    title: "Front-end",
    color: "#E45815",
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
    color: "#7FA1BC",
    items: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Supabase", icon: SiSupabase },
      { name: "REST APIs", icon: TbApi },
      { name: "Git", icon: SiGit },
    ],
  },
  design: {
    title: "Design",
    color: "#F5BE5D",
    items: [
      { name: "Figma", icon: SiFigma },
      { name: "Photoshop", icon: TbPhotoEdit },
    ],
  },
};

const ORDER: SkillCategoryKey[] = ["frontend", "backend", "design"];

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
          <span className="section-tab font-display text-2xl lowercase">
            skills
          </span>
        </div>

        {/* category switch — a segmented toggle, visually distinct from the
            section heading so it clearly reads as the interactive control */}
        <div className="mb-14 flex flex-col items-center gap-3">
          
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
                  onClick={() => setActive(key)}
                  aria-selected={isActive}
                  className={`cursor-pointer px-5 py-2.5 font-body text-sm font-bold uppercase tracking-wide transition-colors sm:px-7 ${
                    i > 0 ? "border-l-[3px] border-ink" : ""
                  } ${isActive ? "text-ink" : "text-ink/55 hover:text-ink"}`}
                  style={{
                    backgroundColor: isActive
                      ? skillCategories[key].color
                      : "transparent",
                  }}
                >
                  {skillCategories[key].title}
                </button>
              );
            })}
          </div>
        </div>

        {/* skill grid — just logo + label, recolor to the category accent on hover */}
        <div
          key={active}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
        >
          {category.items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="group flex flex-col items-center justify-center gap-3 text-ink transition-colors"
                style={{ "--accent": category.color } as React.CSSProperties}
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
