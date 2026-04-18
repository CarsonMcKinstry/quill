import { markdown } from "@codemirror/lang-markdown";
import CodeMirror from "@uiw/react-codemirror";

type EditorProps = {
  content: string;
  onChange: (content: string) => void;
};

export const Editor = ({ content, onChange }: EditorProps) => {
  return (
    <CodeMirror
      className="flex-1 overflow-scroll pb-4"
      value={content}
      height="100%"
      onChange={onChange}
      extensions={[markdown()]}
    />
  );
};
