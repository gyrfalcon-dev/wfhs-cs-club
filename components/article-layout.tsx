/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ReactNode } from "react";

type ArticleLayoutProps = {
  backHref: string;
  backLabel: string;
  children: ReactNode;
  coverImageUrl?: string | null;
  meta: string[];
  summary?: string;
  tag: string;
  title: string;
};

export function ArticleLayout({
  backHref,
  backLabel,
  children,
  coverImageUrl,
  meta,
  summary,
  tag,
  title,
}: ArticleLayoutProps) {
  return (
    <div className="article-page">
      <div className="container article-shell">
        <Link href={backHref} className="text-link article-back-link">
          {backLabel}
        </Link>

        <header className="article-hero">
          <span className="tag">{tag}</span>
          <h1 className="article-title">{title}</h1>
          {summary ? <p className="article-summary">{summary}</p> : null}
          <div className="article-meta-list">
            {meta.map((entry) => (
              <span key={entry}>{entry}</span>
            ))}
          </div>
          {coverImageUrl ? (
            <div className="article-cover-frame">
              <img
                src={coverImageUrl}
                alt={title}
                className="article-cover-image"
              />
            </div>
          ) : null}
        </header>

        <article className="article-prose">{children}</article>
      </div>
    </div>
  );
}
