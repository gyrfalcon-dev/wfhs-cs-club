import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const contentDir = path.join(root, "content");
const envFile = path.join(root, ".env.local");

if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function readCollection(folder) {
  const directory = path.join(contentDir, folder);
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((fileName) => {
      const filePath = path.join(directory, fileName);
      const slug = path.parse(fileName).name;
      const raw = fs.readFileSync(filePath, "utf8");
      const { content, data } = matter(raw);
      return { body: content.trim(), data, slug };
    });
}

const projectDocs = readCollection("projects");
const eventDocs = readCollection("events");
const groups = projectDocs.filter((doc) => doc.data.projectType === "group");
const childrenByGroupSlug = new Map();

for (const group of groups) {
  for (const childSlug of Array.isArray(group.data.children)
    ? group.data.children
    : []) {
    childrenByGroupSlug.set(String(childSlug), group.slug);
  }
}

for (const project of projectDocs) {
  const parentSlug = childrenByGroupSlug.get(project.slug);
  const payload = {
    body_markdown: project.body,
    cover_image_url:
      typeof project.data.cover === "string" ? project.data.cover : null,
    featured: Boolean(project.data.featured),
    project_type: project.data.projectType === "group" ? "group" : "project",
    published: true,
    slug: project.slug,
    status: ["active", "planning", "archived"].includes(project.data.status)
      ? project.data.status
      : "active",
    summary:
      typeof project.data.summary === "string"
        ? project.data.summary
        : "Coming soon",
    title:
      typeof project.data.title === "string" ? project.data.title : project.slug,
  };

  const { error } = await supabase
    .from("projects")
    .upsert(payload, { onConflict: "slug" });

  if (error) {
    throw new Error(`Project import failed for ${project.slug}: ${error.message}`);
  }

  if (parentSlug) {
    const { data: parent, error: parentError } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", parentSlug)
      .single();

    if (parentError) {
      throw new Error(
        `Could not resolve parent collection ${parentSlug}: ${parentError.message}`,
      );
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({ parent_project_id: parent.id })
      .eq("slug", project.slug);

    if (updateError) {
      throw new Error(
        `Could not assign parent for ${project.slug}: ${updateError.message}`,
      );
    }
  }
}

for (const doc of eventDocs) {
  const kind = doc.data.kind === "devlog" ? "dev_logs" : "events";
  const payload =
    kind === "dev_logs"
      ? {
          body_markdown: doc.body,
          description:
            typeof doc.data.description === "string" ? doc.data.description : "",
          published: true,
          published_at:
            typeof doc.data.date === "string"
              ? doc.data.date
              : new Date().toISOString(),
          slug: doc.slug,
          title: typeof doc.data.title === "string" ? doc.data.title : doc.slug,
        }
      : {
          body_markdown: doc.body,
          description:
            typeof doc.data.description === "string" ? doc.data.description : "",
          event_at:
            typeof doc.data.date === "string"
              ? doc.data.date
              : new Date().toISOString(),
          location:
            typeof doc.data.location === "string" ? doc.data.location : null,
          published: true,
          slug: doc.slug,
          title: typeof doc.data.title === "string" ? doc.data.title : doc.slug,
        };

  const { error } = await supabase.from(kind).upsert(payload, {
    onConflict: "slug",
  });

  if (error) {
    throw new Error(`Import failed for ${doc.slug}: ${error.message}`);
  }
}

console.log(
  `Imported ${projectDocs.length} projects and ${eventDocs.length} events/dev logs.`,
);
