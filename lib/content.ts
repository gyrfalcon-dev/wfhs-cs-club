import "server-only";

import { PostgrestError } from "@supabase/supabase-js";
import { cache } from "react";
import {
  formatSupabaseSetupError,
  getContentTableNames,
  getJoinTable,
  getServiceSupabase,
} from "@/lib/supabase";

export type ProjectStatus = "active" | "planning" | "archived";
export type ProjectType = "project" | "group";

export type Project = {
  bodyMarkdown: string;
  childCount?: number;
  coverImageUrl?: string | null;
  createdAt: string;
  featured: boolean;
  id: number;
  parentProjectId?: number | null;
  projectType: ProjectType;
  published: boolean;
  slug: string;
  status: ProjectStatus;
  summary: string;
  title: string;
  updatedAt: string;
};

export type Event = {
  bodyMarkdown: string;
  coverImageUrl?: string | null;
  createdAt: string;
  description: string;
  eventAt: string;
  id: number;
  location?: string | null;
  published: boolean;
  slug: string;
  title: string;
  updatedAt: string;
};

export type DevLog = {
  bodyMarkdown: string;
  coverImageUrl?: string | null;
  createdAt: string;
  description: string;
  id: number;
  published: boolean;
  publishedAt: string;
  slug: string;
  title: string;
  updatedAt: string;
};

export type JoinSubmissionRecord = {
  createdAt?: string | null;
  email: string;
  experience: string;
  grade: string;
  id: number;
  message?: string | null;
  name: string;
};

export type ProjectInput = {
  bodyMarkdown: string;
  coverImageUrl?: string | null;
  featured: boolean;
  parentProjectId?: number | null;
  projectType: ProjectType;
  published: boolean;
  slug: string;
  status: ProjectStatus;
  summary: string;
  title: string;
};

export type EventInput = {
  bodyMarkdown: string;
  coverImageUrl?: string | null;
  description: string;
  eventAt: string;
  location?: string | null;
  published: boolean;
  slug: string;
  title: string;
};

export type DevLogInput = {
  bodyMarkdown: string;
  coverImageUrl?: string | null;
  description: string;
  published: boolean;
  publishedAt: string;
  slug: string;
  title: string;
};

type ProjectRow = {
  body_markdown: string | null;
  cover_image_url: string | null;
  created_at: string;
  featured: boolean | null;
  id: number;
  parent_project_id: number | null;
  project_type: ProjectType | null;
  published: boolean | null;
  slug: string;
  status: ProjectStatus | null;
  summary: string;
  title: string;
  updated_at: string;
};

type EventRow = {
  body_markdown: string | null;
  cover_image_url: string | null;
  created_at: string;
  description: string;
  event_at: string;
  id: number;
  location: string | null;
  published: boolean | null;
  slug: string;
  title: string;
  updated_at: string;
};

type DevLogRow = {
  body_markdown: string | null;
  cover_image_url: string | null;
  created_at: string;
  description: string;
  id: number;
  published: boolean | null;
  published_at: string;
  slug: string;
  title: string;
  updated_at: string;
};

type JoinSubmissionRow = {
  created_at: string | null;
  email: string;
  experience: string;
  grade: string;
  id: number;
  message: string | null;
  name: string;
};

function logPublicQueryError(context: string, error: PostgrestError | Error) {
  console.error(`Supabase content query failed in ${context}`, error);
}

function createContentError(resource: string, error: PostgrestError) {
  return new Error(formatSupabaseSetupError(resource, error.message));
}

function mapProject(row: ProjectRow): Project {
  return {
    bodyMarkdown: row.body_markdown ?? "",
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
    featured: Boolean(row.featured),
    id: row.id,
    parentProjectId: row.parent_project_id,
    projectType: row.project_type ?? "project",
    published: row.published ?? true,
    slug: row.slug,
    status: row.status ?? "active",
    summary: row.summary,
    title: row.title,
    updatedAt: row.updated_at,
  };
}

function mapEvent(row: EventRow): Event {
  return {
    bodyMarkdown: row.body_markdown ?? "",
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
    description: row.description,
    eventAt: row.event_at,
    id: row.id,
    location: row.location,
    published: row.published ?? true,
    slug: row.slug,
    title: row.title,
    updatedAt: row.updated_at,
  };
}

