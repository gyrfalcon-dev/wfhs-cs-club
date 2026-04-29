import { redirect } from "next/navigation";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
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
      <AdminSectionHeader
        eyebrow="Content"
        title={`New ${type}`}
        description="Create a new entry directly from the content workspace."
      />

      <EntryForm action="/api/admin/entries" type={type} />
    </>
  );
}
