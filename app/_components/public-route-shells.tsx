type LoadingHeaderProps = {
  titleWidth?: string;
  subtitleWidth?: string;
};

type OpportunityDetailShellProps = {
  showForm?: boolean;
};

export function LoadingHeader({
  titleWidth = "15rem",
  subtitleWidth = "40rem",
}: LoadingHeaderProps) {
  return (
    <div className="page-header">
      <div className="container loading-shell-block">
        <div className="loading-line loading-line-title" style={{ width: titleWidth }} />
        <div className="loading-line loading-line-copy" style={{ width: subtitleWidth }} />
      </div>
    </div>
  );
}

export function LoadingCardGrid({ count = 6 }) {
  return (
    <section className="loading-shell-section">
      <div className="container">
        <div className="loading-card-grid">
          {Array.from({ length: count }).map((_, index) => (
            <article key={index} className="loading-card">
              <div className="loading-card-image" />
              <div className="loading-card-body">
                <div className="loading-pill" />
                <div className="loading-line loading-line-card-title" />
                <div className="loading-line loading-line-card-copy" />
                <div className="loading-line loading-line-card-copy short" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OpportunitiesListShell() {
  return (
    <>
      <div className="page-header opportunities-header editorial-header">
        <div className="container opportunities-hero-shell">
          <div className="opportunities-hero-copy loading-shell-stack">
            <div className="loading-line loading-line-title" style={{ width: "18rem" }} />
            <div className="loading-line loading-line-copy" style={{ width: "34rem" }} />
            <div className="loading-line loading-line-copy short" style={{ width: "26rem" }} />
          </div>
        </div>
      </div>

      <section className="opportunities-shell">
        <div className="container">
          <section className="opportunities-section">
            <div className="opportunity-feature-head">
              <div className="loading-shell-stack">
                <div className="loading-line loading-line-section-title" style={{ width: "13rem" }} />
              </div>
            </div>

            <div className="opportunity-list">
              {Array.from({ length: 4 }).map((_, index) => (
                <article
                  key={index}
                  className={`opportunity-list-row opportunity-public-card loading-opportunity-row ${
                    index === 0 ? "is-priority" : ""
                  }`}
                >
                  <div className="loading-shell-stack">
                    <div className="loading-opportunity-top">
                      <div className="loading-pill" />
                      <div className="loading-meta-chip" />
                    </div>
                    <div className="loading-line loading-line-card-title" style={{ width: "62%" }} />
                    <div className="loading-line loading-line-card-copy" />
                    <div className="loading-line loading-line-card-copy" />
                    <div className="loading-line loading-line-card-copy short" />
                    <div className="loading-opportunity-meta">
                      <div className="loading-meta-chip" />
                      <div className="loading-meta-chip" />
                    </div>
                    <div className="loading-opportunity-actions">
                      <div className="loading-pill loading-pill-button" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export function OpportunityDetailShell({
  showForm = true,
}: OpportunityDetailShellProps) {
  return (
    <>
      <div className="page-header opportunities-header">
        <div className="container opportunity-detail-hero-shell">
          <div className="loading-line loading-line-inline-link" style={{ width: "10rem" }} />
          <div className="opportunity-hero">
            <div className="loading-shell-stack">
              <div className="loading-pill" />
              <div className="loading-line loading-line-title" style={{ width: "22rem" }} />
              <div className="loading-line loading-line-copy" style={{ width: "36rem" }} />
              <div className="loading-line loading-line-copy short" style={{ width: "24rem" }} />
            </div>
            <div className="loading-meta-chip" style={{ width: "10rem" }} />
          </div>
        </div>
      </div>

      <section className="opportunity-detail-shell">
        <div className="container opportunity-detail-container">
          <article className="card opportunity-detail-card opportunity-detail-card-main loading-shell-stack">
            <div className="loading-line loading-line-card-title" style={{ width: "12rem" }} />
            <div className="loading-line loading-line-card-copy" />
            <div className="loading-line loading-line-card-copy" />
            <div className="loading-line loading-line-card-copy short" />

            {showForm ? (
              <>
                <div className="loading-line loading-line-card-title" style={{ width: "10rem" }} />
                <div className="loading-line loading-line-card-copy" />
                <div className="loading-opportunity-form">
                  <div className="loading-input" />
                  <div className="loading-input" />
                  <div className="loading-input tall" />
                  <div className="loading-pill loading-pill-button" />
                </div>
              </>
            ) : null}
          </article>
        </div>
      </section>
    </>
  );
}
