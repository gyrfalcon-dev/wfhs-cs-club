import { JoinFormPanel } from "@/app/_components/join-form-panel";

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
          <JoinFormPanel />
        </div>
      </section>
    </>
  );
}
