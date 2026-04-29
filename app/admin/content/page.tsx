import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
import { getAdminIdentity } from "@/lib/admin-auth";
import { listDashboardEntries, type ContentEntry } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const typeLabel = (type: string) => {
  if (type === "project") return "Project";
  if (type === "event") return "Event";
  return "Devlog";
};

function EntryList({
  title,
  entries,
  emptyMessage,
}: {
  title: string;
  entries: ContentEntry[];
  emptyMessage: string;
}) {
  return (
    <section className="admin-side-block">
      <div className="admin-focus-header">
        <h2 className="section-heading no-margin">{title}</h2>
        <span className="admin-count">{entries.length}</span>
      </div>

      {entries.length === 0 ? (
        <p className="admin-muted">{emptyMessage}</p>
      ) : (
        <div className="admin-stream-list">
          {entries.slice(0, 8).map((entry) => (
            <Link
              key={entry.id}
              href={`/admin/entries/${entry.id}`}
              className="admin-stream-row"
            >
              <div>
                <span className="admin-row-status">{typeLabel(entry.type)}</span>
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
              </div>
              <span className="admin-queue-meta">
                {new Date(entry.updated_at).toLocaleDateString("en-US")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function AdminContentPage() {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const dashboard = await listDashboardEntries();

  return (
    <>
      <AdminSectionHeader
        eyebrow="Content"
        title="Manage content"
        description="Projects, events, and devlogs live here. Review, edit, and publish without mixing in response work."
        actions={
          <div className="admin-inline-link-list">
            <Link href="/admin/new?type=project">New project</Link>
            <Link href="/admin/new?type=event">New event</Link>
            <Link href="/admin/new?type=devlog">New devlog</Link>
          </div>
        }
      />

      <div className="admin-stream-grid admin-stream-grid-wide">
        <EntryList
          title="Pending review"
          entries={dashboard.pending}
          emptyMessage="Nothing is waiting for review."
        />
        <EntryList
          title="Drafts"
          entries={dashboard.draft}
          emptyMessage="No drafts right now."
        />
        <EntryList
          title="Published"
          entries={dashboard.published}
          emptyMessage="Nothing has been published yet."
        />
        <EntryList
          title="Archived"
          entries={dashboard.archived}
          emptyMessage="No archived entries."
        />
      </div>
    </>
  );
}
