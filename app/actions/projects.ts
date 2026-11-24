"use server";

import { requireAuth } from "@/app/admin/actions/auth";
import { createAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PROJECT_SECTIONS, type ProjectSectionKey } from "@/lib/project-sections";


const DEFAULT_COVER_URL = "https://placehold.co/600x400?text=Placeholder+Image";

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dashes
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing dashes
}

export type Project = {
  id: string;
  slug: string;
  title: string;
  /** Short line shown on the /projects card. */
  subheading: string | null;
  /** Lead paragraph on the detail page, also used as meta description. */
  summary: string | null;
  tags: string[] | null;
  cover_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  show_demo_button: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
} & Record<ProjectSectionKey, string | null>;

/** Trimmed string from the form, or null when empty. */
function optionalText(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Shared by create + update so both always write the same columns. */
function parseProjectForm(formData: FormData) {
  const title = (formData.get("title") as string).trim();
  const tags = (optionalText(formData, "tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const sections = Object.fromEntries(
    PROJECT_SECTIONS.map(({ key }) => [key, optionalText(formData, key)])
  ) as Record<ProjectSectionKey, string | null>;

  return {
    title,
    slug: generateSlug(title),
    subheading: optionalText(formData, "subheading"),
    summary: optionalText(formData, "summary"),
    ...sections,
    tags: tags.length > 0 ? tags : null,
    cover_url: optionalText(formData, "cover_url") ?? DEFAULT_COVER_URL,
    demo_url: optionalText(formData, "demo_url"),
    github_url: optionalText(formData, "github_url"),
    show_demo_button: formData.get("show_demo_button") === "on",
    is_hidden: formData.get("is_hidden") === "on",
  };
}

// GET ALL (for admin - includes hidden projects)
export async function getAllProjects(): Promise<Project[]> {
  await requireAuth();
  const supabase = createAdmin();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return data || [];
}

// CREATE
export async function createProject(formData: FormData) {
    await requireAuth();
    const supabase = createAdmin();
  
    const { error } = await supabase
      .from("projects")
      .insert(parseProjectForm(formData));
  
    if (error) {
      console.error("Create error:", error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  
    // Refresh the pages that show projects
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/projects", "layout");
  
    // Redirect back to admin page
    redirect("/admin");
  }

  // UPDATE
export async function updateProject(id: string, formData: FormData) {
    await requireAuth();
    const supabase = createAdmin();
  
    const { error } = await supabase
      .from("projects")
      .update(parseProjectForm(formData))
      .eq("id", id);
  
    if (error) {
      console.error("Update error:", error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/projects", "layout");
    redirect("/admin");
  }
  
  // GET ONE (needed for edit form)
  export async function getProject(id: string): Promise<Project | null> {
    await requireAuth();
    const supabase = createAdmin();
  
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) {
      console.error("Fetch error:", error);
      return null;
    }
  
    return data;
  }


  // DELETE
export async function deleteProject(id: string) {
    await requireAuth();
    const supabase = createAdmin();
  
    const { error } = await supabase.from("projects").delete().eq("id", id);
  
    if (error) {
      console.error("Delete error:", error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/projects", "layout");
  }


  // TOGGLE HIDDEN
export async function toggleHidden(id: string, currentState: boolean) {
    await requireAuth();
    const supabase = createAdmin();
  
    const { error } = await supabase
      .from("projects")
      .update({ is_hidden: !currentState })
      .eq("id", id);
  
    if (error) {
      console.error("Toggle hidden error:", error);
      throw new Error(`Failed to toggle visibility: ${error.message}`);
    }
  
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/projects", "layout");
  }