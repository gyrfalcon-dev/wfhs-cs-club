import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteProjectAction,
  saveProjectAction,
  uploadEditorImage,
} from "@/app/admin/actions";
import { getAdminProjectById, getAdminProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EditProjectAdminPage({
  params,
  searchParams,
}: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const projectId = Number(id);
  const [project, projects, query] = await Promise.all([
    getAdminProjectById(projectId),
    getAdminProjects(),
    searchParams,
  ]);

  if (!project) {
    notFound();
  }

  const uploaded =
    typeof query.uploaded === "string" ? decodeURIComponent(query.uploaded) : "";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Projects</p>
          <h1 className="page-title">Edit {project.title}</h1>
        </div>
        <Link href="/admin/projects" className="btn-secondary">
          Back to projects
        </Link>
      </div>

      <form action={saveProjectAction} className="admin-editor">
        <input type="hidden" name="id" value={project.id} />
        <input type="hidden" name="previousSlug" value={project.slug} />
        <input
          type="hidden"
          name="existingCoverImageUrl"
          value={project.coverImageUrl ?? ""}
        />

        <div className="admin-editor-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              name="title"
              required
              className="form-input"
              defaultValue={project.title}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              name="slug"
              className="form-input"
              defaultValue={project.slug}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-input"
              defaultValue={project.status}
            >
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
              defaultValue={project.projectType}
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
            defaultValue={project.summary}
          />
        </div>

        <div className="admin-editor-grid admin-editor-grid-tight">
          <div className="form-group">
            <label className="form-label">Parent collection</label>
            <select
              name="parentProjectId"
              className="form-input"
              defaultValue={project.parentProjectId ?? ""}
            >
              <option value="">None</option>
              {projects
                .filter(
                  (entry) =>
                    entry.projectType === "group" && entry.id !== project.id,
                )
                .map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Replace cover image</label>
            <input
              name="coverImage"
              type="file"
              accept="image/*"
              className="form-input"
            />
            {project.coverImageUrl ? (
              <p className="admin-upload-result">
                Current: <code>{project.coverImageUrl}</code>
              </p>
            ) : null}
          </div>
        </div>

        <div className="admin-checkbox-row">
          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project.featured}
            />
            <span>Feature on homepage</span>
          </label>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="published"
              defaultChecked={project.published}
            />
            <span>Published</span>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Body Markdown</label>
          <textarea
            name="bodyMarkdown"
            rows={16}
            className="form-input admin-markdown-input"
            defaultValue={project.bodyMarkdown}
          />
        </div>

        <div className="admin-inline-actions">
          <button type="submit" className="btn-primary">
            Save project
          </button>
          <Link href={`/projects/${project.slug}`} className="btn-secondary">
            View public page
          </Link>
        </div>
      </form>

      <form action={uploadEditorImage} className="card admin-upload-card">
        <input
          type="hidden"
          name="redirectTo"
          value={`/admin/projects/${project.id}`}
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

      <form action={deleteProjectAction} className="card admin-danger-card">
        <input type="hidden" name="id" value={project.id} />
        <input type="hidden" name="slug" value={project.slug} />
        <h3>Delete this project</h3>
        <p>This removes the record from Supabase and the public site.</p>
        <button type="submit" className="btn-secondary">
          Delete project
        </button>
      </form>
    </div>
  );
}
