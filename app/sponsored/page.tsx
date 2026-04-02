const sponsors = [
  {
    name: "Local Tech Partner",
    tier: "Platinum",
    blurb:
      "Placeholder space for a company or organization that helps fund hardware, snacks, or competition fees.",
    note: "Logo, short description, and link go here.",
  },
  {
    name: "Community Supporter",
    tier: "Gold",
    blurb:
      "A place for a local business that backs events, printing, supplies, or travel costs.",
    note: "This can become a clickable sponsor card later.",
  },
  {
    name: "In-Kind Donor",
    tier: "Supporter",
    blurb:
      "Use this for donated equipment, hosting, food, or anything that keeps the club moving.",
    note: "Placeholder only for now.",
  },
];

const perks = [
  "Show sponsor logos on a clean, visible page",
  "Include a short thank-you and what the sponsor helped make possible",
  "Rotate in featured sponsor cards for big events or project seasons",
  "Keep the wording friendly instead of overly formal",
];

export default function SponsoredPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Sponsored</h1>
          <p className="page-subtitle">
            A simple space for the people and organizations that help the club
            build, compete, and ship the good stuff.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div className="card" style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              Why this page exists
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              This page is a placeholder for sponsor info, partner shoutouts,
              and any support that helps the club keep projects moving. It can
              later hold logos, short blurbs, donation notes, or event sponsors
              without needing a redesign.
            </p>
          </div>

          <div
            className="homepage-section-header"
            style={{ marginBottom: "18px" }}
          >
            <h2 className="section-heading no-margin">
              Current placeholder sponsors
            </h2>
            <span className="text-link text-link-strong">Editable later</span>
          </div>

          <div className="project-grid">
            {sponsors.map((sponsor) => (
              <article
                key={sponsor.name}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div className="card-row">
                  <span className="tag">{sponsor.tier}</span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    Placeholder
                  </span>
                </div>
                <h3 className="card-title">{sponsor.name}</h3>
                <p className="card-summary">{sponsor.blurb}</p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  {sponsor.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card" style={{ display: "grid", gap: "14px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: 0 }}>
              What this page can do later
            </h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}
            >
              {perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
