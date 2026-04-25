type LoadingHeaderProps = {
  titleWidth?: string;
  subtitleWidth?: string;
};

type ArticleLoadingShellProps = {
  backLabel: string;
  metaCount?: number;
  showCover?: boolean;
  tag: string;
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

export function LoadingList({ count = 3 }) {
  return (
    <section className="loading-shell-section">
      <div className="container">
        <div className="loading-list">
          {Array.from({ length: count }).map((_, index) => (
            <article key={index} className="loading-list-card">
              <div className="loading-date-block">
                <div className="loading-date-chip" />
                <div className="loading-date-chip tall" />
              </div>
              <div className="loading-list-body">
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

export function ArticleLoadingShell({
  backLabel,
  metaCount = 2,
  showCover = false,
  tag,
}: ArticleLoadingShellProps) {
  return (
    <div className="article-page">
      <div className="container article-shell">
        <span className="text-link article-back-link">{backLabel}</span>

        <header className="article-hero">
          <span className="tag">{tag}</span>
          <div className="loading-line loading-line-article-title" />
          <div className="loading-line loading-line-copy" />
          <div className="loading-line loading-line-copy short" />
          <div className="article-meta-list">
            {Array.from({ length: metaCount }).map((_, index) => (
              <span key={index} className="loading-meta-chip" />
            ))}
          </div>
          {showCover ? <div className="loading-article-cover" /> : null}
        </header>

        <article className="article-prose">
          <div className="loading-prose-block">
            <div className="loading-line loading-line-prose" />
            <div className="loading-line loading-line-prose" />
            <div className="loading-line loading-line-prose short" />
          </div>
        </article>
      </div>
    </div>
  );
}

export function HomeSectionsShell() {
  return (
    <>
      <section className="homepage-section homepage-section-tight-top">
        <div className="container">
          <div className="homepage-section-header">
            <div className="loading-line loading-line-section-title" />
            <div className="loading-line loading-line-inline-link" />
          </div>
          <div className="loading-list">
            {Array.from({ length: 3 }).map((_, index) => (
              <article key={index} className="loading-list-card compact">
                <div className="loading-list-body">
                  <div className="loading-pill" />
                  <div className="loading-line loading-line-card-title" />
                  <div className="loading-line loading-line-card-copy" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-section events-preview-section">
        <div className="container">
          <div className="homepage-section-header">
            <div className="loading-line loading-line-section-title" />
            <div className="loading-line loading-line-inline-link" />
          </div>
          <div className="loading-list">
            {Array.from({ length: 2 }).map((_, index) => (
              <article key={index} className="loading-list-card">
                <div className="loading-date-block">
                  <div className="loading-date-chip" />
                  <div className="loading-date-chip tall" />
                </div>
                <div className="loading-list-body">
                  <div className="loading-line loading-line-card-title" />
                  <div className="loading-line loading-line-card-copy" />
                  <div className="loading-line loading-line-card-copy short" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
