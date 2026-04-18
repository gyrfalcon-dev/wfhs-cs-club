import Link from "next/link";
import { getFeaturedProjects, getUpcomingEvents } from "@/lib/content";

const stats = [
  { label: "Members", value: "30+", detail: "Every grade level represented" },
  {
    label: "Active Projects",
    value: "5+",
    detail: "Built in small teams, then argued over in a good way",
  },
  { label: "Lines Written", value: "1000+", detail: "Since the fall showcase" },
];

export const revalidate = 300;

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();
  const upcomingEvents = await getUpcomingEvents(2);

  return (
    <>
      <section className="hero">
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
            We build games, robots, and useful little tools. Some weeks it&apos;s
            a polished showcase; some weeks it&apos;s a prototype that taught us
            something before lunch.
          </p>
          <div className="hero-cta-grid">
            <Link href="/terminal" className="cta-card">
              <div>
                <h3>Upcoming Events</h3>
                <p>Check the next meeting, sprint, or deadline</p>
              </div>
              <span className="card-arrow">→</span>
            </Link>
            <Link href="/projects" className="cta-card">
              <div>
                <h3>View Projects</h3>
                <p>See what the club has actually shipped</p>
              </div>
              <span className="card-arrow">→</span>
            </Link>
            <Link href="/opportunities" className="cta-card">
              <div>
                <h3>Open Opportunities</h3>
                <p>Volunteer, submit a dev log, or sign up for the next showcase</p>
              </div>
              <span className="card-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="full-width-text">
        <div className="container">
          <p>
            We care about solid problem-solving, but we don&apos;t treat every
            project like a lab report.
          </p>
          <p>
            Wake Forest High School&apos;s computer science club ships real
            things every semester: terminal-style web pages, Scratch games,
            robot experiments, mobile prototypes, and the occasional project
            that starts as a joke and turns into the best thing we made all
            month.
          </p>
          <p>
            Whether you&apos;re writing your first line of Python or already
            shipping full apps, there&apos;s room for you here. Browse the{" "}
            <Link href="/projects" className="text-link">
              project board
            </Link>
            , meet the{" "}
            <Link href="/compilers" className="text-link">
              people running the club
            </Link>
            , or{" "}
            <Link href="/join" className="text-link">
              jump in
            </Link>{" "}
            at the next meeting. When officers need volunteers, showcase
            entries, or event signups, the{" "}
            <Link href="/opportunities" className="text-link">
              opportunities board
            </Link>{" "}
            is where it goes.
          </p>
        </div>
      </section>

      <section className="homepage-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-block">
                <span className="stat-number">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <p className="stat-detail">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-section homepage-section-tight-top">
        <div className="container">
          <div className="homepage-section-header">
            <h2 className="section-heading no-margin">Projects</h2>
            <Link href="/projects" className="text-link text-link-strong">
              See the whole pile →
            </Link>
          </div>
          <div className="project-grid">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="card"
                style={{ textDecoration: "none" }}
              >
                <div className="card-row">
                  <span className="tag">{project.projectType}</span>
                </div>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-summary">{project.summary}</p>
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
            <div className="event-list">
              {upcomingEvents.map((event) => (
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
                  <div>
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
                        margin: 0,
                      }}
                    >
                      {event.location || "WFHS Lab"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="homepage-section join-section">
        <div className="container">
          <h2 className="section-heading">Ready to join?</h2>
          <p className="join-copy">
            We meet Tuesdays at 3 PM in Lab C204. Bring a laptop if you have
            one, and curiosity either way.
          </p>
          <Link href="/join" className="btn-primary">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
