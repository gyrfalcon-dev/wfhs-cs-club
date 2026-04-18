import { z } from "zod";
import { ContentType, slugify } from "@/lib/content-store";

const baseSubmissionSchema = z.object({
  type: z.enum(["project", "event", "devlog"]),
  title: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(8).max(280),
  body: z.string().trim().max(6000).optional().default(""),
  authorName: z.string().trim().min(2).max(80),
  authorEmail: z.email().trim().max(120),
  slug: z.string().trim().max(80).optional().default(""),
  location: z.string().trim().max(120).optional().default(""),
  eventDate: z.string().trim().optional().default(""),
  projectStatus: z.enum(["active", "planning", "archived"]).optional(),
  projectType: z.enum(["project", "group"]).optional(),
  stack: z.string().trim().max(300).optional().default(""),
  children: z.string().trim().max(400).optional().default(""),
  cover: z.string().trim().max(600).optional().default(""),
  featured: z.boolean().optional().default(false),
  honey: z.string().optional().default(""),
});

export type SubmissionValues = z.infer<typeof baseSubmissionSchema>;

export const parseSubmissionForm = (formData: FormData) => {
  const raw = {
    type: String(formData.get("type") || ""),
    title: String(formData.get("title") || ""),
    summary: String(formData.get("summary") || ""),
    body: String(formData.get("body") || ""),
    authorName: String(formData.get("authorName") || ""),
    authorEmail: String(formData.get("authorEmail") || ""),
    slug: String(formData.get("slug") || ""),
    location: String(formData.get("location") || ""),
    eventDate: String(formData.get("eventDate") || ""),
    projectStatus: String(formData.get("projectStatus") || "") || undefined,
    projectType: String(formData.get("projectType") || "") || undefined,
    stack: String(formData.get("stack") || ""),
    children: String(formData.get("children") || ""),
    cover: String(formData.get("cover") || ""),
    featured: String(formData.get("featured") || "") === "on",
    honey: String(formData.get("clubWebsite") || ""),
  };

  const parsed = baseSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error:
        parsed.error.issues[0]?.message ||
        "Please check the form fields and try again.",
    };
  }

  const values = parsed.data;
  const slug = values.slug || slugify(values.title);

  return {
    ok: true as const,
    values: {
      ...values,
      slug,
      stack: splitCsvList(values.stack),
      children: splitCsvList(values.children),
    },
  };
};

export const getSubmitPageCopy = (type: ContentType) => {
  if (type === "project") {
    return {
      title: "Submit a Project",
      subtitle:
        "Send in what you built, what it does, and where the club can take it next.",
    };
  }

  if (type === "event") {
    return {
      title: "Suggest an Event",
      subtitle:
        "Pitch a workshop, build night, guest speaker, or anything else worth getting on the calendar.",
    };
  }

  return {
    title: "Submit a Devlog",
    subtitle:
      "Drop a short progress update so the site reflects what members are actually building.",
  };
};

const splitCsvList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
