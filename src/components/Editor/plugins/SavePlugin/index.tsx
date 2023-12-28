import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical/LexicalEditorState";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { $getRoot } from "lexical";

function convertToMarkdown(editorState: EditorState): string {
  return editorState.read(() => {
    return $convertToMarkdownString(TRANSFORMERS, $getRoot());
  });
}

export default function SavePlugin({
  onSaveCallback,
}: {
  onSaveCallback: any;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return (
    <button
      onClick={() => onSaveCallback(convertToMarkdown(editor.getEditorState()))}
    >
      Save
    </button>
  );
}
