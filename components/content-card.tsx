/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type ContentCardProps = {
  badge: string;
  cardClassName?: string;
  ctaLabel?: string;
  description: string;
  href: string;
  imageUrl?: string | null;
  meta?: string;
  placeholderColor: string;
  revealIndex?: number;
  title: string;
};

export function ContentCard({
  badge,
  cardClassName,
  ctaLabel = "Open entry",
  description,
  href,
  imageUrl,
  meta,
  placeholderColor,
  revealIndex = 0,
  title,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="project-card-link content-card-reveal"
      style={
        {
          "--content-card-delay": `${revealIndex * 70}ms`,
        } as React.CSSProperties
      }
    >
      <article
        className={cardClassName ? `project-card ${cardClassName}` : "project-card"}
        style={{ display: "flex", flexDirection: "column", gap: "0" }}
      >
        <div
          className="project-card-image"
          style={{ backgroundColor: placeholderColor }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : null}
        </div>

        <div className="content-card-body">
          <div className="content-card-header">
            <span className="tag">{badge}</span>
            {meta ? <span className="content-card-meta">{meta}</span> : null}
          </div>

          <h3 className="content-card-title">{title}</h3>
          <p className="content-card-description">{description}</p>

          <div className="content-card-footer">
            <span className="text-link content-card-cta">{ctaLabel} →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
