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
      <div className="page-header">
        <div className="container">
          <p className="admin-kicker">Admin</p>
          <h1 className="page-title">Opportunity management</h1>
          <p className="page-subtitle">
            Run every listing from one ledger: publish calls, watch responses,
            and keep deadlines visible.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          {toast ? (
            <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
          ) : null}

          <div className="admin-command-strip">
            <div>
              <p className="admin-eyebrow">Live workflow</p>
              <h2 style={{ margin: "8px 0" }}>{opportunities.length} opportunities</h2>
              <p className="admin-muted" style={{ margin: 0 }}>
                Use this board as the source of truth for current club calls.
              </p>
            </div>
            <div className="admin-command-actions">
              <Link href="/admin/opportunities/new" className="btn-primary">
                New opportunity
              </Link>
              <Link href="/opportunities" className="btn-secondary">
                View public board
              </Link>
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="admin-empty-panel">
              No opportunities yet. Publish your first call and it will appear
              on the public board immediately.
            </div>
          ) : (
            <section className="opportunity-ledger" aria-label="Opportunity ledger">
              <div className="opportunity-ledger-head">
                <span>Listing</span>
                <span>Status</span>
                <span>Responses</span>
                <span>Mode</span>
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
