import { ImageUploadField } from "@/app/_components/image-upload-field";
import { ToastForm } from "@/app/_components/toast-form";
import type { ContentEntry, ContentType, ContentVersion } from "@/lib/content-store";

type EntryFormProps = {
  action: string;
  type: ContentType;
  entry?: ContentEntry | null;
  versions?: ContentVersion[];
};

const typeLabel = (type: ContentType) => {
  if (type === "project") return "Project";
  if (type === "event") return "Event";
  return "Devlog";
};

export function EntryForm({ action, type, entry, versions = [] }: EntryFormProps) {
  const projectEntry = type === "project";
  const eventEntry = type === "event" || type === "devlog";

  return (
    <div className="admin-grid admin-grid-wide">
      <div className="card admin-panel">
        <ToastForm
          action={action}
          method="post"
          style={{ display: "grid", gap: "18px" }}
          pendingMessage={entry ? "Saving entry..." : "Creating entry..."}
          invalidMessage="Complete the required entry fields before saving."
          toastScope="entry-editor"
        >
          <input type="hidden" name="type" value={type} />

          <div className="form-group">
            <label className="form-label">{typeLabel(type)} Title</label>
            <input
              name="title"
              required
              defaultValue={entry?.title || ""}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              name="slug"
              required
              defaultValue={entry?.slug || ""}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Summary</label>
            <textarea
              name="summary"
              required
              rows={3}
              defaultValue={entry?.summary || ""}
              className="form-input"
              style={{ resize: "vertical", minHeight: "110px" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input
                name="authorName"
                required
                defaultValue={entry?.author_name || ""}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Author Email</label>
              <input
                type="email"
                name="authorEmail"
                required
                defaultValue={entry?.author_email || ""}
                className="form-input"
              />
            </div>
          </div>

          {eventEntry && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  defaultValue={toDateInputValue(entry?.event_date)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  defaultValue={entry?.location || ""}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {projectEntry && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "18px",
                }}
              >
                <div className="form-group">
                  <label className="form-label">Project Status</label>
                  <select
                    name="projectStatus"
                    defaultValue={entry?.project_status || "active"}
                    className="form-input"
                  >
                    <option value="active">active</option>
                    <option value="planning">planning</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <select
                    name="projectType"
                    defaultValue={entry?.project_type || "project"}
                    className="form-input"
                  >
                    <option value="project">project</option>
                    <option value="group">group</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Stack / Tags</label>
                <input
                  name="stack"
                  defaultValue={(entry?.stack || []).join(", ")}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Child Slugs</label>
                <input
                  name="children"
                  defaultValue={(entry?.children || []).join(", ")}
                  className="form-input"
                />
              </div>

              <ImageUploadField name="cover" initialValue={entry?.cover} />

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={Boolean(entry?.featured)}
                />
                Featured on the homepage
              </label>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Review Notes</label>
            <textarea
              name="reviewNotes"
              rows={3}
              defaultValue={entry?.review_notes || ""}
              className="form-input"
              style={{ resize: "vertical", minHeight: "110px" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Body</label>
            <textarea
              name="body"
              rows={10}
              defaultValue={entry?.body || ""}
              className="form-input"
              style={{ resize: "vertical", minHeight: "240px" }}
            />
          </div>

          <div className="admin-actions">
            <button className="btn-primary submit-button" type="submit" name="intent" value="save">
              Save Draft
            </button>
            <button className="btn-secondary" type="submit" name="intent" value="publish">
              Publish
            </button>
            {entry && (
              <>
                <button className="btn-secondary" type="submit" name="intent" value="unpublish">
                  Move to Draft
                </button>
                <button className="btn-secondary" type="submit" name="intent" value="archive">
                  Archive
                </button>
                <button className="btn-secondary" type="submit" name="intent" value="delete">
                  Soft Delete
                </button>
              </>
            )}
          </div>
        </ToastForm>
      </div>

      <aside className="card admin-panel">
        <p className="admin-eyebrow">Status</p>
        <h2 style={{ marginTop: "8px" }}>{entry?.status || "new draft"}</h2>
        <p className="admin-meta">
          Last updated: {entry ? formatDateTime(entry.updated_at) : "not saved yet"}
        </p>
        {entry?.published_at && (
          <p className="admin-meta">Published: {formatDateTime(entry.published_at)}</p>
        )}
        {entry?.deleted_at && (
          <p className="admin-meta">Deleted: {formatDateTime(entry.deleted_at)}</p>
        )}

        <div style={{ marginTop: "24px" }}>
          <p className="admin-eyebrow">Version History</p>
          {versions.length === 0 ? (
            <p className="admin-meta">No restore points yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {versions.map((version) => (
                <ToastForm
                  key={version.id}
                  action={`/api/admin/entries/${version.entry_id}/restore`}
                  method="post"
                  className="admin-version"
                  pendingMessage="Restoring version..."
                  toastScope="entry-editor"
                >
                  <input type="hidden" name="versionId" value={version.id} />
                  <div>
                    <strong>{version.version_kind}</strong>
                    <p className="admin-meta" style={{ margin: "6px 0 0" }}>
                      {formatDateTime(version.created_at)}
                    </p>
                  </div>
                  <button className="btn-secondary" type="submit">
                    Restore
                  </button>
                </ToastForm>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const toDateInputValue = (value: string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};
