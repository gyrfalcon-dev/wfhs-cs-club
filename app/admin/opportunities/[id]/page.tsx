import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { OpportunityEditor } from "@/app/admin/_components/opportunity-editor";
import { getAdminIdentity } from "@/lib/admin-auth";
import {
  getOpportunityById,
  getOpportunityKindLabel,
  listOpportunityResponses,
} from "@/lib/opportunities";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ state?: string }>;
};

export default async function AdminOpportunityDetailPage({
  params,
  searchParams,
}: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const { id } = await params;
  const query = await searchParams;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  const responses = await listOpportunityResponses(id);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="admin-kicker">Opportunities</p>
          <h1 className="page-title">{opportunity.title}</h1>
          <p className="page-subtitle">
            {getOpportunityKindLabel(opportunity.kind)} • {responses.length} responses
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container opportunity-admin-layout">
          <div>
            {query.state ? (
              <div className="status-banner status-banner-success">{query.state}</div>
            ) : null}
            <OpportunityEditor
              action={`/api/admin/opportunities/${opportunity.id}`}
              opportunity={opportunity}
            />
          </div>

          <aside className="card admin-panel opportunity-response-panel">
            <div className="card-row">
              <h2 style={{ margin: 0 }}>Responses</h2>
              <Link href={`/opportunities/${opportunity.slug}`} className="btn-secondary">
                Public page
              </Link>
            </div>
            {responses.length === 0 ? (
              <p className="admin-muted">No responses yet.</p>
            ) : (
              <div className="opportunity-response-list">
                {responses.map((response) => (
                  <article key={response.id} className="card opportunity-response-card">
                    <div className="card-row">
                      <div>
                        <strong>{response.name}</strong>
                        <p className="admin-meta" style={{ margin: "6px 0 0" }}>
                          {response.email}
                        </p>
                      </div>
                      <span className="admin-row-status">{response.status}</span>
                    </div>
                    <p className="admin-meta">
                      {new Date(response.submitted_at).toLocaleString("en-US")}
                    </p>
                    <pre className="opportunity-json-preview">
                      {JSON.stringify(response.payload, null, 2)}
                    </pre>
                    {(opportunity.kind === "project_showcase" ||
                      opportunity.kind === "devlog_submission") &&
                    response.status !== "converted" ? (
                      <form
                        action={`/api/admin/opportunity-responses/${response.id}/convert`}
                        method="post"
                      >
                        <button type="submit" className="btn-secondary">
                          Convert to draft
                        </button>
                      </form>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
