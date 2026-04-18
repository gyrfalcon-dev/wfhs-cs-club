import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminIdentity } from "@/lib/admin-auth";
import { getOpportunityKindLabel, listAdminOpportunities } from "@/lib/opportunities";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ state?: string }>;
};

export default async function AdminOpportunitiesPage({ searchParams }: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const opportunities = await listAdminOpportunities();
  const query = await searchParams;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="admin-kicker">Admin</p>
          <h1 className="page-title">Manage opportunities</h1>
          <p className="page-subtitle">
            Publish signups, showcases, and member intake forms from one board.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          {query.state ? (
            <div className="status-banner status-banner-success">{query.state}</div>
          ) : null}

          <div className="admin-toolbar">
            <div>
              <p className="admin-eyebrow">Live workflow</p>
              <h2 style={{ margin: "8px 0" }}>{opportunities.length} opportunities</h2>
            </div>
            <div className="admin-actions">
              <Link href="/admin/opportunities/new" className="btn-primary">
                New opportunity
              </Link>
              <Link href="/opportunities" className="btn-secondary">
                View public board
              </Link>
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="card admin-empty-state">
              No opportunities yet. Create the first one from the admin.
            </div>
          ) : (
            <div className="opportunity-grid">
              {opportunities.map((opportunity) => (
                <Link
                  key={opportunity.id}
                  href={`/admin/opportunities/${opportunity.id}`}
                  className="card opportunity-card"
                >
                  <div className="opportunity-card-top">
                    <span className="tag">
                      {getOpportunityKindLabel(opportunity.kind)}
                    </span>
                    <span className="admin-row-status">
                      {opportunity.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h2>{opportunity.title}</h2>
                  <p className="card-summary">{opportunity.summary}</p>
                  <div className="opportunity-meta-list">
                    <span>{opportunity.status}</span>
                    <span>{opportunity.form_mode}</span>
                    <span>{opportunity.response_count ?? 0} responses</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
