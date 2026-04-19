import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { parseSubmissionForm } from "@/lib/forms";
import { setRedirectToast } from "@/lib/redirect-toast";
import { softDeleteEntry, updateEntry } from "@/lib/content-store";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const { id } = await params;
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "save");
  const hasEditorFields = formData.has("title");

  if (intent === "delete") {
    await softDeleteEntry(id, admin.email);
    return NextResponse.redirect(
      setRedirectToast(new URL("/admin", request.url), "success", "Entry archived.", "entry-editor"),
    );
  }

  if (!hasEditorFields && (intent === "publish" || intent === "unpublish" || intent === "archive")) {
    const status =
      intent === "publish"
        ? "published"
        : intent === "unpublish"
          ? "draft"
          : "archived";
    await updateEntry(
      id,
      {
        status,
      },
      admin.email,
    );
    const message =
      intent === "publish"
        ? "Entry published."
        : intent === "unpublish"
          ? "Entry moved back to drafts."
          : "Entry archived.";
    return NextResponse.redirect(
      setRedirectToast(new URL(`/admin/entries/${id}`, request.url), "success", message, "entry-editor"),
    );
  }

  const parsed = parseSubmissionForm(formData);
  if (!parsed.ok) {
    return NextResponse.redirect(
      setRedirectToast(
        new URL(`/admin/entries/${id}`, request.url),
        "error",
        parsed.error,
        "entry-editor",
      ),
    );
  }

  await updateEntry(
    id,
    {
      type: parsed.values.type,
      title: parsed.values.title,
      slug: parsed.values.slug,
      summary: parsed.values.summary,
      body: parsed.values.body,
      status:
        intent === "publish"
          ? "published"
          : intent === "archive"
            ? "archived"
            : "draft",
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
    },
    admin.email,
  );

  return NextResponse.redirect(
    setRedirectToast(
      new URL(`/admin/entries/${id}`, request.url),
      "success",
      intent === "publish"
        ? "Entry published."
        : intent === "archive"
          ? "Entry archived."
          : "Draft saved.",
      "entry-editor",
    ),
  );
}
