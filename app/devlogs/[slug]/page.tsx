import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLoadingShell } from "@/app/_components/public-route-shells";
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

export default function DevLogDetailPage(props: PageProps<"/devlogs/[slug]">) {
  return (
    <Suspense fallback={<ArticleLoadingShell backLabel="← Back to meetups and updates" tag="Dev Log" />}>
      {props.params.then(({ slug }) => <DevLogDetailContent slug={slug} />)}
    </Suspense>
  );
}

async function DevLogDetailContent({ slug }: { slug: string }) {
  const devLog = await getDevLogBySlug(slug);

  if (!devLog) {
    notFound();
  }

  return (
    <ArticleLayout
      backHref="/terminal"
      backLabel="← Back to meetups and updates"
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
