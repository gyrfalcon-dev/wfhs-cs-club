import { notFound, redirect } from "next/navigation";
import { RouteToast } from "@/app/_components/route-toast";
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
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Edit {entry.title}</h1>
          <p className="page-subtitle">
            Full edit authority with restore points for previous versions.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          {toast ? (
            <RouteToast tone={toast.tone} message={toast.message} scope={toast.scope} />
          ) : null}
          <EntryForm
            action={`/api/admin/entries/${entry.id}`}
            type={entry.type}
            entry={entry}
            versions={versions}
          />
        </div>
      </section>
    </>
  );
}
