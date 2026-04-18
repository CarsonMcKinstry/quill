import { Editor } from "@/features/Editor/Editor";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [value, setValue] = useState("# Hello, World");

  return <Editor content={value} onChange={setValue} />;
}
