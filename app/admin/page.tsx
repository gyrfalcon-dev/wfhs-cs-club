import Link from "next/link";
import { RouteToast } from "@/app/_components/route-toast";
import { ToastForm } from "@/app/_components/toast-form";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
import { getAdminIdentity } from "@/lib/admin-auth";
import { listDashboardEntries } from "@/lib/content-store";
import { getJoinSubmissions } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/env";
import {
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
  const openOpportunities = opportunities.filter(
    (opportunity) => opportunity.published && opportunity.status === "published",
  );

  const metrics = [
    { label: "Review", value: pendingEntries.length, detail: "Pending" },
    { label: "Drafts", value: draftEntries.length, detail: "Editing" },
    { label: "Open Calls", value: openOpportunities.length, detail: "Live" },
    { label: "Responses", value: recentResponses.length, detail: "Recent" },
    { label: "Join", value: joinSubmissions.length, detail: "Inbox" },
  ];

  return (
    <>
      {!admin ? (
        <>
          <div className="page-header editorial-header admin-auth-header">
            <div className="container">
              <p className="admin-kicker">Admin Command Center</p>
              <h1 className="page-title">Run the club with clarity</h1>
              <p className="page-subtitle">
                A minimal operations desk for publishing, review, and student follow-up.
              </p>
            </div>
          </div>

          <section className="admin-console-shell admin-auth-shell">
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

              <div className="admin-login-shell">
                <div className="admin-login-copy">
                  <p className="admin-eyebrow">Officer access</p>
                  <h2 style={{ margin: "8px 0" }}>Admin sign in</h2>
                  <p style={{ margin: 0 }}>
                    Sign in with the email and password from your Supabase Auth account.
                  </p>
                  <p className="admin-login-note">
                    Your email also needs to be on the admin allowlist.
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
            </div>
          </section>
        </>
      ) : (
        <>
          {toast ? (
            <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
          ) : null}

          {!isSupabaseConfigured && (
            <div className="status-banner status-banner-warn">
              Supabase is not configured yet. Set values in `.env.local`, run
              `supabase/schema.sql`, and reload this page.
            </div>
          )}

          <AdminSectionHeader
            eyebrow="Home"
            title="Admin home"
            description="A simple starting point for content, opportunities, responses, and join requests."
          />

          <section className="admin-metric-line" aria-label="Admin metrics">
            {metrics.map((metric) => (
              <article key={metric.label} className="admin-metric-line-item">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <em>{metric.detail}</em>
              </article>
            ))}
          </section>

          <div className="admin-stream-grid">
            <section className="admin-side-block">
              <div className="admin-focus-header">
                <h2 className="section-heading no-margin">Needs attention</h2>
              </div>
              <div className="admin-side-list">
                <Link href="/admin/content" className="admin-side-row">
                  <h3>Content review</h3>
                  <p>{pendingEntries.length} pending, {draftEntries.length} drafts</p>
                </Link>
                <Link href="/admin/responses" className="admin-side-row">
                  <h3>Opportunity responses</h3>
                  <p>{recentResponses.length} recent submissions to review</p>
                </Link>
                <Link href="/admin/submissions" className="admin-side-row">
                  <h3>Join inbox</h3>
                  <p>{joinSubmissions.length} student requests</p>
                </Link>
              </div>
            </section>

            <section className="admin-side-block">
              <div className="admin-focus-header">
                <h2 className="section-heading no-margin">Areas</h2>
              </div>
              <div className="admin-side-list">
                <Link href="/admin/content" className="admin-side-row">
                  <h3>Content</h3>
                  <p>{publishedEntries.length} published entries</p>
                </Link>
                <Link href="/admin/opportunities" className="admin-side-row">
                  <h3>Opportunities</h3>
                  <p>{openOpportunities.length} open calls</p>
                </Link>
                <Link href="/admin/responses" className="admin-side-row">
                  <h3>Responses</h3>
                  <p>Read submissions without opening editors</p>
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}
