import Markdown from "@/lib/marked/marked";
import { useMemo } from "react";

type MarkdownRendererProps = {
  content: string;
};

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const markdown = useMemo(() => {
    return Markdown.render(content, 0);
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
