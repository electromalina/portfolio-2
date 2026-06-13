import { createAdmin } from "@/lib/supabase/admin";
import type { Project } from "@/app/actions/projects";

/**
 * Public read used by the homepage. Returns only visible (non-hidden)
 * projects, newest first. Runs server-side only.
 *
 * Wrapped in try/catch so the homepage still renders (with an empty list)
 * if Supabase env vars are missing or the request fails.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = createAdmin();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getPublishedProjects error:", error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("getPublishedProjects failed:", err);
    return [];
  }
}
