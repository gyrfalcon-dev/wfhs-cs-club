import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ToastForm } from "@/app/_components/toast-form";
import { RouteToast } from "@/app/_components/route-toast";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
import { getAdminIdentity } from "@/lib/admin-auth";
import {
  getOpportunityById,
  getOpportunityKindLabel,
  listOpportunityResponses,
} from "@/lib/opportunities";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ toast?: string; message?: string; toastScope?: string }>;
};

export default async function AdminResponseDetailPage({
  params,
  searchParams,
}: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const { id } = await params;
  const toast = getToastFromSearchParams(await searchParams);
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  const responses = await listOpportunityResponses(id);

  return (
    <>
      <AdminSectionHeader
        eyebrow="Responses"
        title={opportunity.title}
        description={`${getOpportunityKindLabel(opportunity.kind)} · ${responses.length} responses`}
        actions={
          <div className="admin-inline-link-list">
            <Link href="/admin/responses">Back to responses</Link>
            <Link href={`/admin/opportunities/${opportunity.id}`}>Edit opportunity</Link>
            <Link href={`/opportunities/${opportunity.slug}`}>Public page</Link>
          </div>
        }
      />

      {toast ? (
        <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
      ) : null}

      {responses.length === 0 ? (
        <div className="admin-empty-panel">No responses yet.</div>
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
                <ToastForm
                  action={`/api/admin/opportunity-responses/${response.id}/convert`}
                  method="post"
                  pendingMessage="Converting response to a draft..."
                  toastScope="response-review"
                >
                  <input type="hidden" name="redirectTo" value={`/admin/responses/${opportunity.id}`} />
                  <button type="submit" className="btn-secondary">
                    Convert to draft
                  </button>
                </ToastForm>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
