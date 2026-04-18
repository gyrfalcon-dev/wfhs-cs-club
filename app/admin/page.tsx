import Link from "next/link";
import { RouteToast } from "@/app/_components/route-toast";
import { getAdminIdentity } from "@/lib/admin-auth";
import { listDashboardEntries } from "@/lib/content-store";
import { getJoinSubmissions } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/env";
import {
  getOpportunityKindLabel,
  listAdminOpportunities,
  listRecentOpportunityResponses,
} from "@/lib/opportunities";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

type PageProps = {
  searchParams: Promise<{ toast?: string; message?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const toast = getToastFromSearchParams(query);
  const admin = await getAdminIdentity();
  const dashboard = admin ? await listDashboardEntries() : null;
  const opportunities = admin ? await listAdminOpportunities() : [];
  const recentResponses = admin ? await listRecentOpportunityResponses(6) : [];
  const joinSubmissions = admin ? await getJoinSubmissions() : [];

  const pendingEntries = dashboard?.pending ?? [];
  const draftEntries = dashboard?.draft ?? [];
  const publishedEntries = dashboard?.published ?? [];
  const archivedEntries = dashboard?.archived ?? [];
  const openOpportunities = opportunities.filter(
    (opportunity) => opportunity.published && opportunity.status === "published",
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Admin</h1>
          <p className="page-subtitle">
            Keep the site current, review what members submitted, and move the
            next item forward without hunting through five screens.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          {toast ? <RouteToast tone={toast.tone} message={toast.message} /> : null}

          {!isSupabaseConfigured && (
            <div className="status-banner status-banner-warn">
              Supabase is not configured yet. Set the values in `.env.local`,
              run the SQL in `supabase/schema.sql`, and reload this page.
            </div>
          )}

          {!admin ? (
            <div className="card admin-login-shell">
              <div>
                <p className="admin-eyebrow">Officer access</p>
                <h2 style={{ margin: "8px 0" }}>Sign in with a magic link</h2>
                <p style={{ margin: 0 }}>
                  Enter an approved officer email and we&apos;ll send a link that
                  signs you into the dashboard.
                </p>
              </div>
              <form action="/api/admin/login" method="post" className="admin-login-form">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="officer@students.wcpss.net"
                  className="form-input"
                />
                <button type="submit" className="btn-primary submit-button">
                  Send Link
                </button>
              </form>
            </div>
          ) : (
            <div className="admin-command-center">
              <section className="card admin-command-bar">
                <div>
                  <p className="admin-eyebrow">Signed in as</p>
                  <h2 className="admin-command-title">{admin.email}</h2>
                  <p className="admin-muted admin-command-copy">
                    Prioritize review work first, then keep published sections
                    fresh and opportunities visible.
                  </p>
                </div>
                <div className="admin-command-actions">
                  <Link href="/admin/new?type=project" className="btn-secondary">
                    New project
                  </Link>
                  <Link href="/admin/new?type=devlog" className="btn-secondary">
                    New devlog
                  </Link>
                  <Link href="/admin/new?type=event" className="btn-secondary">
                    New event
                  </Link>
                  <Link href="/admin/opportunities/new" className="btn-primary">
                    New opportunity
                  </Link>
                  <Link href="/admin/submissions" className="btn-secondary">
                    Join inbox
                  </Link>
                  <form action="/api/admin/logout" method="post">
                    <button type="submit" className="btn-secondary">
                      Sign out
                    </button>
                  </form>
                </div>
              </section>

              <section className="admin-metric-grid">
                <article className="card admin-metric-card admin-metric-emphasis">
                  <span className="admin-metric-label">Needs review</span>
                  <strong className="admin-metric-value">{pendingEntries.length}</strong>
                  <p>Pending member submissions waiting for a decision.</p>
                </article>
                <article className="card admin-metric-card">
                  <span className="admin-metric-label">Drafts in progress</span>
                  <strong className="admin-metric-value">{draftEntries.length}</strong>
                  <p>Entries that still need edits before they go live.</p>
                </article>
                <article className="card admin-metric-card">
                  <span className="admin-metric-label">Live opportunities</span>
                  <strong className="admin-metric-value">{openOpportunities.length}</strong>
                  <p>Published listings currently collecting responses.</p>
                </article>
                <article className="card admin-metric-card">
                  <span className="admin-metric-label">Fresh responses</span>
                  <strong className="admin-metric-value">{recentResponses.length}</strong>
                  <p>Recent opportunity applications waiting for follow-up.</p>
                </article>
                <article className="card admin-metric-card">
                  <span className="admin-metric-label">Join inbox</span>
                  <strong className="admin-metric-value">{joinSubmissions.length}</strong>
                  <p>Students who asked to join and need a response.</p>
                </article>
              </section>

              <div className="admin-command-grid">
                <div className="admin-column-main">
                  <section className="card admin-spotlight-panel">
                    <div className="admin-section-head admin-section-head-tight">
                      <div>
                        <p className="admin-eyebrow">Primary queue</p>
                        <h2 className="section-heading" style={{ margin: 0 }}>
                          Needs attention
                        </h2>
                      </div>
                      <Link href="/admin/submissions" className="btn-secondary">
                        Open inbox
                      </Link>
                    </div>

                    <div className="admin-focus-split">
                      <div className="admin-focus-block">
                        <div className="admin-focus-header">
                          <h3>Pending review</h3>
                          <span className="admin-count">{pendingEntries.length}</span>
                        </div>
                        {pendingEntries.length === 0 ? (
                          <p className="admin-muted">Nothing is waiting right now.</p>
                        ) : (
                          <div className="admin-queue-list">
                            {pendingEntries.slice(0, 5).map((entry) => (
                              <Link
                                key={entry.id}
                                href={`/admin/entries/${entry.id}`}
                                className="admin-queue-row"
                              >
                                <div>
                                  <span className="admin-row-status">{entry.type}</span>
                                  <h3>{entry.title}</h3>
                                  <p>{entry.summary}</p>
                                </div>
                                <span className="admin-queue-meta">
                                  {entry.author_name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="admin-focus-block">
                        <div className="admin-focus-header">
                          <h3>Recent opportunity responses</h3>
                          <span className="admin-count">{recentResponses.length}</span>
                        </div>
                        {recentResponses.length === 0 ? (
                          <p className="admin-muted">No new responses yet.</p>
                        ) : (
                          <div className="admin-queue-list">
                            {recentResponses.slice(0, 5).map((response) => (
                              <Link
                                key={response.id}
                                href={`/admin/opportunities/${response.opportunity_id}`}
                                className="admin-queue-row"
                              >
                                <div>
                                  <span className="admin-row-status">{response.status}</span>
                                  <h3>{response.name}</h3>
                                  <p>{response.email}</p>
                                </div>
                                <span className="admin-queue-meta">
                                  {new Date(response.submitted_at).toLocaleDateString("en-US")}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="card admin-publishing-panel">
                    <div className="admin-section-head admin-section-head-tight">
                      <div>
                        <p className="admin-eyebrow">Publishing desk</p>
                        <h2 className="section-heading" style={{ margin: 0 }}>
                          Content pipeline
                        </h2>
                      </div>
                    </div>

                    <div className="admin-pipeline-grid">
                      <div className="admin-pipeline-lane">
                        <div className="admin-focus-header">
                          <h3>Drafts</h3>
                          <span className="admin-count">{draftEntries.length}</span>
                        </div>
                        {draftEntries.length === 0 ? (
                          <p className="admin-muted">No drafts in progress.</p>
                        ) : (
                          <div className="admin-queue-list">
                            {draftEntries.slice(0, 4).map((entry) => (
                              <Link
                                key={entry.id}
                                href={`/admin/entries/${entry.id}`}
                                className="admin-queue-row admin-queue-row-compact"
                              >
                                <div>
                                  <span className="admin-row-status">{entry.type}</span>
                                  <h3>{entry.title}</h3>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="admin-pipeline-lane">
                        <div className="admin-focus-header">
                          <h3>Published</h3>
                          <span className="admin-count">{publishedEntries.length}</span>
                        </div>
                        <p className="admin-muted">
                          {publishedEntries.length} items are currently visible on the site.
                        </p>
                      </div>

                      <div className="admin-pipeline-lane">
                        <div className="admin-focus-header">
                          <h3>Archive</h3>
                          <span className="admin-count">{archivedEntries.length}</span>
                        </div>
                        <p className="admin-muted">
                          Archived items stay recoverable from the edit history.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <aside className="admin-column-side">
                  <section className="card admin-sidebar-panel">
                    <div className="admin-section-head admin-section-head-tight">
                      <div>
                        <p className="admin-eyebrow">Opportunity board</p>
                        <h2 className="section-heading" style={{ margin: 0 }}>
                          Live snapshot
                        </h2>
                      </div>
                      <Link href="/admin/opportunities" className="btn-secondary">
                        Manage
                      </Link>
                    </div>
                    {opportunities.length === 0 ? (
                      <p className="admin-muted">No opportunities have been created yet.</p>
                    ) : (
                      <div className="admin-mini-list">
                        {opportunities.slice(0, 4).map((opportunity) => (
                          <Link
                            key={opportunity.id}
                            href={`/admin/opportunities/${opportunity.id}`}
                            className="admin-mini-card"
                          >
                            <span className="admin-row-status">
                              {getOpportunityKindLabel(opportunity.kind)}
                            </span>
                            <h3>{opportunity.title}</h3>
                            <p>
                              {opportunity.response_count ?? 0} responses •{" "}
                              {opportunity.published ? "published" : "draft"}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="card admin-sidebar-panel">
                    <div className="admin-section-head admin-section-head-tight">
                      <div>
                        <p className="admin-eyebrow">Join requests</p>
                        <h2 className="section-heading" style={{ margin: 0 }}>
                          Latest students
                        </h2>
                      </div>
                      <Link href="/admin/submissions" className="btn-secondary">
                        View all
                      </Link>
                    </div>
                    {joinSubmissions.length === 0 ? (
                      <p className="admin-muted">No join requests yet.</p>
                    ) : (
                      <div className="admin-mini-list">
                        {joinSubmissions.slice(0, 4).map((submission) => (
                          <article key={submission.id} className="admin-mini-card">
                            <span className="admin-row-status">{submission.grade}</span>
                            <h3>{submission.name}</h3>
                            <p>{submission.email}</p>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
