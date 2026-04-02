import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");

type ProjectMeta = {
  title: string;
  summary: string;
  status?: "active" | "planning" | "archived";
  projectType?: "project" | "group";
  stack?: string[];
  children?: string[];
  cover?: string;
  featured?: boolean;
};

type EventMeta = {
  title: string;
  date: string;
  description: string;
  kind?: "event" | "devlog";
  location?: string;
};

type Project = ProjectMeta & {
  slug: string;
  body: string;
};

type Event = EventMeta & {
  slug: string;
  body: string;
};

const projectCache: Project[] = [];
const eventCache: Event[] = [];
let projectLoaded = false;
let eventLoaded = false;

const getFiles = (subdir: string) => {
  const directory = path.join(contentRoot, subdir);
  if (!fs.existsSync(directory)) {
    return [];
  }
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(directory, file));
};

const parseProject = (filePath: string): Project => {
  const content = fs.readFileSync(filePath, "utf-8");
  const { data, content: body } = matter(content);
  const meta = data as ProjectMeta;
  const slug = path.parse(filePath).name;

  return {
    slug,
    title: meta.title ?? "Untitled",
    summary: meta.summary ?? "Coming soon",
    status: meta.status ?? "active",
    projectType: meta.projectType ?? "project",
    stack: Array.isArray(meta.stack) ? meta.stack.map(String) : [],
    children: Array.isArray(meta.children) ? meta.children.map(String) : [],
    cover: typeof meta.cover === "string" ? meta.cover : undefined,
    featured: Boolean(meta.featured),
    body: body.trim(),
  };
};

const parseEvent = (filePath: string): Event => {
  const content = fs.readFileSync(filePath, "utf-8");
  const { data, content: body } = matter(content);
  const meta = data as EventMeta;
  const slug = path.parse(filePath).name;

  return {
    slug,
    title: meta.title ?? "Untitled",
    date: meta.date ?? new Date().toISOString(),
    description: meta.description ?? "",
    kind: meta.kind ?? "event",
    location: meta.location,
    body: body.trim(),
  };
};

const loadProjects = () => {
  if (projectLoaded) {
    return projectCache;
  }
  projectCache.length = 0;
  getFiles("projects").forEach((file) => {
    projectCache.push(parseProject(file));
  });
  projectLoaded = true;
  return projectCache;
};

const loadEvents = () => {
  if (eventLoaded) {
    return eventCache;
  }
  eventCache.length = 0;
  getFiles("events").forEach((file) => {
    eventCache.push(parseEvent(file));
  });
  eventLoaded = true;
  return eventCache;
};

const sortByTitle = (a: Project, b: Project) => a.title.localeCompare(b.title);

const projectIndexEntries = () => {
  const projects = loadProjects();
  const childSlugs = new Set(projects.flatMap((project) => project.children ?? []));
  return projects
    .filter((project) => !childSlugs.has(project.slug))
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return sortByTitle(a, b);
    });
};

const toTimestamp = (value: string | Date) => new Date(value).getTime();

const eventsByKind = (kind: "event" | "devlog") => {
  return loadEvents()
    .filter((event) => event.kind === kind)
    .sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date));
};

export const getFeaturedProjects = () => projectIndexEntries().filter((project) => project.featured).slice(0, 3);

export const getProjectBySlug = (slug: string) =>
  loadProjects().find((project) => project.slug === slug);

export const getProjectChildren = (project: Project) => {
  if (!project.children || project.children.length === 0) {
    return [];
  }
  return project.children
    .map((slug) => loadProjects().find((entry) => entry.slug === slug))
    .filter((child): child is Project => Boolean(child));
};

export const getAllProjects = () => projectIndexEntries();

export const getUpcomingEvents = () => eventsByKind("event");

export const getDevLogs = () => eventsByKind("devlog");

export const getNextEvent = () => getUpcomingEvents()[0];
