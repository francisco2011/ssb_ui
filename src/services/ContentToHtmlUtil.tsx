"use server"
import PostServiceSA from "./PostServiceSA";
import { createHeadlessEditor } from "@lexical/headless";
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { $generateHtmlFromNodes } from "@lexical/html";
import PostModelResponse from "~/models/PostModelResponse";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { EmojiNode } from "~/components/admin/editor/plugins/EmojisPlugin/EmojiNode";
import { TagNode } from "~/components/admin/editor/plugins/tagsPlugin/TagNode";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import HeroEditorTheme from "~/themes/HeroEditorTheme";
import { EditorState } from "lexical";
import { DrawIOImageNode } from "~/components/admin/editor/plugins/DrawIOPlugin/DrawIOImageNode";
import editorTheme from "~/themes/EditorTheme";
import { ImageNode } from "~/components/admin/editor/plugins/imagePlugin/ImageNode";
import { HorizontalRuleNode } from "@lexical/extension";
import { InlineImageNode } from "~/components/admin/editor/plugins/imagePlugin/InlineImageNode";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { LayoutContainerNode } from "~/components/admin/editor/plugins/LayoutPlugin/LayoutContainerNode";
import { LayoutItemNode } from "~/components/admin/editor/plugins/LayoutPlugin/LayoutItemNode";
import { SectionNode } from "~/components/admin/editor/plugins/SectionPlugin/SectionNode";



const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function setupDom() {
  const dom = new JSDOM();

  const _window = global.window;
  const _document = global.document;

  global.window = dom.window;
  global.document = dom.window.document;

  return () => {
    global.window = _window;
    global.document = _document;
  };
}

export default async function ContentToHtmlUtil(contents:Map<string, string>): Promise<Map<string, string>> {

    const result = new Map<string, string>()

  const editor = createHeadlessEditor({
    namespace: 'Main Editor',
    nodes: [HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      ImageNode,
      EmojiNode,
      CodeNode,
      CodeHighlightNode,
      HashtagNode,
      AutoLinkNode,
      LinkNode,
      HorizontalRuleNode,
      InlineImageNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      DrawIOImageNode,
      LayoutContainerNode,
      LayoutItemNode,
      SectionNode
    ],
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    // The editor theme
    theme: editorTheme,
  
  });

  const cleanup = setupDom();

for(var cnt of contents){

    let editorState: EditorState | null = null
    var newState = JSON.parse(cnt[1])
    editorState = editor.parseEditorState(newState.editorState)

    if(!editorState) throw new Error("Conversion failed for: " + cnt[0])

    editor.setEditorState(editorState);

    editor.update(() => {
        const _html = $generateHtmlFromNodes(editor, null);
        result.set(cnt[0], _html)
      });
}



  cleanup()
  return result

}
