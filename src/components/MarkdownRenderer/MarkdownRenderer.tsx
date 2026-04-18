import { marked } from "marked";
import { useMemo } from "react";

type MarkdownRendererProps = {
  content: string;
};

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const markdown = useMemo(() => {
    return marked.parse(content);
  }, [content]);

  return (
    <div
      className="h-full"
      dangerouslySetInnerHTML={{
        __html: markdown,
      }}
    ></div>
  );
};
