import { Suspense } from "react";
import Link from "next/link";
import { LoadingHeader, LoadingList } from "@/app/_components/public-route-shells";
import { getUpcomingEvents } from "@/lib/content";

export const revalidate = 300;

export default function TerminalPage() {
  return (
    <Suspense
      fallback={
        <>
          <LoadingHeader titleWidth="10rem" subtitleWidth="34rem" />
          <LoadingList />
        </>
      }
    >
      <TerminalPageContent />
    </Suspense>
  );
}

async function TerminalPageContent() {
  const events = await getUpcomingEvents();

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">
            Upcoming meetings, demos, workshops, and any excuse to get the club
            in a room with laptops open.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div className="homepage-section-header" style={{ marginBottom: "24px" }}>
            <h2 className="section-heading no-margin">Upcoming Events</h2>
            <Link href="/devlogs" className="text-link text-link-strong">
              Open dev logs →
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {events.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>
                Nothing on the board right now. We&apos;re probably planning the
                next one.
              </p>
            ) : (
              events.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="event-card event-card-link"
                >
                  <div className="event-date-block">
                    <div className="event-month">
                      {new Date(event.eventAt).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </div>
                    <div className="event-day">
                      {new Date(event.eventAt).getDate()}
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
                      {new Date(event.eventAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                      {" · "}
                      {event.location || "WFHS Lab"}
                    </p>
                    {event.description ? (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          margin: 0,
                        }}
                      >
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
