/**
 * The structured story sections of a project, in display order.
 * Shared by the admin forms, the server actions and the detail page,
 * so adding a section means: add a column, add a line here.
 */
export const PROJECT_SECTIONS = [
  { key: "what_it_does", label: "What it does" },
  { key: "how_demo_works", label: "How the demo works" },
  { key: "technical_choices", label: "Technical choices" },
  { key: "whats_next", label: "What's next" },
] as const;

export type ProjectSectionKey = (typeof PROJECT_SECTIONS)[number]["key"];
