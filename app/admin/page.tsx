import Link from "next/link";
import { RouteToast } from "@/app/_components/route-toast";
import { QuickActionsMenu } from "@/app/admin/_components/quick-actions-menu";
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
  const adminHandle = admin?.email.split("@")[0] || admin?.email || "";

  const metrics = [
    { label: "Needs Review", value: pendingEntries.length, detail: "Queue" },
    { label: "Drafts", value: draftEntries.length, detail: "In progress" },
    { label: "Open Opportunities", value: openOpportunities.length, detail: "Active now" },
    { label: "New Responses", value: recentResponses.length, detail: "Last updates" },
    { label: "Join Inbox", value: joinSubmissions.length, detail: "Students waiting" },
  ];

  return (
    <>
      <div className="page-header editorial-header">
        <div className="container">
          <p className="admin-kicker">Admin Command Center</p>
          <h1 className="page-title">Run the club with clarity</h1>
          <p className="page-subtitle">
            A minimal operations desk for publishing, review, and student follow-up.
          </p>
        </div>
      </div>

      <section className="admin-console-shell">
        <div className="container">
          {toast ? (
            <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
          ) : null}

          {!isSupabaseConfigured && (
            <div className="status-banner status-banner-warn">
              Supabase is not configured yet. Set values in `.env.local`, run
              `supabase/schema.sql`, and reload this page.
            </div>
          )}

          {!admin ? (
            <div className="admin-login-shell">
              <div>
                <p className="admin-eyebrow">Officer access</p>
                <h2 style={{ margin: "8px 0" }}>Sign in with email and password</h2>
                <p style={{ margin: 0 }}>
                  Use a Supabase Auth account that is also listed in the admin allowlist.
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
            <div className="admin-console-grid">
              <div className="admin-console-main">
                <section className="admin-command-bar-v2">
                  <div>
                    <p className="admin-eyebrow">Signed in</p>
                    <h2 className="admin-command-title" title={admin.email}>
                      {adminHandle}
                    </h2>
                    <p className="admin-muted admin-command-copy">
                      Start with review, then publish and close the loop on responses.
                    </p>
                  </div>
                  <div className="admin-command-actions">
                    <QuickActionsMenu
                      includeSignOut
                      items={[
                        { href: "/admin/opportunities/new", label: "Start opportunity" },
                        { href: "/admin/new?type=event", label: "Create event" },
                        { href: "/admin/new?type=project", label: "Create project" },
                        { href: "/admin/new?type=devlog", label: "Create devlog" },
                        { href: "/admin/submissions", label: "Open join inbox" },
                      ]}
                    />
                  </div>
                </section>

                <section className="admin-metric-line" aria-label="Admin metrics">
                  {metrics.map((metric) => (
                    <article key={metric.label} className="admin-metric-line-item">
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                      <em>{metric.detail}</em>
                    </article>
                  ))}
                </section>

                <section className="admin-ops-ledger" aria-label="Operations ledger">
                  <div className="admin-ops-head">
                    <h2 className="section-heading no-margin">Operations ledger</h2>
                    <Link href="/admin/submissions" className="text-link">
                      Open review inbox →
                    </Link>
                  </div>
                  <div className="admin-ops-table">
                    <div className="admin-ops-row admin-ops-row-head">
                      <span>Workflow lane</span>
                      <span>Count</span>
                      <span>Direction</span>
                    </div>
                    <Link href="/admin/submissions" className="admin-ops-row">
                      <span>Pending review</span>
                      <strong>{pendingEntries.length}</strong>
                      <em>Decision needed</em>
                    </Link>
                    <Link href="/admin" className="admin-ops-row">
                      <span>Draft entries</span>
                      <strong>{draftEntries.length}</strong>
                      <em>Edit and publish</em>
                    </Link>
                    <Link href="/admin/opportunities" className="admin-ops-row">
                      <span>Open opportunities</span>
                      <strong>{openOpportunities.length}</strong>
                      <em>Collecting responses</em>
                    </Link>
                    <Link href="/admin?lane=published" className="admin-ops-row">
                      <span>Published entries</span>
                      <strong>{publishedEntries.length}</strong>
                      <em>Visible now</em>
                    </Link>
                    <Link href="/admin?lane=archived" className="admin-ops-row">
                      <span>Archived entries</span>
                      <strong>{archivedEntries.length}</strong>
                      <em>Recoverable history</em>
                    </Link>
                  </div>
                </section>

                <section className="admin-stream-grid">
                  <article className="admin-stream-pane">
                    <div className="admin-focus-header">
                      <h3>Recent opportunity responses</h3>
                      <span className="admin-count">{recentResponses.length}</span>
                    </div>
                    {recentResponses.length === 0 ? (
                      <p className="admin-muted">No new responses yet.</p>
                    ) : (
                      <div className="admin-stream-list">
                        {recentResponses.slice(0, 5).map((response) => (
                          <Link
                            key={response.id}
                            href={`/admin/opportunities/${response.opportunity_id}`}
                            className="admin-stream-row"
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
                  </article>

                  <article className="admin-stream-pane">
                    <div className="admin-focus-header">
                      <h3>Pending content submissions</h3>
                      <span className="admin-count">{pendingEntries.length}</span>
                    </div>
                    {pendingEntries.length === 0 ? (
                      <p className="admin-muted">No entries need review right now.</p>
                    ) : (
                      <div className="admin-stream-list">
                        {pendingEntries.slice(0, 5).map((entry) => (
                          <Link
                            key={entry.id}
                            href={`/admin/entries/${entry.id}`}
                            className="admin-stream-row"
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
                  </article>
                </section>
              </div>

              <aside className="admin-console-side">
                <section className="admin-side-block">
                  <div className="admin-section-head admin-section-head-tight">
                    <div>
                      <p className="admin-eyebrow">Opportunity board</p>
                      <h2 className="section-heading" style={{ margin: 0 }}>
                        Active opportunities
                      </h2>
                    </div>
                    <Link href="/admin/opportunities" className="text-link">
                      Manage →
                    </Link>
                  </div>

                  {opportunities.length === 0 ? (
                    <p className="admin-muted">No opportunities have been created yet.</p>
                  ) : (
                    <div className="admin-side-list">
                      {opportunities.slice(0, 4).map((opportunity) => (
                        <Link
                          key={opportunity.id}
                          href={`/admin/opportunities/${opportunity.id}`}
                          className="admin-side-row"
                        >
                          <span className="admin-row-status">
                            {getOpportunityKindLabel(opportunity.kind)}
                          </span>
                          <h3>{opportunity.title}</h3>
                          <p>
                            {opportunity.response_count ?? 0} responses •{" "}
                            {opportunity.published ? "Published" : "Draft"}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                <section className="admin-side-block">
                  <div className="admin-section-head admin-section-head-tight">
                    <div>
                      <p className="admin-eyebrow">Join requests</p>
                      <h2 className="section-heading" style={{ margin: 0 }}>
                        Latest students
                      </h2>
                    </div>
                    <Link href="/admin/submissions" className="text-link">
                      View all →
                    </Link>
                  </div>

                  {joinSubmissions.length === 0 ? (
                    <p className="admin-muted">No join requests yet.</p>
                  ) : (
                    <div className="admin-side-list">
                      {joinSubmissions.slice(0, 4).map((submission) => (
                        <article key={submission.id} className="admin-side-row">
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
          )}
        </div>
      </section>
    </>
  );
}
