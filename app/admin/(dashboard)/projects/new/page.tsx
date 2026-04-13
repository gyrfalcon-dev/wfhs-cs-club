import Link from "next/link";
import { saveProjectAction, uploadEditorImage } from "@/app/admin/actions";
import { getAdminProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function NewProjectAdminPage({
  searchParams,
}: PageProps<"/admin/projects/new">) {
  const projects = await getAdminProjects();
  const params = await searchParams;
  const uploaded =
    typeof params.uploaded === "string" ? decodeURIComponent(params.uploaded) : "";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Projects</p>
          <h1 className="page-title">Create project</h1>
        </div>
        <Link href="/admin/projects" className="btn-secondary">
          Back to projects
        </Link>
      </div>

      <form action={saveProjectAction} className="admin-editor">
        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input name="title" required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input name="slug" className="form-input" placeholder="robot-ai" />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-input" defaultValue="active">
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              name="projectType"
              className="form-input"
              defaultValue="project"
            >
              <option value="project">Project</option>
              <option value="group">Collection</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Summary</label>
          <textarea
            name="summary"
            required
            rows={3}
            className="form-input"
          />
        </div>

        <div className="admin-editor-grid admin-editor-grid-tight">
          <div className="form-group">
            <label className="form-label">Parent collection</label>
            <select name="parentProjectId" className="form-input" defaultValue="">
              <option value="">None</option>
              {projects
                .filter((project) => project.projectType === "group")
                .map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
            </select>
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
            <input type="checkbox" name="featured" />
            <span>Feature on homepage</span>
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" name="published" defaultChecked />
            <span>Published</span>
          </label>
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
            Save project
          </button>
        </div>
      </form>

      <form action={uploadEditorImage} className="card admin-upload-card">
        <input type="hidden" name="redirectTo" value="/admin/projects/new" />
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
