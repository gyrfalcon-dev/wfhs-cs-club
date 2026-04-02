import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectChildren } from "@/lib/content";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} · WFHS CS Club`,
    description: project.summary,
  };
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  const children = getProjectChildren(project);

  return (
    <div style={{ paddingTop: "120px" }}>
      <div className="container" style={{ paddingBottom: "80px" }}>
        <Link
          href="/projects"
          className="text-link"
          style={{ fontSize: "14px" }}
        >
          ← Back to projects
        </Link>

        <div style={{ marginTop: "32px", marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <span className="tag">
              {project.projectType === "group" ? "Group" : "Project"}
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
          <h1
            style={{ fontSize: "42px", fontWeight: 700, marginBottom: "16px" }}
          >
            {project.title}
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "var(--text-secondary)",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            {project.summary}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            {project.stack?.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {project.projectType === "group" && (
          <section>
            <h2 className="section-heading">What&apos;s inside</h2>
            {children.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>
                This collection is still growing. More projects can be added
                when they&apos;re ready.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                  marginTop: "16px",
                }}
              >
                {children.map((child) => (
                  <Link
                    key={child.slug}
                    href={`/projects/${child.slug}`}
                    className="card"
                    style={{ textDecoration: "none" }}
                  >
                    <h3 style={{ marginBottom: "8px" }}>{child.title}</h3>
                    <p>{child.summary}</p>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--accent-green)",
                        fontWeight: 500,
                        marginTop: "12px",
                        display: "block",
                      }}
                    >
                      {child.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {project.projectType === "project" && (
          <section className="card" style={{ marginTop: "16px" }}>
            <h3>Project Notes</h3>
            <p>
              We keep a short trail of notes here so the next person picking
              this up can see what worked, what broke, and what to try next.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
