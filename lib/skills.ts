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
import {
  TbApi,
  TbLayoutDashboard,
  TbPhotoEdit,
  TbPuzzle,
  TbUserHeart,
} from "react-icons/tb";
import type { AccentName } from "@/lib/design-tokens";

export type SkillItem = { name: string; icon: IconType };
export type SkillCategory = { title: string; accent: AccentName; items: SkillItem[] };

export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
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
  {
    title: "Back-end",
    accent: "blue",
    items: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Supabase", icon: SiSupabase },
      { name: "REST APIs", icon: TbApi },
      { name: "Git", icon: SiGit },
    ],
  },
  {
    title: "Design",
    accent: "yellow",
    items: [
      { name: "UI/UX Design", icon: TbLayoutDashboard },
      { name: "Figma", icon: SiFigma },
      { name: "Photoshop", icon: TbPhotoEdit },
    ],
  },
  {
    title: "Approach",
    accent: "orange",
    items: [
      { name: "User Centered Design", icon: TbUserHeart },
      { name: "Problem Solving", icon: TbPuzzle },
    ],
  },
];
