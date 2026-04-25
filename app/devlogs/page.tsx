import { ContentCard } from "@/components/content-card";
import { getDevLogs } from "@/lib/content";

export const revalidate = 300;

export default async function DevLogsIndexPage() {
  const devLogs = await getDevLogs();

  const colorPalette = [
    "#6b5b77",
    "#574864",
    "#7a6d8f",
    "#8b7aa3",
    "#9e8fb5",
    "#5b4e67",
    "#7f7189",
  ];

  const getPlaceholderColor = (slug: string) => {
    const index = slug.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Dev Logs</h1>
          <p className="page-subtitle">
            Progress notes, build updates, and the occasional postmortem when a
            prototype teaches us more than we expected.
          </p>
        </div>
      </div>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          {devLogs.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              No dev logs yet. The first shipped experiment will fix that.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
              }}
            >
              {devLogs.map((devLog, index) => (
                <ContentCard
                  key={devLog.slug}
                  badge="Dev Log"
                  ctaLabel="Read update"
                  description={devLog.description}
                  href={`/devlogs/${devLog.slug}`}
                  imageUrl={devLog.coverImageUrl}
                  meta={new Date(devLog.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  placeholderColor={getPlaceholderColor(devLog.slug)}
                  revealIndex={index}
                  title={devLog.title}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
