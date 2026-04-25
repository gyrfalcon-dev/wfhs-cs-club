import { redirect } from "next/navigation";
import { getAdminIdentity } from "@/lib/admin-auth";
import { getJoinSubmissions } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const admin = await getAdminIdentity();
  if (!admin) {
    redirect("/admin");
  }

  const submissions = await getJoinSubmissions();

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="admin-kicker">Admin</p>
          <h1 className="page-title">Join inbox</h1>
          <p className="page-subtitle">
            Review students who asked to join the club and follow up from Slack or email.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
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
                    <span>{new Date(submission.createdAt).toLocaleString("en-US")}</span>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
