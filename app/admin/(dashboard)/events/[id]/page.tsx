import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteEventAction,
  saveEventAction,
  uploadEditorImage,
} from "@/app/admin/actions";
import { getAdminEventById } from "@/lib/content";

export const dynamic = "force-dynamic";

function toDateTimeLocalValue(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export default async function EditEventAdminPage({
  params,
  searchParams,
}: PageProps<"/admin/events/[id]">) {
  const { id } = await params;
  const event = await getAdminEventById(Number(id));
  const query = await searchParams;

  if (!event) {
    notFound();
  }

  const uploaded =
    typeof query.uploaded === "string" ? decodeURIComponent(query.uploaded) : "";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Events</p>
          <h1 className="page-title">Edit {event.title}</h1>
        </div>
        <Link href="/admin/events" className="btn-secondary">
          Back to events
        </Link>
      </div>

      <form action={saveEventAction} className="admin-editor">
        <input type="hidden" name="id" value={event.id} />
        <input type="hidden" name="previousSlug" value={event.slug} />
        <input
          type="hidden"
          name="existingCoverImageUrl"
          value={event.coverImageUrl ?? ""}
        />

        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              name="title"
              required
              className="form-input"
              defaultValue={event.title}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input name="slug" className="form-input" defaultValue={event.slug} />
          </div>
          <div className="form-group">
            <label className="form-label">Event date</label>
            <input
              name="eventAt"
              type="datetime-local"
              required
              className="form-input"
              defaultValue={toDateTimeLocalValue(event.eventAt)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              name="location"
              className="form-input"
              defaultValue={event.location ?? ""}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            className="form-input"
            defaultValue={event.description}
          />
        </div>

        <div className="admin-editor-grid admin-editor-grid-tight">
          <div className="form-group">
            <label className="form-label">Replace cover image</label>
            <input
              name="coverImage"
              type="file"
              accept="image/*"
              className="form-input"
            />
            {event.coverImageUrl ? (
              <p className="admin-upload-result">
                Current: <code>{event.coverImageUrl}</code>
              </p>
            ) : null}
          </div>
          <div className="admin-checkbox-row">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="published"
                defaultChecked={event.published}
              />
              <span>Published</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Body Markdown</label>
          <textarea
            name="bodyMarkdown"
            rows={16}
            className="form-input admin-markdown-input"
            defaultValue={event.bodyMarkdown}
          />
        </div>

        <div className="admin-inline-actions">
          <button type="submit" className="btn-primary">
            Save event
          </button>
          <Link href={`/events/${event.slug}`} className="btn-secondary">
            View public page
          </Link>
        </div>
      </form>

      <form action={uploadEditorImage} className="card admin-upload-card">
        <input type="hidden" name="redirectTo" value={`/admin/events/${event.id}`} />
        <div className="form-group">
          <label className="form-label">Upload article image</label>
          <input name="image" type="file" accept="image/*" className="form-input" />
        </div>
        <button type="submit" className="btn-secondary">
          Upload image
        </button>
        {uploaded ? (
          <p className="admin-upload-result">
            Paste this into Markdown: <code>{uploaded}</code>
          </p>
        ) : null}
      </form>

      <form action={deleteEventAction} className="card admin-danger-card">
        <input type="hidden" name="id" value={event.id} />
        <input type="hidden" name="slug" value={event.slug} />
        <h3>Delete this event</h3>
        <p>This removes the event from the public schedule and its detail page.</p>
        <button type="submit" className="btn-secondary">
          Delete event
        </button>
      </form>
    </div>
  );
}
