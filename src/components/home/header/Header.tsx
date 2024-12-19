import Link from "next/link";
import PostService from "~/services/PostService";
import HeroEditorTheme from '~/themes/HeroEditorTheme';
import { $generateHtmlFromNodes } from "@lexical/html";
import editorTheme from "~/themes/EditorTheme";
import { createHeadlessEditor } from '@lexical/headless';


import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { HashtagNode } from "@lexical/hashtag";

import { ImageNode } from "~/components/plugins/imagePlugin/ImageNode";
import { TagNode } from '~/components/plugins/tagsPlugin/TagNode';
import { EmojiNode } from '~/components/plugins/EmojisPlugin/EmojiNode';
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from "@lexical/link";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export default async function Header(): Promise<JSX.Element> {

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

    let html = ''

    const service = new PostService()
    const pt = await service.List(1, 0, 4, [], true)
    var content = pt && pt.length > 0 && pt[0] ? pt[0].content : null

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

    const editorState = editor.parseEditorState(content?? '')
    editor.setEditorState(editorState);

    let _html:any = null 
    editor.update(() => {
        const cleanup = setupDom();
        _html = $generateHtmlFromNodes(editor, null);
        cleanup()
      });

    

    html = _html

    return (
        <>
            <ul className="menu bg-base-200 rounded-box w-56 sticky top-0 left-0 float-start">
                <img className="mask mask-circle" src="https://64.media.tumblr.com/babc8de29c294b0b95adb2842c45df20/79b134f59e9d213e-62/s500x750/e81261d5840d3bcb4d3b6143c0ed8db41d2c5334.jpg" />

                <div className="text-emerald-100">
                    {html ?
                        <div dangerouslySetInnerHTML={{ __html: html }}></div> : null
                    }
                </div>

                <li>

                    <Link href="/home/articles">Articles</Link>

                </li>

                <li>

                    <Link href="/home/codeSnippets/">Code Snippets</Link>

                </li>

                <li>

                    <Link href="/home/randomStuff/">Random Stuff</Link>

                </li>

                <li>

                    <Link href="/home/proyects/">Proyects</Link>

                </li>


            </ul></>
    );

}