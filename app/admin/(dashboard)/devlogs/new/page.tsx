import Link from "next/link";
import { saveDevLogAction, uploadEditorImage } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function NewDevLogAdminPage({
  searchParams,
}: PageProps<"/admin/devlogs/new">) {
  const params = await searchParams;
  const uploaded =
    typeof params.uploaded === "string" ? decodeURIComponent(params.uploaded) : "";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Dev Logs</p>
          <h1 className="page-title">Create dev log</h1>
        </div>
        <Link href="/admin/devlogs" className="btn-secondary">
          Back to dev logs
        </Link>
      </div>

      <form action={saveDevLogAction} className="admin-editor">
        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input name="title" required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              name="slug"
              className="form-input"
              placeholder="march-sprint-recap"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Publish date</label>
            <input
              name="publishedAt"
              type="datetime-local"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Cover image</label>
            <input
              name="coverImage"
              type="file"
              accept="image/*"
              className="form-input"
            />
          </div>
        </div>

        <div className="admin-checkbox-row">
          <label className="admin-checkbox">
            <input type="checkbox" name="published" defaultChecked />
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
          />
        </div>

        <div className="form-group">
          <label className="form-label">Body Markdown</label>
          <textarea
            name="bodyMarkdown"
            rows={16}
            className="form-input admin-markdown-input"
          />
        </div>

        <div className="admin-inline-actions">
          <button type="submit" className="btn-primary">
            Save dev log
          </button>
        </div>
      </form>

      <form action={uploadEditorImage} className="card admin-upload-card">
        <input type="hidden" name="redirectTo" value="/admin/devlogs/new" />
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
    </div>
  );
}
