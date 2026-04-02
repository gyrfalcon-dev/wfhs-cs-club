const leadership = [
  {
    name: "Avery Kim",
    role: "President",
    language: "Rust & TypeScript",
    initials: "AK",
  },
  {
    name: "Jordan Lee",
    role: "Vice President",
    language: "Python",
    initials: "JL",
  },
  {
    name: "Maya Patel",
    role: "Projects Lead",
    language: "C++ & Unity",
    initials: "MP",
  },
];

export default function CompilersPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">About the Club</h1>
          <p className="page-subtitle">
            We build projects, help each other get unstuck, and try to make the
            club feel welcoming no matter where you&apos;re starting from.
          </p>
        </div>
      </div>

      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <h2 className="section-heading">Leadership</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              marginTop: "32px",
            }}
          >
            {leadership.map((person) => (
              <div key={person.name} className="member-card">
                <div className="member-avatar">{person.initials}</div>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  {person.name}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--accent-green)",
                    fontWeight: 500,
                    marginBottom: "12px",
                  }}
                >
                  {person.role}
                </p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  {person.language}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="member-card featured" style={{ maxWidth: "600px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--accent-gold)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Faculty Advisor
            </h3>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Ms. Rivera
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              Ms. Rivera keeps the whole thing moving. She helps us get
              hardware, backs field trips, and makes sure our ideas do not die
              in a Google Doc. She also gives useful feedback when a project
              needs one more round of reality checking before a showcase.
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginTop: "16px",
              }}
            >
              Computer Science Department
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
