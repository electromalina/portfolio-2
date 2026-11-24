import type { Project } from "@/app/actions/projects";
import { PROJECT_SECTIONS } from "@/lib/project-sections";

const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";
const inputClass =
  "mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
const hintClass = "mt-1 text-xs text-zinc-500 dark:text-zinc-400";

/** Subheading, summary and the story sections. Shared by the new + edit forms. */
export default function ProjectStoryFields({ project }: { project?: Project }) {
  return (
    <>
      <div>
        <label htmlFor="subheading" className={labelClass}>
          Subheading
        </label>
        <input
          type="text"
          name="subheading"
          id="subheading"
          maxLength={140}
          defaultValue={project?.subheading ?? ""}
          className={inputClass}
        />
        <p className={hintClass}>
          One short line shown on the projects page card.
        </p>
      </div>

      <div>
        <label htmlFor="summary" className={labelClass}>
          Summary
        </label>
        <textarea
          name="summary"
          id="summary"
          rows={3}
          defaultValue={project?.summary ?? ""}
          className={inputClass}
        />
        <p className={hintClass}>
          Lead paragraph under the title on the project page.
        </p>
      </div>

      {PROJECT_SECTIONS.map(({ key, label }) => (
        <div key={key}>
          <label htmlFor={key} className={labelClass}>
            {label}
          </label>
          <textarea
            name={key}
            id={key}
            rows={6}
            defaultValue={project?.[key] ?? ""}
            className={inputClass}
          />
        </div>
      ))}
      <p className={hintClass}>Empty sections are hidden on the site.</p>
    </>
  );
}
