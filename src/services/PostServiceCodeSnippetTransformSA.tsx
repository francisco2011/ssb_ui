"use server"
import PostServiceSA from "./PostServiceSA";
import { createHeadlessEditor } from "@lexical/headless";
import EditorCodePreviewTheme from "~/themes/EditorCodePreviewTheme";
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { $generateHtmlFromNodes } from "@lexical/html";
import PostModelResponse from "~/models/PostModelResponse";
import { EditorState } from "lexical";

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

export default async function PostServiceCodeSnippetTransformSA(limit: number, 
                                                                offset: number, 
                                                                typeId?: number, 
                                                                tags?: string[], 
                                                                published?: boolean, 
                                                                loadContent?: boolean) : Promise<PostModelResponse> {

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

  console.log(loadContent)
    var posts = await service.List(limit, offset, typeId, tags, published, loadContent);
    
    posts.posts.forEach(c => {

      if(c.content){
        let editorState: EditorState | null = null 
        let width = ''

        var newState = JSON.parse(c.content)
        width = newState.width
        
        editorState = editor.parseEditorState(newState.editorState)

      editor.setEditorState(editorState);

      const cleanup = setupDom();
      let _html: any = null
      editor.update(() => {

        _html = $generateHtmlFromNodes(editor, null);
        c._htmlContent = _html
        c._contentWidth = width

      });

      cleanup()

      }
      
    })
    return posts

}
