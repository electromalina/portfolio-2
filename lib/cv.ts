/**
 * CV content for /about. Edit here; the page layout reads everything from this file.
 * Sections with an empty array (e.g. `experience`) are not rendered.
 */

export type CvEntry = {
  /** e.g. "2023 — now" */
  period: string;
  title: string;
  /** school / company, location */
  place: string;
  description?: string;
  bullets?: string[];
};

export type CvLanguage = { name: string; level: string };

export type CvProject = {
  name: string;
  /** small facts shown right of the name, e.g. ["Semester 4", "Team of 5", "2025"] */
  meta: string[];
  /** what the project does / what I did */
  bullets: string[];
  /** true while the entry is still template text — rendered dimmed */
  placeholder?: boolean;
};

export type CvProjectGroup = {
  intro: string;
  items: CvProject[];
};

export const CV = {
  name: "Danylo Kalynovskyi",
  headline: "ICT & Media Design Student · Front-end Developer",
  profile:
    "Third-year ICT & Media Design student at Fontys who designs interfaces and builds them. I work mainly with Next.js, TypeScript and Tailwind, and I've been lead programmer on team projects for real clients, from setting up the architecture to reviewing code and deploying the final product. Outside school I build fun, experimental projects to try out new tools and ideas. I'm now growing towards full-stack development and looking for an internship where I can learn from an experienced team, pick up new skills and grow into a well-rounded developer.",
  focus: ["Front-end", "Full-stack", "UI/UX", "Branding"],

  contact: {
    email: "kalinovskiydan@gmail.com",
    phone: "+31 6 27 53 46 74",
    website: "https://kalynovskyi.dev",
    github: "https://github.com/electromalina",
    linkedin: "https://www.linkedin.com/in/electromalina/",
    location: "Eindhoven, Netherlands",
    nationality: "Ukrainian",
  },

  /** file in /public; set to null to show the disabled "coming soon" button */
  cvPdfUrl: "/Danylo_Kalynovskyi_CV.pdf" as string | null,

  industryProjects: {
    intro:
      "Real projects for real companies, delivered through Fontys semester programmes. I worked in teams where I played a major role, from first client meeting to final delivery.",
    items: [
      {
        name: "OWOW Service Portal",
        meta: ["Semester 5", "Team of 6", "2026"],
        bullets: [
          "Client dashboard where OWOW's clients track project progress, documents, budget and meetings.",
          "Lead programmer: app setup, Supabase auth with roles, code reviews, final polish and deployment.",
          "Delivered a working prototype with handover documentation, ready to connect to live data.",
        ],
      },
      {
        name: "OWOW Atlas – Animation Catalog",
        meta: ["Semester 4", "Team of 6", "2026"],
        bullets: [
          "Internal catalog of UI animations with live demos, tunable controls and copyable code.",
          "Lead programmer: registry architecture, library page with filtering, and developed animations.",
          "Built a plug-in system and validation script so the team can add animations without touching page code.",
        ],
      },
    ],
  } satisfies CvProjectGroup,

  personalProjects: {
    intro:
      "Things I build on my own time to learn new tools and try out ideas, designed and developed end to end by me.",
    items: [
      {
        name: "Flipdot Spotify Display",
        meta: ["Solo", "2025"],
        bullets: [
          "Shows live Spotify playback, including dithered album art, on a physical 84×56 flipdot display.",
          "Learned hardware rendering, OAuth 2.0, image dithering and worker threads in Node.js.",
        ],
      },
      {
        name: "Hryvnia",
        meta: ["Solo", "2026"],
        bullets: [
          "Educational guide to Ukraine's eight banknotes, with interactive 3D notes and security features.",
          "Learned 3D on the web with Three.js and React Three Fiber, and data-driven static pages in Next.js.",
        ],
      },
    ],
  } satisfies CvProjectGroup,

  education: [
    {
      period: "2023 — now",
      title: "HBO-ICT, BSc",
      place: "Fontys University of Applied Sciences, Eindhoven",
      description:
        "Started with Media Design in my first year, then specialised step by step: Smart Mobile (mobile application development) in semester 3, Front-end Development in semester 4 and Full-stack Development in semester 5.",
    },
  ] satisfies CvEntry[],

  experience: [] as CvEntry[],

  languages: [
    { name: "English", level: "Proficient — all studies and projects in English" },
    { name: "Ukrainian", level: "Native" },
    { name: "Russian", level: "Native" },
  ] satisfies CvLanguage[],
};
