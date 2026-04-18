import { getStaticAdminAllowlist, isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

export type ContentType = "project" | "event" | "devlog";
export type ContentStatus = "draft" | "pending_review" | "published" | "archived";
export type ProjectMetaStatus = "active" | "planning" | "archived";
export type ProjectType = "project" | "group";

export type ContentEntry = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  status: ContentStatus;
  author_name: string;
  author_email: string;
  event_date: string | null;
  location: string | null;
  project_status: ProjectMetaStatus | null;
  project_type: ProjectType | null;
  stack: string[] | null;
  children: string[] | null;
  cover: string | null;
  featured: boolean | null;
  source: "submission" | "admin";
  review_notes: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  deleted_at: string | null;
  deleted_by_user_id: string | null;
  restored_from_version_id: string | null;
};

export type ContentVersion = {
  id: string;
  entry_id: string;
  version_kind: string;
  actor_email: string | null;
  snapshot: ContentEntry;
  created_at: string;
};

export type ContentInput = {
  type: ContentType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  status: ContentStatus;
  authorName: string;
  authorEmail: string;
  eventDate?: string | null;
  location?: string | null;
  projectStatus?: ProjectMetaStatus | null;
  projectType?: ProjectType | null;
  stack?: string[];
  children?: string[];
  cover?: string | null;
  featured?: boolean;
  source?: "submission" | "admin";
  reviewNotes?: string | null;
};

export type DashboardBuckets = {
  pending: ContentEntry[];
  draft: ContentEntry[];
  published: ContentEntry[];
  archived: ContentEntry[];
};

const selectFields =
  "id, type, title, slug, summary, body, status, author_name, author_email, event_date, location, project_status, project_type, stack, children, cover, featured, source, review_notes, created_at, updated_at, published_at, deleted_at, deleted_by_user_id, restored_from_version_id";

const normalizeList = (value?: string[]) =>
  (value ?? []).map((item) => item.trim()).filter(Boolean);

const toRecord = (input: ContentInput) => ({
  type: input.type,
  title: input.title.trim(),
  slug: input.slug.trim(),
  summary: input.summary.trim(),
  body: input.body.trim(),
  status: input.status,
  author_name: input.authorName.trim(),
  author_email: input.authorEmail.trim().toLowerCase(),
  event_date: input.eventDate || null,
  location: input.location?.trim() || null,
  project_status: input.projectStatus || null,
  project_type: input.projectType || null,
  stack: normalizeList(input.stack),
  children: normalizeList(input.children),
  cover: input.cover?.trim() || null,
  featured: Boolean(input.featured),
  source: input.source ?? "submission",
  review_notes: input.reviewNotes?.trim() || null,
  published_at:
    input.status === "published" ? new Date().toISOString() : null,
});

const getClient = () => {
  if (!isSupabaseConfigured) {
    return null;
  }

  return createSupabaseAdminClient();
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const listPublishedEntries = async (type: ContentType) => {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from("content_entries")
    .select(selectFields)
    .eq("type", type)
    .eq("status", "published")
    .is("deleted_at", null);

  if (error) {
    console.error(`Supabase listPublishedEntries(${type}) failed`, error);
    return [];
  }

  return (data ?? []) as ContentEntry[];
};

export const getPublishedEntryBySlug = async (slug: string) => {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from("content_entries")
    .select(selectFields)
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error(`Supabase getPublishedEntryBySlug(${slug}) failed`, error);
    return null;
  }

  return (data as ContentEntry | null) ?? null;
};

export const listDashboardEntries = async (): Promise<DashboardBuckets> => {
  const client = getClient();
  if (!client) {
    return { pending: [], draft: [], published: [], archived: [] };
  }

  const { data, error } = await client
    .from("content_entries")
    .select(selectFields)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const entries = (data ?? []) as ContentEntry[];

  return {
    pending: entries.filter(
      (entry) => entry.status === "pending_review" && !entry.deleted_at,
    ),
    draft: entries.filter(
      (entry) => entry.status === "draft" && !entry.deleted_at,
    ),
    published: entries.filter(
      (entry) => entry.status === "published" && !entry.deleted_at,
    ),
    archived: entries.filter(
      (entry) => entry.status === "archived" || Boolean(entry.deleted_at),
    ),
  };
};

export const getEntryById = async (id: string) => {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from("content_entries")
    .select(selectFields)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as ContentEntry | null) ?? null;
};

