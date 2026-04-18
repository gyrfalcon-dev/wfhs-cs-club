import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { createEntry } from "@/lib/content-store";
import { parseSubmissionForm } from "@/lib/forms";

export async function POST(request: Request) {
  const admin = await getAdminIdentity();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const formData = await request.formData();
  const parsed = parseSubmissionForm(formData);
  const intent = String(formData.get("intent") || "save");

  if (!parsed.ok) {
    return NextResponse.redirect(
      new URL(`/admin?state=${encodeURIComponent(parsed.error)}`, request.url),
    );
  }

  const entry = await createEntry(
    {
      type: parsed.values.type,
      title: parsed.values.title,
      slug: parsed.values.slug,
      summary: parsed.values.summary,
      body: parsed.values.body,
      status: intent === "publish" ? "published" : "draft",
      authorName: parsed.values.authorName,
      authorEmail: parsed.values.authorEmail,
      eventDate: parsed.values.eventDate || null,
      location: parsed.values.location || null,
      projectStatus:
        parsed.values.type === "project"
          ? parsed.values.projectStatus || "active"
          : null,
      projectType:
        parsed.values.type === "project"
          ? parsed.values.projectType || "project"
          : null,
      stack: parsed.values.type === "project" ? parsed.values.stack : [],
      children: parsed.values.type === "project" ? parsed.values.children : [],
      cover: parsed.values.type === "project" ? parsed.values.cover || null : null,
      featured: parsed.values.type === "project" ? parsed.values.featured : false,
      reviewNotes: String(formData.get("reviewNotes") || ""),
      source: "admin",
    },
    admin.email,
  );

  return NextResponse.redirect(new URL(`/admin/entries/${entry.id}`, request.url));
}
