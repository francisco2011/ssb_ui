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

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function setupDom() {
  const dom = new JSDOM();

  const _window = global.window;
  const _document = global.document;

  // @ts-expect-error
  global.window = dom.window;
  global.document = dom.window.document;

  return () => {
    global.window = _window;
    global.document = _document;
  };
}

export default async function PostServiceArticleTransformSA(limit: number,
  offset: number,
  typeId?: number,
  tags?: string[], published?: boolean): Promise<PostModelResponse> {

  const service = new PostServiceSA();

  const editor = createHeadlessEditor({
    namespace: 'Readonly-editor',
    nodes: [HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      TagNode,
      EmojiNode,
      CodeNode,
      CodeHighlightNode,
      HashtagNode,
      AutoLinkNode,
      LinkNode],
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    theme: HeroEditorTheme
  });

  const cleanup = setupDom();

  var posts = await service.List(limit, offset, typeId, tags, published, false);

  posts.posts.forEach(c => {

    if (c.title) {
      let editorState: EditorState | null = null

      var newState = JSON.parse(c.title)
      const width = newState.width

      editorState = editor.parseEditorState(newState.editorState)

      editor.setEditorState(editorState);

      editor.update(() => {
        const _html = $generateHtmlFromNodes(editor, null);
        c._titleHtml = { value: _html, width: width }
      });

    }

    if (c.description) {
      let editorState: EditorState | null = null

      var newState = JSON.parse(c.description)
      const width = newState.width

      editorState = editor.parseEditorState(newState.editorState)

      editor.setEditorState(editorState);

      editor.update(() => {
        const _html = $generateHtmlFromNodes(editor, null);
        c._descriptionHtml = { value: _html, width: width }
      });

    }

  })

  cleanup()
  return posts

}
