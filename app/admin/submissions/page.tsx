import { redirect } from "next/navigation";
import { AdminSectionHeader } from "@/app/admin/_components/admin-section-header";
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
      <AdminSectionHeader
        eyebrow="Join Inbox"
        title="Join requests"
        description="Review students who asked to join the club and follow up by email or Slack."
      />

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
    </>
  );
}