function mapDevLog(row: DevLogRow): DevLog {
  return {
    bodyMarkdown: row.body_markdown ?? "",
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
    description: row.description,
    id: row.id,
    published: row.published ?? true,
    publishedAt: row.published_at,
    slug: row.slug,
    title: row.title,
    updatedAt: row.updated_at,
  };
}

function mapJoinSubmission(row: JoinSubmissionRow): JoinSubmissionRecord {
  return {
    createdAt: row.created_at,
    email: row.email,
    experience: row.experience,
    grade: row.grade,
    id: row.id,
    message: row.message,
    name: row.name,
  };
}

function addProjectChildCounts(projects: Project[]): Project[] {
  const childCounts = new Map<number, number>();

  for (const project of projects) {
    if (project.parentProjectId) {
      childCounts.set(
        project.parentProjectId,
        (childCounts.get(project.parentProjectId) ?? 0) + 1,
      );
    }
  }

  return projects.map((project) => ({
    ...project,
    childCount: childCounts.get(project.id) ?? 0,
  }));
}

const fetchPublishedProjects = cache(async (): Promise<Project[]> => {
  const supabase = getServiceSupabase();
  const { projects } = getContentTableNames();
  const { data, error } = await supabase
    .from(projects)
    .select(
      "id, slug, title, summary, status, project_type, featured, cover_image_url, body_markdown, parent_project_id, published, created_at, updated_at",
    )
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("title", { ascending: true });

  if (error) {
    logPublicQueryError(
      "fetchPublishedProjects",
      createContentError(projects, error),
    );
    return [];
  }

  return addProjectChildCounts((data satisfies ProjectRow[]).map(mapProject));
});

const fetchFeaturedProjects = cache(async (): Promise<Project[]> => {
  const supabase = getServiceSupabase();
  const { projects } = getContentTableNames();
  const { data, error } = await supabase
    .from(projects)
    .select(
      "id, slug, title, summary, status, project_type, featured, cover_image_url, body_markdown, parent_project_id, published, created_at, updated_at",
    )
    .eq("published", true)
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(3);

  if (error) {
    logPublicQueryError(
      "fetchFeaturedProjects",
      createContentError(projects, error),
    );
    return [];
  }

  return (data satisfies ProjectRow[]).map(mapProject);
});

const fetchUpcomingEvents = cache(
  async (limit?: number): Promise<Event[]> => {
    const supabase = getServiceSupabase();
    const { events } = getContentTableNames();
    let query = supabase
      .from(events)
      .select(
        "id, slug, title, description, event_at, location, cover_image_url, body_markdown, published, created_at, updated_at",
      )
      .eq("published", true)
      .gte("event_at", new Date().toISOString())
      .order("event_at", { ascending: true });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      logPublicQueryError(
        "fetchUpcomingEvents",
        createContentError(events, error),
      );
      return [];
    }

    return (data satisfies EventRow[]).map(mapEvent);
  },
);

const fetchPublishedDevLogs = cache(
  async (limit?: number): Promise<DevLog[]> => {
    const supabase = getServiceSupabase();
    const { devLogs } = getContentTableNames();
    let query = supabase
      .from(devLogs)
      .select(
        "id, slug, title, description, published_at, cover_image_url, body_markdown, published, created_at, updated_at",
      )
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      logPublicQueryError(
        "fetchPublishedDevLogs",
        createContentError(devLogs, error),
      );
      return [];
    }

    return (data satisfies DevLogRow[]).map(mapDevLog);
  },
);

const fetchProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const supabase = getServiceSupabase();
  const { projects } = getContentTableNames();
  const { data, error } = await supabase
    .from(projects)
    .select(
      "id, slug, title, summary, status, project_type, featured, cover_image_url, body_markdown, parent_project_id, published, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    logPublicQueryError(
      `getProjectBySlug:${slug}`,
      createContentError(projects, error),
    );
    return null;
  }

  return data ? mapProject(data satisfies ProjectRow) : null;
});

const fetchProjectChildren = cache(
  async (projectId: number): Promise<Project[]> => {
    const supabase = getServiceSupabase();
    const { projects } = getContentTableNames();
    const { data, error } = await supabase
      .from(projects)
      .select(
        "id, slug, title, summary, status, project_type, featured, cover_image_url, body_markdown, parent_project_id, published, created_at, updated_at",
      )
      .eq("published", true)
      .eq("parent_project_id", projectId)
      .order("title", { ascending: true });

    if (error) {
      logPublicQueryError(
        `getProjectChildren:${projectId}`,
        createContentError(projects, error),
      );
      return [];
    }

    return (data satisfies ProjectRow[]).map(mapProject);
  },
);

