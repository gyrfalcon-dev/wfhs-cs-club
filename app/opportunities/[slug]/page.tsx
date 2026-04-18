import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OpportunityResponseForm } from "@/app/opportunities/_components/opportunity-response-form";
import {
  getOpportunityKindLabel,
  getPublishedOpportunityBySlug,
  isOpportunityOpen,
} from "@/lib/opportunities";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ state?: string; error?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getPublishedOpportunityBySlug(slug);

  if (!opportunity) {
    return {
      title: "Opportunity not found · WFHS CS Club",
    };
  }

  return {
    title: `${opportunity.title} · WFHS CS Club`,
    description: opportunity.summary,
  };
}

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const opportunity = await getPublishedOpportunityBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  const open = isOpportunityOpen(opportunity);

  return (
    <>
      <div className="page-header opportunities-header">
        <div className="container">
          <Link href="/opportunities" className="text-link">
            ← Back to opportunities
          </Link>
          <div className="opportunity-hero">
            <div>
              <p className="admin-kicker">{getOpportunityKindLabel(opportunity.kind)}</p>
              <h1 className="page-title">{opportunity.title}</h1>
              <p className="page-subtitle">{opportunity.summary}</p>
            </div>
            <div className="opportunity-hero-status">
              <span className={`opportunity-status ${open ? "is-open" : "is-closed"}`}>
                {open ? "Accepting responses" : "Not accepting responses"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="opportunity-detail-shell">
        <div className="container opportunity-detail-grid">
          <article className="card opportunity-detail-card">
            <h2>About this opportunity</h2>
            <p>{opportunity.description}</p>
            {query.state === "submitted" ? (
              <div className="status-banner status-banner-success">
                {opportunity.success_message}
              </div>
            ) : null}
            {query.error ? (
              <div className="status-banner status-banner-error">
                {decodeURIComponent(query.error)}
              </div>
            ) : null}
            {open ? (
              <OpportunityResponseForm opportunity={opportunity} />
            ) : (
              <div className="status-banner status-banner-warn">
                This listing is currently closed. Officers can reopen it from
                the admin dashboard if more responses are needed.
              </div>
            )}
          </article>

          <aside className="card opportunity-sidebar">
            <h3>Quick facts</h3>
            <dl className="opportunity-facts">
              <div>
                <dt>Type</dt>
                <dd>{getOpportunityKindLabel(opportunity.kind)}</dd>
              </div>
              {opportunity.location ? (
                <div>
                  <dt>Location</dt>
                  <dd>{opportunity.location}</dd>
                </div>
              ) : null}
              {opportunity.opens_at ? (
                <div>
                  <dt>Opens</dt>
                  <dd>{new Date(opportunity.opens_at).toLocaleString("en-US")}</dd>
                </div>
              ) : null}
              {opportunity.closes_at ? (
                <div>
                  <dt>Closes</dt>
                  <dd>{new Date(opportunity.closes_at).toLocaleString("en-US")}</dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
