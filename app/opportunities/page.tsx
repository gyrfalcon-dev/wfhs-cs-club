import Link from "next/link";
import type { Metadata } from "next";
import {
  getOpportunityKindLabel,
  isOpportunityOpen,
  listPublishedOpportunities,
} from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Opportunities · WFHS CS Club",
  description:
    "Sign up for showcases, dev logs, volunteering, and other WFHS Computer Science Club opportunities.",
};

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const opportunities = await listPublishedOpportunities();
  const featuredOpportunity = opportunities[0] ?? null;
  const remainingOpportunities = opportunities.slice(1);

  return (
    <>
      <div className="page-header opportunities-header">
        <div className="container opportunities-hero-shell">
          <div className="opportunities-hero-copy">
            <p className="admin-kicker">Get involved</p>
            <h1 className="page-title">Opportunities</h1>
            <p className="page-subtitle">
              Pick what fits your schedule this week: demo your project, help
              run an event, or jump into a team effort.
            </p>
            <div className="opportunities-hero-pills">
              <span>Project showcases</span>
              <span>Dev log submissions</span>
              <span>Volunteer shifts</span>
              <span>Event signups</span>
            </div>
          </div>

          <div className="opportunities-hero-panel">
            <h2>Board at a glance</h2>
            <p>
              Officers publish every call here. Some are quick RSVPs, others are
              deeper submissions that become featured work on the site.
            </p>
            <div className="opportunities-hero-stats">
              <div>
                <strong>{opportunities.length}</strong>
                <span>Listings</span>
              </div>
              <div>
                <strong>{opportunities.filter(isOpportunityOpen).length}</strong>
                <span>Open now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="opportunities-shell">
        <div className="container">
          {featuredOpportunity ? (
            <section className="opportunity-feature">
              <div className="opportunity-feature-head">
                <div>
                  <p className="admin-kicker">Featured now</p>
                  <h2 className="section-heading no-margin">Current priority call</h2>
                </div>
                <Link href={`/opportunities/${featuredOpportunity.slug}`} className="text-link">
                  View details →
                </Link>
              </div>

              <article className="opportunity-spotlight">
                <div className="opportunity-spotlight-main">
                  <div className="opportunity-card-top">
                    <span className="tag">
                      {getOpportunityKindLabel(featuredOpportunity.kind)}
                    </span>
                    <span
                      className={`opportunity-status ${
                        isOpportunityOpen(featuredOpportunity) ? "is-open" : "is-closed"
                      }`}
                    >
                      {isOpportunityOpen(featuredOpportunity) ? "Open now" : "Closed"}
                    </span>
                  </div>
                  <h3>{featuredOpportunity.title}</h3>
                  <p>{featuredOpportunity.description}</p>
                  <div className="opportunity-meta-list">
                    {featuredOpportunity.location ? (
                      <span>{featuredOpportunity.location}</span>
                    ) : null}
                    {featuredOpportunity.opens_at ? (
                      <span>
                        Opens {new Date(featuredOpportunity.opens_at).toLocaleDateString("en-US")}
                      </span>
                    ) : null}
                    {featuredOpportunity.closes_at ? (
                      <span>
                        Closes {new Date(featuredOpportunity.closes_at).toLocaleDateString("en-US")}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="opportunity-spotlight-side">
                  <p className="admin-muted">
                    Strong fit for members who want a clear next step right now.
                  </p>
                  <Link href={`/opportunities/${featuredOpportunity.slug}`} className="btn-primary">
                    {isOpportunityOpen(featuredOpportunity)
                      ? featuredOpportunity.cta_label
                      : "View details"}
                  </Link>
                </div>
              </article>
            </section>
          ) : null}

          {opportunities.length === 0 ? (
            <section className="opportunities-section">
              <div className="opportunity-feature-head">
                <div>
                  <p className="admin-kicker">Open board</p>
                  <h2 className="section-heading no-margin">Current listings</h2>
                </div>
              </div>
              <div className="admin-empty-panel">
                Nothing is open right now. Check back after the next officer
                meeting.
              </div>
            </section>
          ) : remainingOpportunities.length > 0 || !featuredOpportunity ? (
            <section className="opportunities-section">
              <div className="opportunity-feature-head">
                <div>
                  <p className="admin-kicker">Open board</p>
                  <h2 className="section-heading no-margin">Current listings</h2>
                </div>
              </div>

              <div className="opportunity-list">
                {(featuredOpportunity ? remainingOpportunities : opportunities).map(
                  (opportunity) => {
                    const open = isOpportunityOpen(opportunity);

                    return (
                      <article key={opportunity.id} className="opportunity-list-row">
                        <div className="opportunity-list-main">
                          <div className="opportunity-card-top">
                            <span className="tag">
                              {getOpportunityKindLabel(opportunity.kind)}
                            </span>
                            <span className={`opportunity-status ${open ? "is-open" : "is-closed"}`}>
                              {open ? "Open" : "Closed"}
                            </span>
                          </div>
                          <h2>{opportunity.title}</h2>
                          <p className="card-summary">{opportunity.summary}</p>
                          <div className="opportunity-meta-list">
                            {opportunity.location ? <span>{opportunity.location}</span> : null}
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
                        <div className="opportunity-list-cta">
                          <Link href={`/opportunities/${opportunity.slug}`} className="btn-secondary">
                            {open ? opportunity.cta_label : "View details"}
                          </Link>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </>
  );
}
