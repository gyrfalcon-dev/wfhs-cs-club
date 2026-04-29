import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support the Club | WFHS CS Club",
  description:
    "Learn how local partners can help the WFHS Computer Science Club fund projects, events, and student showcases.",
};

const supportAreas = [
  "Hardware, adapters, and lab supplies that students can actually build with",
  "Competition fees, transportation, and event costs that expand what the club can attempt",
  "Food, printing, and showcase materials that make meetings and demos easier to run",
];

const sponsorBenefits = [
  "Recognition on the club site and in showcase materials when appropriate",
  "A direct way to support local students doing real technical work",
  "A simple relationship with officers and the faculty advisor instead of a complicated process",
];

export default function SponsoredPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Support the Club</h1>
          <p className="page-subtitle">
            For local partners, families, and supporters who want to help the club
            build, compete, and keep student projects moving.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div className="card" style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              Why local support matters
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              The club runs best when students can spend time building instead of
              working around missing equipment or small budget constraints. Local
              businesses, families, and community partners can make that much easier.
            </p>
          </div>

          <div className="project-grid">
            <article className="card">
              <h2 style={{ fontSize: "24px", marginBottom: "14px" }}>What support can cover</h2>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                }}
              >
                {supportAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h2 style={{ fontSize: "24px", marginBottom: "14px" }}>What sponsors can expect</h2>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                }}
              >
                {sponsorBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="homepage-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card" style={{ display: "grid", gap: "14px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: 0 }}>Start a conversation</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              If you want to help the club with funding, equipment, or event support,
              use the join form and mention that you&apos;re reaching out as a sponsor or
              community partner. An officer or the faculty advisor will follow up.
            </p>
            <div>
              <Link href="/join" className="btn-primary">
                Contact the Club
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
