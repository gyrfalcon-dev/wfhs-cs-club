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

  return (
    <>
      <div className="page-header opportunities-header">
        <div className="container">
          <p className="admin-kicker">Get involved</p>
          <h1 className="page-title">Opportunities</h1>
          <p className="page-subtitle">
            Show a project, submit a build update, sign up for an event, or put
            your name on something the club needs help with.
          </p>
        </div>
      </div>

      <section className="opportunities-shell">
        <div className="container">
          <div className="opportunities-lead">
            <div className="card opportunity-lead-card">
              <h2>One board, different ways to contribute</h2>
              <p>
                Some opportunities are quick signups. Others collect enough
                detail for officers to turn them into a polished public post.
              </p>
            </div>
            <div className="card opportunity-lead-card opportunity-lead-accent">
              <h3>What belongs here?</h3>
              <p>
                Volunteering, showcases, build updates, workshops, signups,
                event participation, and anything else that needs organized
                member intake.
              </p>
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="card admin-empty-state">
              Nothing is open right now. Check back after the next officer
              meeting.
            </div>
          ) : (
            <div className="opportunity-grid">
              {opportunities.map((opportunity) => {
                const open = isOpportunityOpen(opportunity);

                return (
                  <article key={opportunity.id} className="card opportunity-card">
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
                      {opportunity.location ? (
                        <span>{opportunity.location}</span>
                      ) : null}
                      {opportunity.opens_at ? (
                        <span>
                          Opens{" "}
                          {new Date(opportunity.opens_at).toLocaleDateString("en-US")}
                        </span>
                      ) : null}
                      {opportunity.closes_at ? (
                        <span>
                          Closes{" "}
                          {new Date(opportunity.closes_at).toLocaleDateString("en-US")}
                        </span>
                      ) : null}
                    </div>
                    <Link
                      href={`/opportunities/${opportunity.slug}`}
                      className="btn-secondary"
                    >
                      {open ? opportunity.cta_label : "View details"}
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
