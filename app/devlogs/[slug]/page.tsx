import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { getDevLogBySlug } from "@/lib/content";

export const revalidate = 300;

export async function generateMetadata(
  props: PageProps<"/devlogs/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const devLog = await getDevLogBySlug(slug);

  if (!devLog) {
    return { title: "Dev Log Not Found" };
  }

  return {
    title: `${devLog.title} | WFHS CS Club`,
    description: devLog.description,
  };
}

export default async function DevLogDetailPage(
  props: PageProps<"/devlogs/[slug]">,
) {
  const { slug } = await props.params;
  const devLog = await getDevLogBySlug(slug);

  if (!devLog) {
    notFound();
  }

  return (
    <ArticleLayout
      backHref="/devlogs"
      backLabel="← Back to dev logs"
      coverImageUrl={devLog.coverImageUrl}
      meta={[
        new Date(devLog.publishedAt).toLocaleDateString("en-US", {
          dateStyle: "long",
        }),
      ]}
      summary={devLog.description}
      tag="Dev Log"
      title={devLog.title}
    >
      <MarkdownContent markdown={devLog.bodyMarkdown} />
    </ArticleLayout>
  );
}
