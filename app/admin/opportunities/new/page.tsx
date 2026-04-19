import { redirect } from "next/navigation";
import { RouteToast } from "@/app/_components/route-toast";
import { OpportunityEditor } from "@/app/admin/_components/opportunity-editor";
import { getAdminIdentity } from "@/lib/admin-auth";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

type PageProps = {
  searchParams: Promise<{ toast?: string; message?: string; toastScope?: string }>;
};

export default async function AdminNewOpportunityPage({ searchParams }: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }
  const query = await searchParams;
  const toast = getToastFromSearchParams(query);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="admin-kicker">Opportunities</p>
          <h1 className="page-title">Create opportunity</h1>
          <p className="page-subtitle">
            Post a clear call for students with only the fields you need.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          {toast ? (
            <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
          ) : null}
          <OpportunityEditor action="/api/admin/opportunities" />
        </div>
      </section>
    </>
  );
}
