import { Suspense } from "react";
import Link from "next/link";
import { HomeSectionsShell } from "@/app/_components/public-route-shells";
import { getFeaturedProjects, getUpcomingEvents } from "@/lib/content";

const stats = [
  { label: "Members", value: "30+", detail: "Freshmen through seniors" },
  { label: "Active Projects", value: "5+", detail: "Built in parallel teams" },
  { label: "Lines Written", value: "1000+", detail: "This school year" },
];

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <section className="hero editorial-header">
        <div className="hero-bg">
          <div className="grid-overlay" />
          <div className="floating-shapes">
            <div className="shape shape-1" />
            <div className="shape shape-2" />
            <div className="shape shape-3" />
          </div>
        </div>
        <div className="hero-container">
          <h1 className="hero-title">
            <span className="title-line-1">Wake Forest High School</span>
            <span className="title-line-2">Computer Science Club</span>
          </h1>
          <p className="hero-subtitle">
            We build useful software, test ideas quickly, and share what we learn in public.
          </p>
          <div className="hero-cta-grid">
            <Link href="/terminal" className="cta-card">
              <div>
                <h3>Upcoming Events</h3>
                <p>See the next build session, deadline, or demo day</p>
              </div>
              <span className="card-arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/projects" className="cta-card">
              <div>
                <h3>Project Archive</h3>
                <p>Review what members have shipped this year</p>
              </div>
              <span className="card-arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/opportunities" className="cta-card">
              <div>
                <h3>Open Opportunities</h3>
                <p>Find active calls for showcases, help, and submissions</p>
              </div>
              <span className="card-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="full-width-text">
        <div className="container">
          <p>Serious craft, fast iteration, and real work in the open.</p>
          <p>
            WFHS CS Club turns raw ideas into live demos: web apps, bots, game builds, automations,
            and experiments that often grow into flagship projects.
          </p>
          <p>
            Whether you&apos;re writing your first line of code or already shipping products, there&apos;s room for you.
            Explore the <Link href="/projects" className="text-link">project board</Link>, meet the{" "}
            <Link href="/compilers" className="text-link">student team behind it</Link>, or{" "}
            <Link href="/join" className="text-link">join us</Link>.
          </p>
        </div>
      </section>

      <section className="homepage-section">
        <div className="container">
          <div className="stat-line">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-line-item">
                <span className="stat-number">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <p className="stat-detail">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<HomeSectionsShell />}>
        <HomeContentSections />
      </Suspense>

      <section className="homepage-section join-section">
        <div className="container">
          <h2 className="section-heading">Ready to join?</h2>
          <p className="join-copy">
            We meet Tuesdays at 3 PM in Lab C204. Bring a laptop if you can, questions either way.
          </p>
          <Link href="/join" className="btn-primary">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}

async function HomeContentSections() {
  const featuredProjects = await getFeaturedProjects();
  const upcomingEvents = await getUpcomingEvents(2);

  return (
    <>
      <section className="homepage-section homepage-section-tight-top">
        <div className="container">
          <div className="homepage-section-header">
            <h2 className="section-heading no-margin">Featured Projects</h2>
            <Link href="/projects" className="text-link text-link-strong">
              View all projects →
            </Link>
          </div>
          <div className="editorial-ledger">
            {featuredProjects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="editorial-ledger-row">
                <span className="tag">{project.projectType}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {upcomingEvents.length > 0 && (
        <section className="homepage-section events-preview-section">
          <div className="container">
            <div className="homepage-section-header">
              <h2 className="section-heading no-margin">Upcoming Events</h2>
              <Link href="/terminal" className="text-link text-link-strong">
                Full schedule →
              </Link>
            </div>
            <div className="event-list editorial-ledger">
              {upcomingEvents.map((event) => (
                <Link key={event.slug} href={`/events/${event.slug}`} className="event-card event-card-link editorial-ledger-row">
                  <div className="event-date-block">
                    <div className="event-month">
                      {new Date(event.eventAt).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </div>
                    <div className="event-day">{new Date(event.eventAt).getDate()}</div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>
                      {event.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                      {event.location || "WFHS Lab"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
