import Link from "next/link";
import { redirect } from "next/navigation";
import { RouteToast } from "@/app/_components/route-toast";
import { ToastForm } from "@/app/_components/toast-form";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
import { getAdminIdentity } from "@/lib/admin-auth";
import { getOpportunityKindLabel, listAdminOpportunities } from "@/lib/opportunities";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    toast?: string;
    message?: string;
    toastScope?: string;
    filter?: string;
  }>;
};

export default async function AdminOpportunitiesPage({ searchParams }: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const opportunities = await listAdminOpportunities();
  const query = await searchParams;
  const toast = getToastFromSearchParams(query);
  const filter = query.filter || "all";

  const filteredOpportunities = opportunities.filter((opportunity) => {
    if (filter === "open") {
      return opportunity.published && opportunity.status === "published";
    }
    if (filter === "draft") {
      return !opportunity.published && opportunity.status === "draft";
    }
    if (filter === "closed") {
      return opportunity.status === "closed" && opportunity.visibility === "public";
    }
    if (filter === "archived") {
      return opportunity.visibility === "private";
    }
    return true;
  });

  return (
    <>
      <AdminSectionHeader
        eyebrow="Opportunities"
        title="Manage opportunities"
        description={`${opportunities.length} total listings. Open, close, archive, and edit calls from one list.`}
        actions={
          <div className="admin-inline-link-list">
            <Link href="/admin/responses">Review responses</Link>
            <Link href="/opportunities">Open public board</Link>
          </div>
        }
      />

      {toast ? (
        <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
      ) : null}

      <div className="admin-filter-row">
        <Link href="/admin/opportunities" className={`admin-filter-chip ${filter === "all" ? "is-active" : ""}`}>
          All
        </Link>
        <Link href="/admin/opportunities?filter=open" className={`admin-filter-chip ${filter === "open" ? "is-active" : ""}`}>
          Open
        </Link>
        <Link href="/admin/opportunities?filter=draft" className={`admin-filter-chip ${filter === "draft" ? "is-active" : ""}`}>
          Draft
        </Link>
        <Link href="/admin/opportunities?filter=closed" className={`admin-filter-chip ${filter === "closed" ? "is-active" : ""}`}>
          Closed
        </Link>
        <Link href="/admin/opportunities?filter=archived" className={`admin-filter-chip ${filter === "archived" ? "is-active" : ""}`}>
          Archived
        </Link>
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="admin-empty-panel">No opportunities in this view.</div>
      ) : (
        <section className="opportunity-ledger" aria-label="Opportunity ledger">
          <div className="opportunity-ledger-head">
            <span>Listing</span>
            <span>State</span>
            <span>Responses</span>
            <span>Form mode</span>
          </div>
          <div className="opportunity-ledger-body">
            {filteredOpportunities.map((opportunity) => (
              <article key={opportunity.id} className="opportunity-ledger-row">
                <div>
                  <p className="admin-row-status">{getOpportunityKindLabel(opportunity.kind)}</p>
                  <h2>
                    <Link href={`/admin/opportunities/${opportunity.id}`} className="opportunity-ledger-link">
                      {opportunity.title}
                    </Link>
                  </h2>
                  <p className="admin-muted">{opportunity.summary}</p>
                </div>
                <span className="opportunity-ledger-pill">
                  {opportunity.published ? "Published" : "Draft"}
                </span>
                <span>
                  <Link href={`/admin/responses/${opportunity.id}`} className="opportunity-ledger-link">
                    {opportunity.response_count ?? 0}
                  </Link>
                </span>
                <div className="opportunity-row-actions">
                  {!(opportunity.published && opportunity.status === "published") ? (
                    <ToastForm
                      action={`/api/admin/opportunities/${opportunity.id}/state`}
                      method="post"
                      pendingMessage="Opening opportunity..."
                      toastScope="opportunity-editor"
                    >
                      <input type="hidden" name="action" value="open" />
                      <input type="hidden" name="redirectTo" value={`/admin/opportunities?filter=${filter}`} />
                      <button type="submit" className="btn-secondary admin-action-btn">Open</button>
                    </ToastForm>
                  ) : (
                    <ToastForm
                      action={`/api/admin/opportunities/${opportunity.id}/state`}
                      method="post"
                      pendingMessage="Closing opportunity..."
                      toastScope="opportunity-editor"
                    >
                      <input type="hidden" name="action" value="close" />
                      <input type="hidden" name="redirectTo" value={`/admin/opportunities?filter=${filter}`} />
                      <button type="submit" className="btn-secondary admin-action-btn">Close</button>
                    </ToastForm>
                  )}
                  <ToastForm
                    action={`/api/admin/opportunities/${opportunity.id}/state`}
                    method="post"
                    pendingMessage="Archiving opportunity..."
                    toastScope="opportunity-editor"
                  >
                    <input type="hidden" name="action" value="archive" />
                    <input type="hidden" name="redirectTo" value={`/admin/opportunities?filter=${filter}`} />
                    <button type="submit" className="btn-secondary admin-action-btn">Archive</button>
                  </ToastForm>
                  <ToastForm
                    action={`/api/admin/opportunities/${opportunity.id}/state`}
                    method="post"
                    pendingMessage="Deleting opportunity..."
                    toastScope="opportunity-editor"
                  >
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="redirectTo" value={`/admin/opportunities?filter=${filter}`} />
                    <button type="submit" className="btn-secondary admin-action-btn">Delete</button>
                  </ToastForm>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
