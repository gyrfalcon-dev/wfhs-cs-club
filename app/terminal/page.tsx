import Link from "next/link";
import { getDevLogs, getUpcomingEvents } from "@/lib/content";

export default function TerminalPage() {
  const events = getUpcomingEvents();
  const devlogs = getDevLogs();

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Meetups & Updates</h1>
          <p className="page-subtitle">
            Meeting notes, upcoming plans, and the occasional progress update —
            all in one place.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
            }}
          >
            {/* Events */}
            <div>
              <h2 className="section-heading">Upcoming Events</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginTop: "24px",
                }}
              >
                {events.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)" }}>
                    Nothing on the board right now. We&apos;re probably planning
                    the next one.
                  </p>
                ) : (
                  events.map((event) => (
                    <div key={event.slug} className="event-card">
                      <div className="event-date-block">
                        <div className="event-month">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </div>
                        <div className="event-day">
                          {new Date(event.date).getDate()}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            marginBottom: "4px",
                          }}
                        >
                          {event.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                            margin: "0 0 8px",
                          }}
                        >
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                          {" · "}
                          {event.location || "WFHS Lab"}
                        </p>
                        {event.description && (
                          <p
                            style={{
                              fontSize: "14px",
                              color: "var(--text-muted)",
                              margin: 0,
                            }}
                          >
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DevLogs */}
            <div>
              <h2 className="section-heading">Build Log</h2>
              <div style={{ marginTop: "24px" }}>
                {devlogs.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)" }}>
                    No dev logs yet, but that usually changes fast.
                  </p>
                ) : (
                  devlogs.map((devlog) => (
                    <article key={devlog.slug} className="devlog-article">
                      <p className="devlog-kind">{devlog.kind}</p>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          marginBottom: "6px",
                        }}
                      >
                        {devlog.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "15px",
                          color: "var(--text-secondary)",
                          marginBottom: "8px",
                        }}
                      >
                        {devlog.description}
                      </p>
                      <p
                        style={{ fontSize: "13px", color: "var(--text-muted)" }}
                      >
                        {new Date(devlog.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
