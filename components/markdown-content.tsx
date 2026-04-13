/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  className?: string;
  markdown: string;
};

export function MarkdownContent({
  className,
  markdown,
}: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => (
            <a {...props} rel="noreferrer" target="_blank" />
          ),
          img: ({ alt, src }) => (
            <img alt={alt ?? ""} className="article-inline-image" src={src ?? ""} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
