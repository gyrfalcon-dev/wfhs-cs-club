import Link from "next/link";
import { getAllProjects, getProjectChildren } from "@/lib/content";

export default function ProjectsIndexPage() {
  const projects = getAllProjects();

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            Our experiments, competitions, and showcase builds. Click a project to learn more.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {projects.map((project) => {
              const children = getProjectChildren(project);
              return (
                <article key={project.slug} className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="tag">{project.projectType === "group" ? "Group" : "Project"}</span>
                    <span style={{ fontSize: "13px", color: "var(--accent-green)", fontWeight: 500 }}>
                      {project.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>{project.title}</h3>
                  <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: 0 }}>{project.summary}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {project.stack?.map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                  {project.projectType === "group" && children.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Includes
                      </p>
                      {children.map((child) => (
                        <Link
                          key={child.slug}
                          href={`/projects/${child.slug}`}
                          className="text-link"
                          style={{ fontSize: "14px" }}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  {project.projectType === "project" && (
                    <div style={{ marginTop: "auto" }}>
                      <Link href={`/projects/${project.slug}`} className="text-link" style={{ fontWeight: 600 }}>
                        View project →
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
