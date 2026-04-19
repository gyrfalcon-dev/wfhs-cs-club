import { redirect } from "next/navigation";
import { OpportunityEditor } from "@/app/admin/_components/opportunity-editor";
import { getAdminIdentity } from "@/lib/admin-auth";

export default async function AdminNewOpportunityPage() {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

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
          <OpportunityEditor action="/api/admin/opportunities" />
        </div>
      </section>
    </>
  );
}
