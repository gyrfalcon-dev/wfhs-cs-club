import { notFound, redirect } from "next/navigation";
import { RouteToast } from "@/app/_components/route-toast";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
import { EntryForm } from "@/app/admin/_components/entry-form";
import { getAdminIdentity } from "@/lib/admin-auth";
import { getEntryById, getEntryVersions } from "@/lib/content-store";
import { getToastFromSearchParams } from "@/lib/redirect-toast";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ toast?: string; message?: string; toastScope?: string }>;
};

export default async function AdminEntryPage({ params, searchParams }: PageProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const { id } = await params;
  const toast = getToastFromSearchParams(await searchParams);
  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  const versions = await getEntryVersions(id);

  return (
    <>
      <AdminSectionHeader
        eyebrow="Content"
        title={`Edit ${entry.title}`}
        description="Full edit authority with restore points for previous versions."
      />

      {toast ? (
        <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
      ) : null}
      <EntryForm
        action={`/api/admin/entries/${entry.id}`}
        type={entry.type}
        entry={entry}
        versions={versions}
      />
    </>
  );
}
