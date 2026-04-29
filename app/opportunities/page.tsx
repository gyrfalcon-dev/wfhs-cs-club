import Link from "next/link";
import type { Metadata } from "next";
import {
  getOpportunityKindLabel,
  isOpportunityOpen,
  listPublishedOpportunities,
} from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Opportunities | WFHS CS Club",
  description:
    "Ways to help, share work, and stay involved with the WFHS Computer Science Club.",
};

export const revalidate = 300;

export default async function OpportunitiesPage() {
  const opportunities = await listPublishedOpportunities();

  return (
    <>
      <div className="page-header opportunities-header editorial-header">
        <div className="container opportunities-hero-shell">
          <div className="opportunities-hero-copy">
            <h1 className="page-title">Opportunities</h1>
            <p className="page-subtitle">
              Small ways to help, share your work, or pitch in.
            </p>
          </div>
        </div>
      </div>

      <section className="opportunities-shell">
        <div className="container">
          {opportunities.length === 0 ? (
            <section className="opportunities-section">
              <div className="opportunity-feature-head">
                <div>
                  <h2 className="section-heading no-margin">Open now</h2>
                </div>
              </div>
              <div className="admin-empty-panel">
                Nothing is open right now. Check back soon.
              </div>
            </section> 
          ) : (
            <section className="opportunities-section">
              <div className="opportunity-feature-head">
                <div>
                  <h2 className="section-heading no-margin">Open now</h2>
                </div>
              </div>

              <div className="opportunity-list opportunity-public-list">
                {opportunities.map((opportunity, index) => {
                  const open = isOpportunityOpen(opportunity);
                  const showLocation =
                    opportunity.location && opportunity.location !== "Website";

                  return (
                    <article
                      key={opportunity.id}
                      className={`opportunity-list-row opportunity-public-card ${
                        index === 0 ? "is-priority" : ""
                      }`}
                    >
                      <div className="opportunity-list-main opportunity-public-card-main">
                        <div className="opportunity-card-top">
                          <span className="tag">{getOpportunityKindLabel(opportunity.kind)}</span>
                          <span className={`opportunity-status ${open ? "is-open" : "is-closed"}`}>
                            {open ? "Open" : "Closed"}
                          </span>
                        </div>
                        <h2>{opportunity.title}</h2>
                        <p className="card-summary">
                          {opportunity.summary || opportunity.description}
                        </p>
                        <div className="opportunity-meta-list">
                          {showLocation ? <span>{opportunity.location}</span> : null}
                          {opportunity.opens_at ? (
                            <span>Opens {new Date(opportunity.opens_at).toLocaleDateString("en-US")}</span>
                          ) : null}
                          {opportunity.closes_at ? (
                            <span>Closes {new Date(opportunity.closes_at).toLocaleDateString("en-US")}</span>
                          ) : null}
                        </div>
                        <div className="opportunity-list-cta opportunity-public-card-cta">
                          <Link
                            href={`/opportunities/${opportunity.slug}`}
                            className={open ? "btn-primary" : "btn-secondary"}
                          >
                            {open ? opportunity.cta_label : "View details"}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