const fetchEventBySlug = cache(async (slug: string): Promise<Event | null> => {
  const supabase = getServiceSupabase();
  const { events } = getContentTableNames();
  const { data, error } = await supabase
    .from(events)
    .select(
      "id, slug, title, description, event_at, location, cover_image_url, body_markdown, published, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    logPublicQueryError(
      `getEventBySlug:${slug}`,
      createContentError(events, error),
    );
    return null;
  }

  return data ? mapEvent(data satisfies EventRow) : null;
});

const fetchDevLogBySlug = cache(async (slug: string): Promise<DevLog | null> => {
  const supabase = getServiceSupabase();
  const { devLogs } = getContentTableNames();
  const { data, error } = await supabase
    .from(devLogs)
    .select(
      "id, slug, title, description, published_at, cover_image_url, body_markdown, published, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    logPublicQueryError(
      `getDevLogBySlug:${slug}`,
      createContentError(devLogs, error),
    );
    return null;
  }

  return data ? mapDevLog(data satisfies DevLogRow) : null;
});

export async function getFeaturedProjects(): Promise<Project[]> {
  return fetchFeaturedProjects();
}

export async function getAllProjects(): Promise<Project[]> {
  const projects = await fetchPublishedProjects();
  return projects.filter((project) => !project.parentProjectId);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return fetchProjectBySlug(slug);
}

export async function getProjectChildren(projectId: number): Promise<Project[]> {
  return fetchProjectChildren(projectId);
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  return fetchUpcomingEvents(limit);
}

export async function getDevLogs(limit?: number): Promise<DevLog[]> {
  return fetchPublishedDevLogs(limit);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return fetchEventBySlug(slug);
}

export async function getDevLogBySlug(slug: string): Promise<DevLog | null> {
  return fetchDevLogBySlug(slug);
}

export async function getAdminProjects(): Promise<Project[]> {
  const supabase = getServiceSupabase();
  const { projects } = getContentTableNames();
  const { data, error } = await supabase
    .from(projects)
    .select(
      "id, slug, title, summary, status, project_type, featured, cover_image_url, body_markdown, parent_project_id, published, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw createContentError(projects, error);
  }

  return (data satisfies ProjectRow[]).map(mapProject);
}

export async function getAdminProjectById(id: number): Promise<Project | null> {
  const supabase = getServiceSupabase();
  const { projects } = getContentTableNames();
  const { data, error } = await supabase
    .from(projects)
    .select(
      "id, slug, title, summary, status, project_type, featured, cover_image_url, body_markdown, parent_project_id, published, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw createContentError(projects, error);
  }

  return data ? mapProject(data satisfies ProjectRow) : null;
}

export async function getAdminEvents(): Promise<Event[]> {
  const supabase = getServiceSupabase();
  const { events } = getContentTableNames();
  const { data, error } = await supabase
    .from(events)
    .select(
      "id, slug, title, description, event_at, location, cover_image_url, body_markdown, published, created_at, updated_at",
    )
    .order("event_at", { ascending: false });

  if (error) {
    throw createContentError(events, error);
  }

  return (data satisfies EventRow[]).map(mapEvent);
}

export async function getAdminEventById(id: number): Promise<Event | null> {
  const supabase = getServiceSupabase();
  const { events } = getContentTableNames();
  const { data, error } = await supabase
    .from(events)
    .select(
      "id, slug, title, description, event_at, location, cover_image_url, body_markdown, published, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw createContentError(events, error);
  }

  return data ? mapEvent(data satisfies EventRow) : null;
}

export async function getAdminDevLogs(): Promise<DevLog[]> {
  const supabase = getServiceSupabase();
  const { devLogs } = getContentTableNames();
  const { data, error } = await supabase
    .from(devLogs)
    .select(
      "id, slug, title, description, published_at, cover_image_url, body_markdown, published, created_at, updated_at",
    )
    .order("published_at", { ascending: false });

  if (error) {
    throw createContentError(devLogs, error);
  }

  return (data satisfies DevLogRow[]).map(mapDevLog);
}

export async function getAdminDevLogById(id: number): Promise<DevLog | null> {
  const supabase = getServiceSupabase();
  const { devLogs } = getContentTableNames();
  const { data, error } = await supabase
    .from(devLogs)
    .select(
      "id, slug, title, description, published_at, cover_image_url, body_markdown, published, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw createContentError(devLogs, error);
  }

  return data ? mapDevLog(data satisfies DevLogRow) : null;
}

