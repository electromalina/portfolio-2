import type { IconType } from "react-icons";
import {
  SiCss,
  SiDart,
  SiFigma,
  SiFlutter,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiNotion,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWebstorm,
} from "react-icons/si";
import {
  TbApi,
  TbBook,
  TbBrandReactNative,
  TbClick,
  TbCode,
  TbDevices,
  TbLayoutBoard,
  TbLayoutDashboard,
  TbMessages,
  TbPalette,
  TbPhotoEdit,
  TbPuzzle,
  TbRefresh,
  TbShieldLock,
  TbUserHeart,
  TbUserSearch,
  TbUsersGroup,
} from "react-icons/tb";
import type { AccentName } from "@/lib/design-tokens";

export type SkillItem = { name: string; icon: IconType };
export type SkillCategory = { title: string; accent: AccentName; items: SkillItem[] };

// Icons: brand logos from Simple Icons (Si*); generic concepts from Tabler (Tb*).
// react-icons v5.6 has no Cursor logo, so Cursor uses a generic code icon.
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
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "REST APIs", icon: TbApi },
      { name: "Authentication", icon: TbShieldLock },
    ],
  },
  {
    title: "Mobile",
    accent: "yellow",
    items: [
      { name: "Flutter", icon: SiFlutter },
      { name: "Dart", icon: SiDart },
      { name: "React Native", icon: TbBrandReactNative },
    ],
  },
  {
    title: "Design",
    accent: "orange",
    items: [
      { name: "UI/UX Design", icon: TbLayoutDashboard },
      { name: "Responsive Design", icon: TbDevices },
      { name: "Wireframing", icon: TbLayoutBoard },
      { name: "Prototyping", icon: TbClick },
      { name: "User Research", icon: TbUserSearch },
      { name: "Branding", icon: TbPalette },
      { name: "Figma", icon: SiFigma },
      { name: "Photoshop", icon: TbPhotoEdit },
    ],
  },
  {
    title: "Tools & Approach",
    accent: "blue",
    items: [
      { name: "Git", icon: SiGit },
      { name: "Vercel", icon: SiVercel },
      { name: "Notion", icon: SiNotion },
      { name: "WebStorm", icon: SiWebstorm },
      { name: "Cursor", icon: TbCode },
      { name: "Agile / Scrum", icon: TbRefresh },
      { name: "Teamwork", icon: TbUsersGroup },
      { name: "Client Communication", icon: TbMessages },
      { name: "User Centered Design", icon: TbUserHeart },
      { name: "Problem Solving", icon: TbPuzzle },
      { name: "Self-learning", icon: TbBook },
    ],
  },
];
