import Link from "next/link";
import { redirect } from "next/navigation";
import { RouteToast } from "@/app/_components/route-toast";
import { ToastForm } from "@/app/_components/toast-form";
import { QuickActionsMenu } from "@/app/admin/_components/quick-actions-menu";
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
              <QuickActionsMenu
                groups={[
                  {
                    label: "Create",
                    items: [
                      { href: "/admin/opportunities/new", label: "Start opportunity" },
                      {
                        href: "/admin/opportunities/new?preset=project_showcase",
                        label: "Showcase call",
                      },
                      {
                        href: "/admin/opportunities/new?preset=devlog_submission",
                        label: "Devlog call",
                      },
                    ],
                  },
                  {
                    label: "View",
                    items: [{ href: "/opportunities", label: "Open public board" }],
                  },
                ]}
              />
            </div>
          </div>

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
            <div className="admin-empty-panel">
              No opportunities in this view.
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
                    <span>{opportunity.response_count ?? 0}</span>
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
        </div>
      </section>
    </>
  );
}
