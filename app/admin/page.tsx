import Link from "next/link";
import { RouteToast } from "@/app/_components/route-toast";
import { getAdminIdentity } from "@/lib/admin-auth";
import { listDashboardEntries } from "@/lib/content-store";
import { isSupabaseConfigured } from "@/lib/env";
import {
  listAdminOpportunities,
  listRecentOpportunityResponses,
} from "@/lib/opportunities";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

type PageProps = {
  searchParams: Promise<{ toast?: string; message?: string }>;
};

export const dynamic = "force-dynamic";

const bucketLabels = [
  ["pending", "Pending Review"],
  ["draft", "Drafts"],
  ["published", "Published"],
  ["archived", "Archived / Deleted"],
] as const;

export default async function AdminPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const toast = getToastFromSearchParams(query);
  const admin = await getAdminIdentity();
  const dashboard = admin ? await listDashboardEntries() : null;
  const opportunities = admin ? await listAdminOpportunities() : [];
  const recentResponses = admin ? await listRecentOpportunityResponses(6) : [];

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Admin</h1>
          <p className="page-subtitle">
            Review member submissions, publish updates, and recover mistakes
            without going through Git.
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
            <>
              <div className="admin-toolbar">
                <div>
                  <p className="admin-eyebrow">Signed in as</p>
                  <h2 style={{ margin: "8px 0" }}>{admin.email}</h2>
                </div>
                <div className="admin-actions">
                  <Link href="/admin/new?type=project" className="btn-secondary">
                    New project
                  </Link>
                  <Link href="/admin/new?type=devlog" className="btn-secondary">
                    New devlog
                  </Link>
                  <Link href="/admin/new?type=event" className="btn-secondary">
                    New event
                  </Link>
                  <Link href="/admin/opportunities/new" className="btn-secondary">
                    New opportunity
                  </Link>
                  <Link href="/admin/submissions" className="btn-secondary">
                    Join inbox
                  </Link>
                  <form action="/api/admin/logout" method="post">
                    <button type="submit" className="btn-primary submit-button">
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>

              <section style={{ marginTop: "28px" }}>
                <div className="admin-section-head">
                  <h2 className="section-heading" style={{ margin: 0 }}>
                    Opportunities
                  </h2>
                  <div className="admin-actions">
                    <span className="admin-count">{opportunities.length}</span>
                    <Link href="/admin/opportunities" className="btn-secondary">
                      Manage
                    </Link>
                  </div>
                </div>
                {opportunities.length === 0 ? (
                  <div className="card admin-empty-state">
                    No opportunities yet.
                  </div>
                ) : (
                  <div className="admin-grid">
                    {opportunities.slice(0, 4).map((opportunity) => (
                      <article key={opportunity.id} className="card admin-entry-card">
                        <p className="admin-eyebrow">{opportunity.kind}</p>
                        <h3 style={{ margin: "8px 0" }}>{opportunity.title}</h3>
                        <p style={{ marginTop: 0 }}>{opportunity.summary}</p>
                        <p className="admin-meta">
                          {opportunity.response_count ?? 0} responses ·{" "}
                          {opportunity.published ? "published" : "draft"}
                        </p>
                        <div className="admin-actions">
                          <Link
                            href={`/admin/opportunities/${opportunity.id}`}
                            className="btn-secondary"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/opportunities/${opportunity.slug}`}
                            className="btn-secondary"
                          >
                            Public page
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {bucketLabels.map(([key, label]) => {
                const items = dashboard?.[key] || [];
                return (
                  <section key={key} style={{ marginTop: "28px" }}>
                    <div className="admin-section-head">
                      <h2 className="section-heading" style={{ margin: 0 }}>
                        {label}
                      </h2>
                      <span className="admin-count">{items.length}</span>
                    </div>
                    {items.length === 0 ? (
                      <div className="card admin-empty-state">
                        Nothing in this bucket right now.
                      </div>
                    ) : (
                      <div className="admin-grid">
                        {items.map((entry) => (
                          <article key={entry.id} className="card admin-entry-card">
                            <p className="admin-eyebrow">{entry.type}</p>
                            <h3 style={{ margin: "8px 0" }}>{entry.title}</h3>
                            <p style={{ marginTop: 0 }}>{entry.summary}</p>
                            <p className="admin-meta">
                              {entry.author_name} · {entry.author_email}
                            </p>
                            <div className="admin-actions">
                              <Link
                                href={`/admin/entries/${entry.id}`}
                                className="btn-secondary"
                              >
                                Edit
                              </Link>
                              <form
                                action={`/api/admin/entries/${entry.id}`}
                                method="post"
                              >
                                <button
                                  className="btn-secondary"
                                  type="submit"
                                  name="intent"
                                  value={entry.status === "published" ? "unpublish" : "publish"}
                                >
                                  {entry.status === "published" ? "Unpublish" : "Publish"}
                                </button>
                              </form>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}

              <section style={{ marginTop: "28px" }}>
                <div className="admin-section-head">
                  <h2 className="section-heading" style={{ margin: 0 }}>
                    Recent Opportunity Responses
                  </h2>
                  <span className="admin-count">{recentResponses.length}</span>
                </div>
                {recentResponses.length === 0 ? (
                  <div className="card admin-empty-state">
                    Nothing submitted yet.
                  </div>
                ) : (
                  <div className="admin-grid">
                    {recentResponses.map((response) => (
                      <article key={response.id} className="card admin-entry-card">
                        <p className="admin-eyebrow">{response.status}</p>
                        <h3 style={{ margin: "8px 0" }}>{response.name}</h3>
                        <p style={{ marginTop: 0 }}>{response.email}</p>
                        <p className="admin-meta">
                          {new Date(response.submitted_at).toLocaleString("en-US")}
                        </p>
                        <div className="admin-actions">
                          <Link
                            href={`/admin/opportunities/${response.opportunity_id}`}
                            className="btn-secondary"
                          >
                            Open opportunity
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </section>
    </>
  );
}
