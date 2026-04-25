import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { getProjectBySlug, getProjectChildren } from "@/lib/content";

export const revalidate = 300;

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | WFHS CS Club`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const children = await getProjectChildren(project.id);

  return (
    <ArticleLayout
      backHref="/projects"
      backLabel="← Back to projects"
      coverImageUrl={project.coverImageUrl}
      meta={[
        project.projectType === "group" ? "Collection" : "Project",
        project.status,
        project.published ? "Published" : "Draft",
      ]}
      summary={project.summary}
      tag={project.projectType === "group" ? "Collection" : "Project"}
      title={project.title}
    >
      <MarkdownContent markdown={project.bodyMarkdown} />

      {project.projectType === "group" ? (
        <section className="article-children">
          <h2>What&apos;s inside</h2>
          {children.length === 0 ? (
            <p>This collection is still growing. More projects can be added as they ship.</p>
          ) : (
            <div className="article-child-grid">
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={`/projects/${child.slug}`}
                  className="card"
                  style={{ textDecoration: "none" }}
                >
                  <h3>{child.title}</h3>
                  <p>{child.summary}</p>
                  <span className="admin-row-status">{child.status}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </ArticleLayout>
  );
}
