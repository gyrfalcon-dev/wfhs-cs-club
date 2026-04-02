import Link from "next/link";
import { getFeaturedProjects, getUpcomingEvents } from "@/lib/content";

const stats = [
  { label: "Members", value: "30+", detail: "Every grade level represented" },
  {
    label: "Active Projects",
    value: "5+",
    detail: "Driven by students weekly",
  },
  { label: "Lines Written", value: "1000+", detail: "Since the fall showcase" },
];

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const upcomingEvents = getUpcomingEvents().slice(0, 2);

  return (
    <>
      {/* Hero */}
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
            Building robot AI, game labs, and hackathon projects while mentoring
            every level of coder along the way.
          </p>
          <div className="hero-cta-grid">
            <Link href="/terminal" className="cta-card">
              <div>
                <h3>Upcoming Events</h3>
                <p>See what we have planned</p>
              </div>
              <span className="card-arrow">→</span>
            </Link>
            <Link href="/projects" className="cta-card">
              <div>
                <h3>View Projects</h3>
                <p>Explore what we&apos;re building</p>
              </div>
              <span className="card-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Text */}
      <section className="full-width-text">
        <div className="container">
          <p>
            We balance rigorous problem-solving with playful experimentation.
          </p>
          <p>
            Wake Forest High School&apos;s computer science community ships real
            projects every semester — from Fallout-inspired terminals to
            autonomous robot AI. We believe the best way to learn is to build,
            break, and ship together.
          </p>
          <p>
            Whether you&apos;re writing your first line of Python or deploying
            full-stack apps, there&apos;s a place for you here. Check out our{" "}
            <Link href="/projects" className="text-link">
              active projects
            </Link>
            , meet the{" "}
            <Link href="/compilers" className="text-link">
              team
            </Link>
            , or{" "}
            <Link href="/join" className="text-link">
              join us
            </Link>{" "}
            at our next meeting.
          </p>
        </div>
      </section>

      {/* Stats */}
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

      {/* Featured Projects */}
      <section className="homepage-section homepage-section-tight-top">
        <div className="container">
          <div className="homepage-section-header">
            <h2 className="section-heading no-margin">Projects</h2>
            <Link href="/projects" className="text-link text-link-strong">
              View all →
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
                <div className="tag-list">
                  {project.stack?.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events Preview */}
      {upcomingEvents.length > 0 && (
        <section className="homepage-section events-preview-section">
          <div className="container">
            <div className="homepage-section-header">
              <h2 className="section-heading no-margin">Upcoming Events</h2>
              <Link href="/terminal" className="text-link text-link-strong">
                All events →
              </Link>
            </div>
            <div className="event-list">
              {upcomingEvents.map((event) => (
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
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join CTA */}
      <section className="homepage-section join-section">
        <div className="container">
          <h2 className="section-heading">Ready to join?</h2>
          <p className="join-copy">
            We meet Tuesdays at 3 PM in Lab C204. Bring a laptop and curiosity.
          </p>
          <Link href="/join" className="btn-primary">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
