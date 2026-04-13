"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteDevLog,
  deleteEvent,
  deleteProject,
  saveDevLog,
  saveEvent,
  saveProject,
} from "@/lib/content";
import {
  createSupabaseServerAuthClient,
  getAdminEmails,
  isAdminEmail,
  requireAdminUser,
} from "@/lib/supabase-auth";
import { uploadContentAsset } from "@/lib/supabase";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNullableString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getNumberOrNull(formData: FormData, key: string) {
  const value = getString(formData, key);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toIsoDateTime(value: string) {
  if (!value) {
    return value;
  }

  return new Date(value).toISOString();
}

function buildErrorRedirect(path: string, message: string) {
  const search = new URLSearchParams({ error: message });
  return `${path}?${search.toString()}`;
}

function revalidateSharedPaths() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/terminal");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/events");
  revalidatePath("/admin/devlogs");
  revalidatePath("/admin/submissions");
}

export async function loginAdmin(formData: FormData) {
  if (getAdminEmails().length === 0) {
    redirect(
      buildErrorRedirect(
        "/admin/login",
        "Set ADMIN_EMAILS in your environment before signing in.",
      ),
    );
  }

  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const supabase = await createSupabaseServerAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildErrorRedirect("/admin/login", error.message));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    await supabase.auth.signOut();
    redirect(
      buildErrorRedirect(
        "/admin/login",
        "This account is not on the admin allowlist.",
      ),
    );
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createSupabaseServerAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function uploadEditorImage(formData: FormData) {
  await requireAdminUser();
  const redirectTo = getString(formData, "redirectTo") || "/admin";
  const file = getFile(formData, "image");

  if (!file) {
    redirect(buildErrorRedirect(redirectTo, "Choose an image to upload."));
  }

  const url = await uploadContentAsset(file, "editor");
  const params = new URLSearchParams();
  if (url) {
    params.set("uploaded", url);
  }

  redirect(params.size > 0 ? `${redirectTo}?${params.toString()}` : redirectTo);
}

export async function saveProjectAction(formData: FormData) {
  await requireAdminUser();

  const id = getNumberOrNull(formData, "id");
  const previousSlug = getString(formData, "previousSlug");
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const file = getFile(formData, "coverImage");
  const existingCoverImageUrl = getNullableString(formData, "existingCoverImageUrl");
  const coverImageUrl = file
    ? await uploadContentAsset(file, "covers")
    : existingCoverImageUrl;

  const saved = await saveProject(id, {
    bodyMarkdown: getString(formData, "bodyMarkdown"),
    coverImageUrl,
    featured: getBoolean(formData, "featured"),
    parentProjectId: getNumberOrNull(formData, "parentProjectId"),
    projectType:
      getString(formData, "projectType") === "group" ? "group" : "project",
    published: getBoolean(formData, "published"),
    slug,
    status:
      getString(formData, "status") === "planning"
        ? "planning"
        : getString(formData, "status") === "archived"
          ? "archived"
          : "active",
    summary: getString(formData, "summary"),
    title,
  });

  revalidateSharedPaths();
  revalidatePath(`/projects/${saved.slug}`);
  if (previousSlug && previousSlug !== saved.slug) {
    revalidatePath(`/projects/${previousSlug}`);
  }

  redirect(`/admin/projects/${saved.id}?saved=1`);
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdminUser();
  const id = getNumberOrNull(formData, "id");
  const slug = getString(formData, "slug");

  if (!id) {
    redirect(buildErrorRedirect("/admin/projects", "Missing project id."));
  }

  await deleteProject(id);
  revalidateSharedPaths();
  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }
  redirect("/admin/projects");
}

export async function saveEventAction(formData: FormData) {
  await requireAdminUser();

  const id = getNumberOrNull(formData, "id");
  const previousSlug = getString(formData, "previousSlug");
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const file = getFile(formData, "coverImage");
  const existingCoverImageUrl = getNullableString(formData, "existingCoverImageUrl");
  const coverImageUrl = file
    ? await uploadContentAsset(file, "covers")
    : existingCoverImageUrl;

  const saved = await saveEvent(id, {
    bodyMarkdown: getString(formData, "bodyMarkdown"),
    coverImageUrl,
    description: getString(formData, "description"),
    eventAt: toIsoDateTime(getString(formData, "eventAt")),
    location: getNullableString(formData, "location"),
    published: getBoolean(formData, "published"),
    slug,
    title,
  });

  revalidateSharedPaths();
  revalidatePath(`/events/${saved.slug}`);
  if (previousSlug && previousSlug !== saved.slug) {
    revalidatePath(`/events/${previousSlug}`);
  }

  redirect(`/admin/events/${saved.id}?saved=1`);
}

export async function deleteEventAction(formData: FormData) {
  await requireAdminUser();
  const id = getNumberOrNull(formData, "id");
  const slug = getString(formData, "slug");

  if (!id) {
    redirect(buildErrorRedirect("/admin/events", "Missing event id."));
  }

  await deleteEvent(id);
  revalidateSharedPaths();
  if (slug) {
    revalidatePath(`/events/${slug}`);
  }
  redirect("/admin/events");
}

export async function saveDevLogAction(formData: FormData) {
  await requireAdminUser();

  const id = getNumberOrNull(formData, "id");
  const previousSlug = getString(formData, "previousSlug");
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const file = getFile(formData, "coverImage");
  const existingCoverImageUrl = getNullableString(formData, "existingCoverImageUrl");
  const coverImageUrl = file
    ? await uploadContentAsset(file, "covers")
    : existingCoverImageUrl;

  const saved = await saveDevLog(id, {
    bodyMarkdown: getString(formData, "bodyMarkdown"),
    coverImageUrl,
    description: getString(formData, "description"),
    published: getBoolean(formData, "published"),
    publishedAt: toIsoDateTime(getString(formData, "publishedAt")),
    slug,
    title,
  });

  revalidateSharedPaths();
  revalidatePath(`/devlogs/${saved.slug}`);
  if (previousSlug && previousSlug !== saved.slug) {
    revalidatePath(`/devlogs/${previousSlug}`);
  }

  redirect(`/admin/devlogs/${saved.id}?saved=1`);
}

export async function deleteDevLogAction(formData: FormData) {
  await requireAdminUser();
  const id = getNumberOrNull(formData, "id");
  const slug = getString(formData, "slug");

  if (!id) {
    redirect(buildErrorRedirect("/admin/devlogs", "Missing dev log id."));
  }

  await deleteDevLog(id);
  revalidateSharedPaths();
  if (slug) {
    revalidatePath(`/devlogs/${slug}`);
  }
  redirect("/admin/devlogs");
}
