import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RouteToast } from "@/app/_components/route-toast";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
import { OpportunityEditor } from "@/app/admin/_components/opportunity-editor";
import { getAdminIdentity } from "@/lib/admin-auth";
import {
  getOpportunityById,
  getOpportunityKindLabel,
} from "@/lib/opportunities";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ toast?: string; message?: string; toastScope?: string }>;
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
  const toast = getToastFromSearchParams(query);
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return (
    <>
      <AdminSectionHeader
        eyebrow="Opportunities"
        title={opportunity.title}
        description={getOpportunityKindLabel(opportunity.kind)}
        actions={
          <div className="admin-inline-link-list">
            <Link href={`/admin/responses/${opportunity.id}`}>Review responses</Link>
            <Link href={`/opportunities/${opportunity.slug}`}>Public page</Link>
          </div>
        }
      />

      {toast ? (
        <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
      ) : null}

      <OpportunityEditor
        action={`/api/admin/opportunities/${opportunity.id}`}
        opportunity={opportunity}
      />
    </>
  );
}
