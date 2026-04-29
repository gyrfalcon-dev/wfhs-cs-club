import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
import { getAdminIdentity } from "@/lib/admin-auth";
import {
  getOpportunityKindLabel,
  listAdminOpportunities,
  listRecentOpportunityResponses,
} from "@/lib/opportunities";

export const dynamic = "force-dynamic";

export default async function AdminResponsesPage() {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const [opportunities, recentResponses] = await Promise.all([
    listAdminOpportunities(),
    listRecentOpportunityResponses(12),
  ]);

  const responseQueues = opportunities
    .filter((opportunity) => (opportunity.response_count ?? 0) > 0)
    .sort((left, right) => (right.response_count ?? 0) - (left.response_count ?? 0));

  const opportunityById = new Map(opportunities.map((opportunity) => [opportunity.id, opportunity]));

  return (
    <>
      <AdminSectionHeader
        eyebrow="Responses"
        title="Review opportunity responses"
        description="Keep response review separate from editing so it is obvious where to read submissions and take action."
      />

      <div className="admin-stream-grid">
        <section className="admin-side-block">
          <div className="admin-focus-header">
            <h2 className="section-heading no-margin">Queues</h2>
            <span className="admin-count">{responseQueues.length}</span>
          </div>

          {responseQueues.length === 0 ? (
            <p className="admin-muted">No responses have come in yet.</p>
          ) : (
            <div className="admin-side-list">
              {responseQueues.map((opportunity) => (
                <Link
                  key={opportunity.id}
                  href={`/admin/responses/${opportunity.id}`}
                  className="admin-side-row"
                >
                  <span className="admin-row-status">
                    {getOpportunityKindLabel(opportunity.kind)}
                  </span>
                  <h3>{opportunity.title}</h3>
                  <p>{opportunity.response_count ?? 0} responses</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="admin-side-block">
          <div className="admin-focus-header">
            <h2 className="section-heading no-margin">Recent responses</h2>
            <span className="admin-count">{recentResponses.length}</span>
          </div>

          {recentResponses.length === 0 ? (
            <p className="admin-muted">No recent responses.</p>
          ) : (
            <div className="admin-stream-list">
              {recentResponses.map((response) => {
                const opportunity = opportunityById.get(response.opportunity_id);
                return (
                  <Link
                    key={response.id}
                    href={`/admin/responses/${response.opportunity_id}`}
                    className="admin-stream-row"
                  >
                    <div>
                      <span className="admin-row-status">{response.status}</span>
                      <h3>{response.name}</h3>
                      <p>{opportunity?.title || response.email}</p>
                    </div>
                    <span className="admin-queue-meta">
                      {new Date(response.submitted_at).toLocaleDateString("en-US")}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
