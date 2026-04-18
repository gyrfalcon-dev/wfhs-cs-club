import { redirect } from "next/navigation";
import { EntryForm } from "@/app/admin/_components/entry-form";
import { getAdminIdentity } from "@/lib/admin-auth";
import type { ContentType } from "@/lib/content-store";

type PageProps = {
  searchParams: Promise<{ type?: string }>;
};

const isContentType = (value?: string): value is ContentType =>
  value === "project" || value === "event" || value === "devlog";

export default async function AdminNewPage({ searchParams }: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const query = await searchParams;
  const type = isContentType(query.type) ? query.type : "project";

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">New {type}</h1>
          <p className="page-subtitle">
            Create a new entry directly from the dashboard.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <EntryForm action="/api/admin/entries" type={type} />
        </div>
      </section>
    </>
  );
}
