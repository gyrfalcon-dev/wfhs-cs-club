import Link from "next/link";

export default function JoinPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Join Us</h1>
          <p className="page-subtitle">
            Tell us a little about yourself and we&apos;ll follow up with the Slack invite,
            meeting info, and a few project ideas that fit how you like to work.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          <div className="card" style={{ padding: "40px" }}>
            <form
              action="/api/join"
              method="post"
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" name="name" required className="form-input" />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div className="form-group">
                  <label className="form-label">Grade</label>
                  <input name="grade" required placeholder="e.g. 10" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <select name="experience" required className="form-input">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" required className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Message (optional)</label>
                <textarea
                  name="message"
                  rows={3}
                  className="form-input"
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                Send it over
              </button>
            </form>
          </div>

          <div
            className="card"
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ marginBottom: "4px" }}>Join the Slack</h3>
              <p>That&apos;s where most of the planning, updates, and last-minute reminders happen.</p>
            </div>
            <Link href="/join" className="btn-secondary">
              Request an invite {">"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
