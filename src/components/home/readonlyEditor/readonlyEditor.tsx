'use client'



import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { HashtagNode } from "@lexical/hashtag";
import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import { ImageNode } from "~/components/admin/editor/plugins/imagePlugin/ImageNode";
import { TagNode } from '~/components/admin/editor/plugins/tagsPlugin/TagNode';
import { EmojiNode } from '~/components/admin/editor/plugins/EmojisPlugin/EmojiNode';
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from "@lexical/link";
import ClickableLinkPlugin from '~/components/admin/editor/plugins/LinkPlugin/ClickableLinkPlugin';
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { $createParagraphNode, $getRoot, $nodesOfType, EditorState, LexicalEditor, LexicalNode, TextNode } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { HorizontalRuleNode } from '@lexical/extension';
import { InlineImageNode } from '~/components/admin/editor/plugins/imagePlugin/InlineImageNode';
import { LayoutContainerNode } from '~/components/admin/editor/plugins/LayoutPlugin/LayoutContainerNode';
import { LayoutItemNode } from '~/components/admin/editor/plugins/LayoutPlugin/LayoutItemNode';
import { SectionNode } from '~/components/admin/editor/plugins/SectionPlugin/SectionNode';
import SectionService from '~/services/SectionService';
import ContentToHtmlUtil from '~/services/ContentToHtmlUtil';
import SectionModel from '~/models/SectionModel';
import { createHeadlessEditor } from '@lexical/headless';


export default function ReadonlyEditor({ post, editorTheme, shellClassName, contentClassName }) {


  const [sections, setSections] = useState<SectionModel[]>([])///TODO REPLACE BY .... BLANK IMG .... 

  const sectionEditor = createHeadlessEditor({
    namespace: 'Readonly-editor',
    nodes: [HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      ImageNode,
      InlineImageNode,
      TagNode,
      EmojiNode,
      CodeNode,
      CodeHighlightNode,
      HashtagNode,
      AutoLinkNode,
      LinkNode,
      HorizontalRuleNode,
      LayoutContainerNode,
      LayoutItemNode,
      SectionNode
    ],
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    theme: editorTheme
  });

  const editorConfig = {
    namespace: 'Readonly-editor',
    nodes: [HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      ImageNode,
      InlineImageNode,
      TagNode,
      EmojiNode,
      CodeNode,
      CodeHighlightNode,
      HashtagNode,
      AutoLinkNode,
      LinkNode,
      HorizontalRuleNode,
      LayoutContainerNode,
      LayoutItemNode,
      SectionNode
    ],
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    readonly: false,
    theme: editorTheme
  };

  const sectionService = new SectionService()
  const editor = useRef<LexicalEditor>(null);

  useEffect(() => {

    if (!post || !post.content || !editor || !editor?.current) return

    if (sections && sections.length > 0) {

      let sectionNodes: SectionNode[] = []
      editor.current?._editorState.read(() => {
        sectionNodes = $nodesOfType(SectionNode)
      })



      for (var sctCnt of sections) {

        if (!sctCnt.content && sctCnt.modifiable) continue

          var newState = JSON.parse(sctCnt.content)
          var editorState = sectionEditor.parseEditorState(newState.editorState)
          sectionEditor.setEditorState(editorState)
          
          sectionEditor.update(() => {
            const _html = $generateHtmlFromNodes(sectionEditor, null);
            sctCnt._htmlContent = _html

          });
      }



      editor.current.update(() => {
        for (var sctCnt of sections) {

          const node = sectionNodes.find(c => c.__text == sctCnt.tag)

          if (!node) continue


          const parser = new DOMParser();
          const dom = parser.parseFromString(sctCnt._htmlContent, 'text/html');
          const nodes = $generateNodesFromDOM(editor.current, dom);

          const paragraphNode = $createParagraphNode();
          paragraphNode.setStyle(node.__style);
          nodes.forEach((n) =>  paragraphNode.append(n))

          node.replace(paragraphNode)
        }
      })
      editor.current.setEditable(false)
    } else {
      let editorState: EditorState | null = null
      let width = ''

      var newState = JSON.parse(post.content)
      width = newState.width

      editorState = editor.current.parseEditorState(newState.editorState)

      //let imageNodes: ImageNode[] = []
      let inlineImageNodes: InlineImageNode[] = []
      let sectionNodes: SectionNode[] = []
      editorState.read(() => {
        //imageNodes = $nodesOfType(ImageNode);
        inlineImageNodes = $nodesOfType(InlineImageNode);
        sectionNodes = $nodesOfType(SectionNode)
      })

      //imageNodes.forEach(c => {
      //  var cntnt = contents.find(d => d && d.name && d.name == c.__imgId)

      //  if (cntnt?.url) c.__src = cntnt.url
      //})

      //lets gather sections
      var allSectionsAsStr = sectionNodes.map(c => {
        return c.__text
      })

      const loadSections = async () => {
        var tagData = await sectionService.List(allSectionsAsStr.length, 0, allSectionsAsStr, true)
        setSections(tagData.sections.filter(c => c.content))
      }

      loadSections()
      /////////////////////

      queueMicrotask(() => {
        if (editor?.current) {
          editor.current.setEditorState(editorState)

          editor.current.update(() => {
            inlineImageNodes.forEach(c => {
              var cntnt = post.contents.find(d => d && d.name && d.name == c.__imgId)

              if (cntnt?.url) c.update({ src: cntnt.url })
            })
          })

        }
      });
    }


  }, [sections]);

  return (
    <>
      <div className={shellClassName}>
        <LexicalComposer initialConfig={editorConfig} >
          <EditorRefPlugin editorRef={editor} />

          <ClickableLinkPlugin />
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className={contentClassName}>
                  <ContentEditable />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </LexicalComposer>
        <div />

      </div>





    </>
  );
}