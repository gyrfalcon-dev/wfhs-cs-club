import Link from "next/link";
import { getAdminProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Projects</p>
          <h1 className="page-title">Manage projects and collections</h1>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          New project
        </Link>
      </div>

      <div className="admin-list">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/admin/projects/${project.id}`}
            className="card admin-list-card"
          >
            <div className="card-row">
              <span className="tag">{project.projectType}</span>
              <span className="admin-row-status">
                {project.published ? "Published" : "Draft"}
              </span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="admin-meta-line">
              <span>/{project.slug}</span>
              <span>{project.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
