import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RouteToast } from "@/app/_components/route-toast";
import { OpportunityResponseForm } from "@/app/opportunities/_components/opportunity-response-form";
import {
  getOpportunityKindLabel,
  getPublishedOpportunityBySlug,
  isOpportunityOpen,
} from "@/lib/opportunities";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ toast?: string; message?: string; toastScope?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getPublishedOpportunityBySlug(slug);

  if (!opportunity) {
    return {
      title: "Opportunity not found | WFHS CS Club",
    };
  }

  return {
    title: `${opportunity.title} | WFHS CS Club`,
    description: opportunity.summary,
  };
}

export const revalidate = 300;

export default async function OpportunityDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const toast = getToastFromSearchParams(query);
  const opportunity = await getPublishedOpportunityBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  const open = isOpportunityOpen(opportunity);
  const showLocation = opportunity.location && opportunity.location !== "Website";

  return (
    <>
      <div className="page-header opportunities-header">
        <div className="container opportunity-detail-hero-shell">
          <Link href="/opportunities" className="text-link">
            {"<-"} Back
          </Link>
        </div>
      </div>

      <section className="opportunity-detail-shell">
        <div className="container opportunity-detail-container">
          <article className="card opportunity-detail-card opportunity-detail-card-main">
            {toast ? (
              <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
            ) : null}
            <div className="opportunity-detail-section">
              <div className="opportunity-detail-head">
                <div className="opportunity-card-top">
                  <span className="tag">{getOpportunityKindLabel(opportunity.kind)}</span>
                  <span className={`opportunity-status ${open ? "is-open" : "is-closed"}`}>
                    {open ? "Open" : "Closed"}
                  </span>
                </div>
                <h1 className="page-title opportunity-detail-title">{opportunity.title}</h1>
                <p className="page-subtitle opportunity-detail-summary">{opportunity.summary}</p>
                <div className="opportunity-meta-list">
                  {showLocation ? <span>{opportunity.location}</span> : null}
                  {opportunity.opens_at ? (
                    <span>
                      Opens {new Date(opportunity.opens_at).toLocaleDateString("en-US")}
                    </span>
                  ) : null}
                  {opportunity.closes_at ? (
                    <span>
                      Closes {new Date(opportunity.closes_at).toLocaleDateString("en-US")}
                    </span>
                  ) : null}
                </div>
              </div>
              <p>{opportunity.description}</p>
            </div>
            {open ? (
              <div className="opportunity-detail-section">
                <OpportunityResponseForm opportunity={opportunity} />
              </div>
            ) : (
              <div className="status-banner status-banner-warn">
                This one is closed for now.
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
