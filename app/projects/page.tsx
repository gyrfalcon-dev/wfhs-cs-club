import { ContentCard } from "@/components/content-card";
import { getAllProjects } from "@/lib/content";

export const revalidate = 300;

export default async function ProjectsIndexPage() {
  const projects = await getAllProjects();

  const colorPalette = [
    "#6b5b77",
    "#574864",
    "#7a6d8f",
    "#8b7aa3",
    "#9e8fb5",
    "#5b4e67",
    "#7f7189",
  ];

  const getPlaceholderColor = (slug: string) => {
    const index = slug.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  const projectCards = await Promise.all(
    projects.map(async (project, index) => {
      return (
        <ContentCard
          key={project.slug}
          badge={project.projectType === "group" ? "Collection" : "Project"}
          cardClassName={
            project.projectType === "group" ? "project-card-collection" : undefined
          }
          ctaLabel={
            project.projectType === "group" ? "View collection" : "View project"
          }
          description={
            project.projectType === "group" && (project.childCount ?? 0) > 0
              ? `${project.summary} ${project.childCount} ${project.childCount === 1 ? "project" : "projects"} included.`
              : project.summary
          }
          href={`/projects/${project.slug}`}
          imageUrl={project.coverImageUrl}
          meta={project.status}
          placeholderColor={getPlaceholderColor(project.slug)}
          revealIndex={index}
          title={project.title}
        />
      );
    }),
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            Things the club has built, is building, or keeps talking about
            building until somebody finally starts the repo.
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
            {projectCards}
          </div>
        </div>
      </section>
    </>
  );
}
