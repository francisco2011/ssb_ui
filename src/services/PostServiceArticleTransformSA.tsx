"use server"
import PostModel from "~/models/PostModel";
import PostServiceSA from "./PostServiceSA";
import { createHeadlessEditor } from "@lexical/headless";
import EditorCodePreviewTheme from "~/themes/EditorCodePreviewTheme";
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { $generateHtmlFromNodes } from "@lexical/html";
import PostModelResponse from "~/models/PostModelResponse";

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

export default async function PostServiceArticleTransformSA(limit: number, offset: number, typeId?: number, tags?: string[], published?: boolean) : Promise<PostModelResponse> {

  const service = new PostServiceSA();

  const editor = createHeadlessEditor({
    namespace: 'Readonly-editor',
    nodes: [
      CodeNode,
      CodeHighlightNode
    ],
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    theme: EditorCodePreviewTheme
  });

    var posts = await service.List(limit, offset, typeId, tags, published);

    //posts.forEach(c => {

    //  const editorState = editor.parseEditorState(c.content ?? '')
    //  editor.setEditorState(editorState);

    //  const cleanup = setupDom();
    //  let _html: any = null
    //  editor.update(() => {

    //    _html = $generateHtmlFromNodes(editor, null);
    //    c._htmlContent = _html

    //  });

    //  cleanup()
    //})

    return posts

}
