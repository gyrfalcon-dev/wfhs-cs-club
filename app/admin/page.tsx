import Link from "next/link";
import { RouteToast } from "@/app/_components/route-toast";
import { ToastForm } from "@/app/_components/toast-form";
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
  searchParams: Promise<{ toast?: string; message?: string; toastScope?: string }>;
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
            Run the club from one place: clear queues, publish updates, and keep
            members in the loop.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          {toast ? (
            <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
          ) : null}

          {!isSupabaseConfigured && (
            <div className="status-banner status-banner-warn">
              Supabase is not configured yet. Set the values in `.env.local`,
              run the SQL in `supabase/schema.sql`, and reload this page.
            </div>
          )}

          {!admin ? (
            <div className="admin-login-shell">
              <div>
                <p className="admin-eyebrow">Officer access</p>
                <h2 style={{ margin: "8px 0" }}>Sign in with email and password</h2>
                <p style={{ margin: 0 }}>
                  Use a Supabase Auth account that is also listed in the admin
                  allowlist.
                </p>
              </div>
              <ToastForm
                action="/api/admin/login"
                method="post"
                className="admin-login-form"
                pendingMessage="Signing you in..."
                invalidMessage="Enter both your email and password."
                toastScope="admin-auth"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="officer@students.wcpss.net"
                  className="form-input"
                />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  className="form-input"
                />
                <button type="submit" className="btn-primary submit-button">
                  Sign In
                </button>
              </ToastForm>
            </div>
          ) : (
            <div className="admin-command-center">
              <section className="admin-command-strip">
                <div>
                  <p className="admin-eyebrow">Signed in as</p>
                  <h2 className="admin-command-title">{admin.email}</h2>
                  <p className="admin-muted admin-command-copy">
                    Start in the review lane, then move into publishing and
                    member follow-up.
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
                  <ToastForm
                    action="/api/admin/logout"
                    method="post"
                    pendingMessage="Signing you out..."
                    toastScope="admin-auth"
                  >
                    <button type="submit" className="btn-secondary">
                      Sign out
                    </button>
                  </ToastForm>
                </div>
              </section>

              <section className="admin-metric-rail" aria-label="Admin metrics">
                <article className="admin-metric-chip admin-metric-chip-strong">
                  <span className="admin-metric-label">Needs review</span>
                  <strong className="admin-metric-value">{pendingEntries.length}</strong>
                  <p>Pending member submissions.</p>
                </article>
                <article className="admin-metric-chip">
                  <span className="admin-metric-label">Drafts</span>
                  <strong className="admin-metric-value">{draftEntries.length}</strong>
                  <p>In-progress entries not yet live.</p>
                </article>
                <article className="admin-metric-chip">
                  <span className="admin-metric-label">Live opportunities</span>
                  <strong className="admin-metric-value">{openOpportunities.length}</strong>
                  <p>Published listings accepting responses.</p>
                </article>
                <article className="admin-metric-chip">
                  <span className="admin-metric-label">Fresh responses</span>
                  <strong className="admin-metric-value">{recentResponses.length}</strong>
                  <p>Recent applications to review.</p>
                </article>
                <article className="admin-metric-chip">
                  <span className="admin-metric-label">Join inbox</span>
                  <strong className="admin-metric-value">{joinSubmissions.length}</strong>
                  <p>Students waiting for a reply.</p>
                </article>
              </section>

              <div className="admin-workbench">
                <div className="admin-column-main">
                  <section className="admin-board">
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

                    <div className="admin-activity-split">
                      <div className="admin-activity-lane">
                        <div className="admin-focus-header">
                          <h3>Pending review</h3>
                          <span className="admin-count">{pendingEntries.length}</span>
                        </div>
                        {pendingEntries.length === 0 ? (
                          <p className="admin-muted">Nothing is waiting right now.</p>
                        ) : (
                          <div className="admin-activity-list">
                            {pendingEntries.slice(0, 5).map((entry) => (
                              <Link
                                key={entry.id}
                                href={`/admin/entries/${entry.id}`}
                                className="admin-activity-row"
                              >
                                <div>
                                  <span className="admin-row-status">{entry.type}</span>
                                  <h3>{entry.title}</h3>
                                  <p>{entry.summary}</p>
                                </div>
                                <span className="admin-queue-meta">{entry.author_name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="admin-activity-lane">
                        <div className="admin-focus-header">
                          <h3>Recent opportunity responses</h3>
                          <span className="admin-count">{recentResponses.length}</span>
                        </div>
                        {recentResponses.length === 0 ? (
                          <p className="admin-muted">No new responses yet.</p>
                        ) : (
                          <div className="admin-activity-list">
                            {recentResponses.slice(0, 5).map((response) => (
                              <Link
                                key={response.id}
                                href={`/admin/opportunities/${response.opportunity_id}`}
                                className="admin-activity-row"
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

                  <section className="admin-pipeline-board">
                    <div className="admin-section-head admin-section-head-tight">
                      <div>
                        <p className="admin-eyebrow">Publishing desk</p>
                        <h2 className="section-heading" style={{ margin: 0 }}>
                          Content pipeline
                        </h2>
                      </div>
                    </div>

                    <div className="admin-pipeline-rows">
                      <div className="admin-pipeline-row">
                        <div>
                          <p className="admin-row-status">Drafts</p>
                          <h3>{draftEntries.length} entries in progress</h3>
                        </div>
                        {draftEntries.length === 0 ? (
                          <p className="admin-muted">No drafts in progress.</p>
                        ) : (
                          <div className="admin-inline-link-list">
                            {draftEntries.slice(0, 4).map((entry) => (
                              <Link key={entry.id} href={`/admin/entries/${entry.id}`}>
                                {entry.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="admin-pipeline-row">
                        <div>
                          <p className="admin-row-status">Published</p>
                          <h3>{publishedEntries.length} items currently live</h3>
                        </div>
                        <p className="admin-muted">
                          Published entries are visible across the site now.
                        </p>
                      </div>

                      <div className="admin-pipeline-row">
                        <div>
                          <p className="admin-row-status">Archive</p>
                          <h3>{archivedEntries.length} archived entries</h3>
                        </div>
                        <p className="admin-muted">
                          Archived items can still be restored from edit history.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <aside className="admin-column-side">
                  <section className="admin-note-panel">
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
                      <div className="admin-plain-list">
                        {opportunities.slice(0, 4).map((opportunity) => (
                          <Link
                            key={opportunity.id}
                            href={`/admin/opportunities/${opportunity.id}`}
                            className="admin-plain-row"
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

                  <section className="admin-note-panel">
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
                      <div className="admin-plain-list">
                        {joinSubmissions.slice(0, 4).map((submission) => (
                          <article key={submission.id} className="admin-plain-row">
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
