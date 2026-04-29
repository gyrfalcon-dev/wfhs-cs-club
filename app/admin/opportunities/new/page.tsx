import { redirect } from "next/navigation";
import { RouteToast } from "@/app/_components/route-toast";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
import { OpportunityEditor } from "@/app/admin/_components/opportunity-editor";
import { getAdminIdentity } from "@/lib/admin-auth";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

type PageProps = {
  searchParams: Promise<{
    toast?: string;
    message?: string;
    toastScope?: string;
    preset?: string;
  }>;
};

export default async function AdminNewOpportunityPage({ searchParams }: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }
  const query = await searchParams;
  const toast = getToastFromSearchParams(query);
  const preset =
    query.preset === "project_showcase" || query.preset === "devlog_submission"
      ? query.preset
      : undefined;

  return (
    <>
      <AdminSectionHeader
        eyebrow="Opportunities"
        title="Create opportunity"
        description="Post a clear call for students with only the fields you need."
      />

      {toast ? (
        <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
      ) : null}
      <OpportunityEditor action="/api/admin/opportunities" presetKind={preset} />
    </>
  );
}
