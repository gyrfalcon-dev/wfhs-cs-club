import Link from "next/link";
import { getAllProjects, getProjectChildren } from "@/lib/content";

export default function ProjectsIndexPage() {
  const projects = getAllProjects();

  // Color palette for placeholder images
  const colorPalette = [
    "#6b5b77",
    "#574864",
    "#7a6d8f",
    "#8B7AA3",
    "#9E8FB5",
    "#5b4e67",
    "#7f7189",
  ];

  const getPlaceholderColor = (slug: string) => {
    const index = slug.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            Our experiments, competitions, and showcase builds. Click a project
            to learn more.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {projects.map((project) => {
              const children = getProjectChildren(project);
              const placeholderColor = getPlaceholderColor(project.slug);
              const isClickable = true; // Both projects and collections are clickable

              const cardContent = (
                <article
                  className={`project-card ${project.projectType === "group" ? "project-card-collection" : ""}`}
                  style={{ display: "flex", flexDirection: "column", gap: "0" }}
                >
                  {/* Image Preview / Placeholder */}
                  <div
                    className="project-card-image"
                    style={{ backgroundColor: placeholderColor }}
                  >
                    {project.cover && (
                      <img
                        src={project.cover}
                        alt={project.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="tag">
                        {project.projectType === "group"
                          ? "Collection"
                          : "Project"}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--accent-green)",
                          fontWeight: 500,
                        }}
                      >
                        {project.status}
                      </span>
                    </div>

                    <h3
                      style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}
                    >
                      {project.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "var(--text-secondary)",
                        margin: 0,
                      }}
                    >
                      {project.summary}
                    </p>

                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {project.stack?.map((tech) => (
                        <span key={tech} className="tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Collection info: show count of child projects */}
                    {project.projectType === "group" && children.length > 0 && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginTop: "4px",
                        }}
                      >
                        {children.length}{" "}
                        {children.length === 1 ? "project" : "projects"}{" "}
                        included
                      </p>
                    )}

                    {/* CTA */}
                    <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                      <span
                        className="text-link"
                        style={{ fontWeight: 600, cursor: "pointer" }}
                      >
                        {project.projectType === "group"
                          ? "View collection"
                          : "View project"}{" "}
                        →
                      </span>
                    </div>
                  </div>
                </article>
              );

              // Wrap entire card in Link - both projects and collections are clickable
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="project-card-link"
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
