import { getJoinSubmissions } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const submissions = await getJoinSubmissions();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Join Inbox</p>
          <h1 className="page-title">Review join submissions</h1>
        </div>
      </div>

      <div className="admin-list">
        {submissions.map((submission) => (
          <article key={submission.id} className="card admin-list-card">
            <div className="card-row">
              <h3>{submission.name}</h3>
              <span className="admin-row-status">{submission.grade}</span>
            </div>
            <p>
              <strong>Email:</strong> {submission.email}
            </p>
            <p>
              <strong>Experience:</strong> {submission.experience}
            </p>
            {submission.message ? <p>{submission.message}</p> : null}
            {submission.createdAt ? (
              <div className="admin-meta-line">
                <span>
                  {new Date(submission.createdAt).toLocaleString("en-US")}
                </span>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
