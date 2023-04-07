import { $getRoot, $getSelection } from "lexical";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "../plugins/TreeView";
import theme from "./theme/EditorTheme";

const EDITOR_NODES = [
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: any) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.debug(root, selection);
  });
}

function Placeholder() {
  return (
    <div className="editor-placeholder">
      Play around with the Markdown plugin...
    </div>
  );
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}
export function Editor({ content }: { content: string }) {
  const initialConfig = {
    editorState: () => $convertFromMarkdownString(content, TRANSFORMERS),
    nodes: EDITOR_NODES,
    namespace: "Editor",
    theme,
    onError,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <ListPlugin />
      <LinkPlugin />
      <OnChangePlugin onChange={onChange} />
      <TreeViewPlugin />
    </LexicalComposer>
  );
}

export default Editor;
