import { Editor } from "@/components/Editor/Editor";
import { MarkdownRenderer } from "@/components/MarkdownRenderer/MarkdownRenderer";
import sample from "@/data/sample.md";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [value, setValue] = useState(sample);

  return (
    <Group>
      <Panel>
        <Editor content={value} onChange={setValue} />
      </Panel>
      <Separator className="w-4 bg-red-500" />
      <Panel>
        <MarkdownRenderer content={value} />
      </Panel>
    </Group>
  );
}