export const getEntryVersions = async (entryId: string) => {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from("content_versions")
    .select("id, entry_id, version_kind, actor_email, snapshot, created_at")
    .eq("entry_id", entryId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ContentVersion[];
};

export const createEntry = async (input: ContentInput, actorEmail?: string) => {
  const client = getClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await client
    .from("content_entries")
    .insert(toRecord(input))
    .select(selectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await saveVersionSnapshot(data.id, "created", data as ContentEntry, actorEmail);

  return data as ContentEntry;
};

export const updateEntry = async (
  id: string,
  input: Partial<ContentInput>,
  actorEmail?: string,
) => {
  const client = getClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  const current = await getEntryById(id);
  if (!current) {
    throw new Error("Content entry not found.");
  }

  await saveVersionSnapshot(id, "updated", current, actorEmail);

  const patch: Record<string, unknown> = {};

  if (input.type) patch.type = input.type;
  if (typeof input.title === "string") patch.title = input.title.trim();
  if (typeof input.slug === "string") patch.slug = input.slug.trim();
  if (typeof input.summary === "string") patch.summary = input.summary.trim();
  if (typeof input.body === "string") patch.body = input.body.trim();
  if (input.status) patch.status = input.status;
  if (typeof input.authorName === "string") patch.author_name = input.authorName.trim();
  if (typeof input.authorEmail === "string") {
    patch.author_email = input.authorEmail.trim().toLowerCase();
  }
  if ("eventDate" in input) patch.event_date = input.eventDate || null;
  if ("location" in input) patch.location = input.location?.trim() || null;
  if ("projectStatus" in input) patch.project_status = input.projectStatus || null;
  if ("projectType" in input) patch.project_type = input.projectType || null;
  if ("stack" in input) patch.stack = normalizeList(input.stack);
  if ("children" in input) patch.children = normalizeList(input.children);
  if ("cover" in input) patch.cover = input.cover?.trim() || null;
  if ("featured" in input) patch.featured = Boolean(input.featured);
  if ("source" in input && input.source) patch.source = input.source;
  if ("reviewNotes" in input) patch.review_notes = input.reviewNotes?.trim() || null;
  if (input.status === "published") {
    patch.published_at = new Date().toISOString();
    patch.deleted_at = null;
  }
  if (input.status === "archived") {
    patch.deleted_at = null;
  }

  const { data, error } = await client
    .from("content_entries")
    .update(patch)
    .eq("id", id)
    .select(selectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ContentEntry;
};

export const softDeleteEntry = async (id: string, actorEmail?: string) => {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");

  const current = await getEntryById(id);
  if (!current) {
    throw new Error("Content entry not found.");
  }

  await saveVersionSnapshot(id, "deleted", current, actorEmail);

  const { data, error } = await client
    .from("content_entries")
    .update({
      status: "archived",
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(selectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ContentEntry;
};

export const restoreEntryVersion = async (
  entryId: string,
  versionId: string,
  actorEmail?: string,
) => {
  const client = getClient();
  if (!client) throw new Error("Supabase is not configured.");

  const current = await getEntryById(entryId);
  if (current) {
    await saveVersionSnapshot(entryId, "restored_from", current, actorEmail);
  }

  const { data: version, error: versionError } = await client
    .from("content_versions")
    .select("snapshot")
    .eq("id", versionId)
    .eq("entry_id", entryId)
    .single();

  if (versionError) {
    throw new Error(versionError.message);
  }

  const snapshot = version.snapshot as ContentEntry;

  const { data, error } = await client
    .from("content_entries")
    .update({
      type: snapshot.type,
      title: snapshot.title,
      slug: snapshot.slug,
      summary: snapshot.summary,
      body: snapshot.body,
      status: snapshot.status,
      author_name: snapshot.author_name,
      author_email: snapshot.author_email,
      event_date: snapshot.event_date,
      location: snapshot.location,
      project_status: snapshot.project_status,
      project_type: snapshot.project_type,
      stack: snapshot.stack ?? [],
      children: snapshot.children ?? [],
      cover: snapshot.cover,
      featured: Boolean(snapshot.featured),
      source: snapshot.source,
      review_notes: snapshot.review_notes,
      published_at: snapshot.published_at,
      restored_from_version_id: versionId,
      deleted_at: null,
    })
    .eq("id", entryId)
    .select(selectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ContentEntry;
};

export const isAdminEmailAllowed = async (email: string) => {
  const normalized = email.trim().toLowerCase();

  if (getStaticAdminAllowlist().includes(normalized)) {
    return true;
  }

  const client = getClient();
  if (!client) return false;

  const { data, error } = await client
    .from("admin_allowlist")
    .select("email")
    .eq("email", normalized)
    .maybeSingle();

  if (error) {
    console.error("Supabase isAdminEmailAllowed failed", error);
    return false;
  }

  return Boolean(data);
};

const saveVersionSnapshot = async (
  entryId: string,
  versionKind: string,
  snapshot: ContentEntry,
  actorEmail?: string,
) => {
  const client = getClient();
  if (!client) return;

  const { error } = await client.from("content_versions").insert({
    entry_id: entryId,
    version_kind: versionKind,
    actor_email: actorEmail?.trim().toLowerCase() || null,
    snapshot,
  });

  if (error) {
    console.error("Supabase saveVersionSnapshot failed", error);
  }
};
