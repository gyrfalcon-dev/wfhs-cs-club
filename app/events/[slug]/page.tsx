import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLoadingShell } from "@/app/_components/public-route-shells";
import { ArticleLayout } from "@/components/article-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { getEventBySlug } from "@/lib/content";

export const revalidate = 300;

export async function generateMetadata(
  props: PageProps<"/events/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `${event.title} | WFHS CS Club`,
    description: event.description,
  };
}

export default function EventDetailPage(props: PageProps<"/events/[slug]">) {
  return (
    <Suspense fallback={<ArticleLoadingShell backLabel="← Back to meetups and updates" showCover tag="Event" />}>
      {props.params.then(({ slug }) => <EventDetailContent slug={slug} />)}
    </Suspense>
  );
}

async function EventDetailContent({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <ArticleLayout
      backHref="/terminal"
      backLabel="← Back to meetups and updates"
      coverImageUrl={event.coverImageUrl}
      meta={[
        new Date(event.eventAt).toLocaleDateString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        }),
        event.location || "WFHS Lab",
      ]}
      summary={event.description}
      tag="Event"
      title={event.title}
    >
      <MarkdownContent markdown={event.bodyMarkdown} />
    </ArticleLayout>
  );
}
