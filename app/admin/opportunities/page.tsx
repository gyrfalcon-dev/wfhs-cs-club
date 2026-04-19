import Link from "next/link";
import { redirect } from "next/navigation";
import { RouteToast } from "@/app/_components/route-toast";
import { getAdminIdentity } from "@/lib/admin-auth";
import { getOpportunityKindLabel, listAdminOpportunities } from "@/lib/opportunities";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ toast?: string; message?: string; toastScope?: string }>;
};

export default async function AdminOpportunitiesPage({ searchParams }: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const opportunities = await listAdminOpportunities();
  const query = await searchParams;
  const toast = getToastFromSearchParams(query);

  return (
    <>
      <div className="page-header editorial-header">
        <div className="container">
          <p className="admin-kicker">Admin Opportunity Desk</p>
          <h1 className="page-title">Opportunity ledger</h1>
          <p className="page-subtitle">
            One clear list for every active and draft call, optimized for fast decisions.
          </p>
        </div>
      </div>

      <section className="admin-console-shell">
        <div className="container">
          {toast ? (
            <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
          ) : null}

          <div className="admin-command-bar-v2">
            <div>
              <p className="admin-eyebrow">Current board state</p>
              <h2 className="admin-command-title">{opportunities.length} total listings</h2>
              <p className="admin-muted" style={{ margin: 0 }}>
                Publish new calls quickly and keep every response path visible.
              </p>
            </div>
            <div className="admin-command-actions">
              <Link href="/admin/opportunities/new" className="btn-primary admin-action-btn admin-action-btn-primary">
                New opportunity
              </Link>
              <Link href="/opportunities" className="btn-secondary admin-action-btn">
                View public board
              </Link>
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="admin-empty-panel">
              No opportunities yet. Publish your first call and it will appear on the public board.
            </div>
          ) : (
            <section className="opportunity-ledger" aria-label="Opportunity ledger">
              <div className="opportunity-ledger-head">
                <span>Listing</span>
                <span>State</span>
                <span>Responses</span>
                <span>Form mode</span>
              </div>
              <div className="opportunity-ledger-body">
                {opportunities.map((opportunity) => (
                  <Link
                    key={opportunity.id}
                    href={`/admin/opportunities/${opportunity.id}`}
                    className="opportunity-ledger-row"
                  >
                    <div>
                      <p className="admin-row-status">{getOpportunityKindLabel(opportunity.kind)}</p>
                      <h2>{opportunity.title}</h2>
                      <p className="admin-muted">{opportunity.summary}</p>
                    </div>
                    <span className="opportunity-ledger-pill">
                      {opportunity.published ? "Published" : "Draft"}
                    </span>
                    <span>{opportunity.response_count ?? 0}</span>
                    <span className="opportunity-ledger-mode">{opportunity.form_mode}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
