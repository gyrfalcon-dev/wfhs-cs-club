import Link from "next/link";
import { getAdminSummary } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Overview</p>
          <h1 className="page-title">Supabase content dashboard</h1>
          <p className="page-subtitle admin-subtitle">
            Publish site updates, keep article pages fresh, and review join
            submissions in one place.
          </p>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="stat-block">
          <span className="stat-number">{summary.projects}</span>
          <span className="stat-label">Projects</span>
        </div>
        <div className="stat-block">
          <span className="stat-number">{summary.events}</span>
          <span className="stat-label">Events</span>
        </div>
        <div className="stat-block">
          <span className="stat-number">{summary.devLogs}</span>
          <span className="stat-label">Dev Logs</span>
        </div>
        <div className="stat-block">
          <span className="stat-number">{summary.submissions}</span>
          <span className="stat-label">Join Submissions</span>
        </div>
      </div>

      <div className="admin-card-grid">
        <Link href="/admin/projects/new" className="card admin-action-card">
          <h3>New project</h3>
          <p>Add a project or collection and publish it to `/projects/[slug]`.</p>
        </Link>
        <Link href="/admin/events/new" className="card admin-action-card">
          <h3>New event</h3>
          <p>Create a dated event entry with a detail page under `/events/[slug]`.</p>
        </Link>
        <Link href="/admin/devlogs/new" className="card admin-action-card">
          <h3>New dev log</h3>
          <p>Write article-style updates that land at `/devlogs/[slug]`.</p>
        </Link>
        <Link href="/admin/submissions" className="card admin-action-card">
          <h3>Review join inbox</h3>
          <p>See new interest forms without leaving the site admin.</p>
        </Link>
      </div>
    </div>
  );
}
