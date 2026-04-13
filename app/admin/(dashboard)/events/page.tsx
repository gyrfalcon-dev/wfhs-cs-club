import Link from "next/link";
import { getAdminEvents } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Events</p>
          <h1 className="page-title">Manage event pages</h1>
        </div>
        <Link href="/admin/events/new" className="btn-primary">
          New event
        </Link>
      </div>

      <div className="admin-list">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/admin/events/${event.id}`}
            className="card admin-list-card"
          >
            <div className="card-row">
              <span className="tag">event</span>
              <span className="admin-row-status">
                {event.published ? "Published" : "Draft"}
              </span>
            </div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className="admin-meta-line">
              <span>/{event.slug}</span>
              <span>{new Date(event.eventAt).toLocaleDateString("en-US")}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