export async function getJoinSubmissions(): Promise<JoinSubmissionRecord[]> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from(getJoinTable())
    .select("id, name, email, grade, experience, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw createContentError(getJoinTable(), error);
  }

  return (data satisfies JoinSubmissionRow[]).map(mapJoinSubmission);
}

export async function getAdminSummary(): Promise<{
  devLogs: number;
  events: number;
  projects: number;
  submissions: number;
}> {
  const [projects, events, devLogs, submissions] = await Promise.all([
    getAdminProjects(),
    getAdminEvents(),
    getAdminDevLogs(),
    getJoinSubmissions(),
  ]);

  return {
    devLogs: devLogs.length,
    events: events.length,
    projects: projects.length,
    submissions: submissions.length,
  };
}

export async function saveProject(
  id: number | null,
  input: ProjectInput,
): Promise<Project> {
  const supabase = getServiceSupabase();
  const { projects } = getContentTableNames();
  const payload = {
    body_markdown: input.bodyMarkdown,
    cover_image_url: input.coverImageUrl ?? null,
    featured: input.featured,
    parent_project_id: input.parentProjectId ?? null,
    project_type: input.projectType,
    published: input.published,
    slug: input.slug,
    status: input.status,
    summary: input.summary,
    title: input.title,
  };

  const builder = id
    ? supabase.from(projects).update(payload).eq("id", id)
    : supabase.from(projects).insert(payload);
  const { data, error } = await builder
    .select(
      "id, slug, title, summary, status, project_type, featured, cover_image_url, body_markdown, parent_project_id, published, created_at, updated_at",
    )
    .single();

  if (error) {
    throw createContentError(projects, error);
  }

  return mapProject(data satisfies ProjectRow);
}

export async function deleteProject(id: number) {
  const supabase = getServiceSupabase();
  const { projects } = getContentTableNames();
  const { error } = await supabase.from(projects).delete().eq("id", id);

  if (error) {
    throw createContentError(projects, error);
  }
}

export async function saveEvent(
  id: number | null,
  input: EventInput,
): Promise<Event> {
  const supabase = getServiceSupabase();
  const { events } = getContentTableNames();
  const payload = {
    body_markdown: input.bodyMarkdown,
    cover_image_url: input.coverImageUrl ?? null,
    description: input.description,
    event_at: input.eventAt,
    location: input.location ?? null,
    published: input.published,
    slug: input.slug,
    title: input.title,
  };

  const builder = id
    ? supabase.from(events).update(payload).eq("id", id)
    : supabase.from(events).insert(payload);
  const { data, error } = await builder
    .select(
      "id, slug, title, description, event_at, location, cover_image_url, body_markdown, published, created_at, updated_at",
    )
    .single();

  if (error) {
    throw createContentError(events, error);
  }

  return mapEvent(data satisfies EventRow);
}

export async function deleteEvent(id: number) {
  const supabase = getServiceSupabase();
  const { events } = getContentTableNames();
  const { error } = await supabase.from(events).delete().eq("id", id);

  if (error) {
    throw createContentError(events, error);
  }
}

export async function saveDevLog(
  id: number | null,
  input: DevLogInput,
): Promise<DevLog> {
  const supabase = getServiceSupabase();
  const { devLogs } = getContentTableNames();
  const payload = {
    body_markdown: input.bodyMarkdown,
    cover_image_url: input.coverImageUrl ?? null,
    description: input.description,
    published: input.published,
    published_at: input.publishedAt,
    slug: input.slug,
    title: input.title,
  };

  const builder = id
    ? supabase.from(devLogs).update(payload).eq("id", id)
    : supabase.from(devLogs).insert(payload);
  const { data, error } = await builder
    .select(
      "id, slug, title, description, published_at, cover_image_url, body_markdown, published, created_at, updated_at",
    )
    .single();

  if (error) {
    throw createContentError(devLogs, error);
  }

  return mapDevLog(data satisfies DevLogRow);
}

export async function deleteDevLog(id: number) {
  const supabase = getServiceSupabase();
  const { devLogs } = getContentTableNames();
  const { error } = await supabase.from(devLogs).delete().eq("id", id);

  if (error) {
    throw createContentError(devLogs, error);
  }
}
