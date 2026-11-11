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

export const CV = {
  headline: "Media Design Student · Full Stack Developer",
  profile:
    "Motivated ICT & Media Design student with a strong interest in front-end and full-stack web development. Experienced in building responsive web interfaces, designing intuitive user experiences, and creating high-fidelity prototypes. Skilled in branding, user research, and visual design, with a collaborative mindset and a strong willingness to learn new technologies.",
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

  /** null until a PDF exists in /public — the button renders as "coming soon" */
  cvPdfUrl: null as string | null,

  education: [
    {
      period: "2023 — now",
      title: "Media Design & Front-end Development",
      place: "Fontys University of Applied Sciences, Eindhoven",
      bullets: [
        "Relevant coursework: Media Design & Smart Mobile, Front-end Development.",
        "Built responsive web and mobile applications using HTML, CSS, JavaScript, React, TypeScript, and Flutter.",
        "Collaborated on team projects using Git, Notion and Agile methodologies.",
        "Developed user-focused interfaces with an emphasis on accessibility and responsive design.",
      ],
    },
  ] satisfies CvEntry[],

  experience: [] as CvEntry[],

  languages: [
    { name: "English", level: "Proficient" },
    { name: "Ukrainian", level: "Native" },
    { name: "Russian", level: "Native" },
  ] satisfies CvLanguage[],
};
