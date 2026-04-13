import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteDevLogAction,
  saveDevLogAction,
  uploadEditorImage,
} from "@/app/admin/actions";
import { getAdminDevLogById } from "@/lib/content";

export const dynamic = "force-dynamic";

function toDateTimeLocalValue(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export default async function EditDevLogAdminPage({
  params,
  searchParams,
}: PageProps<"/admin/devlogs/[id]">) {
  const { id } = await params;
  const devLog = await getAdminDevLogById(Number(id));
  const query = await searchParams;

  if (!devLog) {
    notFound();
  }

  const uploaded =
    typeof query.uploaded === "string" ? decodeURIComponent(query.uploaded) : "";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Dev Logs</p>
          <h1 className="page-title">Edit {devLog.title}</h1>
        </div>
        <Link href="/admin/devlogs" className="btn-secondary">
          Back to dev logs
        </Link>
      </div>

      <form action={saveDevLogAction} className="admin-editor">
        <input type="hidden" name="id" value={devLog.id} />
        <input type="hidden" name="previousSlug" value={devLog.slug} />
        <input
          type="hidden"
          name="existingCoverImageUrl"
          value={devLog.coverImageUrl ?? ""}
        />

        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              name="title"
              required
              className="form-input"
              defaultValue={devLog.title}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input name="slug" className="form-input" defaultValue={devLog.slug} />
          </div>
          <div className="form-group">
            <label className="form-label">Publish date</label>
            <input
              name="publishedAt"
              type="datetime-local"
              required
              className="form-input"
              defaultValue={toDateTimeLocalValue(devLog.publishedAt)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Replace cover image</label>
            <input
              name="coverImage"
              type="file"
              accept="image/*"
              className="form-input"
            />
            {devLog.coverImageUrl ? (
              <p className="admin-upload-result">
                Current: <code>{devLog.coverImageUrl}</code>
              </p>
            ) : null}
          </div>
        </div>

        <div className="admin-checkbox-row">
          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="published"
              defaultChecked={devLog.published}
            />
            <span>Published</span>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            className="form-input"
            defaultValue={devLog.description}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Body Markdown</label>
          <textarea
            name="bodyMarkdown"
            rows={16}
            className="form-input admin-markdown-input"
            defaultValue={devLog.bodyMarkdown}
          />
        </div>

        <div className="admin-inline-actions">
          <button type="submit" className="btn-primary">
            Save dev log
          </button>
          <Link href={`/devlogs/${devLog.slug}`} className="btn-secondary">
            View public page
          </Link>
        </div>
      </form>

      <form action={uploadEditorImage} className="card admin-upload-card">
        <input
          type="hidden"
          name="redirectTo"
          value={`/admin/devlogs/${devLog.id}`}
        />
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

      <form action={deleteDevLogAction} className="card admin-danger-card">
        <input type="hidden" name="id" value={devLog.id} />
        <input type="hidden" name="slug" value={devLog.slug} />
        <h3>Delete this dev log</h3>
        <p>This removes the article and its public detail page.</p>
        <button type="submit" className="btn-secondary">
          Delete dev log
        </button>
      </form>
    </div>
  );
}
