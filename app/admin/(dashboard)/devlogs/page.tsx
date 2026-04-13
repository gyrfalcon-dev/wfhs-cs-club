import Link from "next/link";
import { getAdminDevLogs } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminDevLogsPage() {
  const devLogs = await getAdminDevLogs();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Dev Logs</p>
          <h1 className="page-title">Manage dev log articles</h1>
        </div>
        <Link href="/admin/devlogs/new" className="btn-primary">
          New dev log
        </Link>
      </div>

      <div className="admin-list">
        {devLogs.map((devLog) => (
          <Link
            key={devLog.id}
            href={`/admin/devlogs/${devLog.id}`}
            className="card admin-list-card"
          >
            <div className="card-row">
              <span className="tag">dev log</span>
              <span className="admin-row-status">
                {devLog.published ? "Published" : "Draft"}
              </span>
            </div>
            <h3>{devLog.title}</h3>
            <p>{devLog.description}</p>
            <div className="admin-meta-line">
              <span>/{devLog.slug}</span>
              <span>
                {new Date(devLog.publishedAt).toLocaleDateString("en-US")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
