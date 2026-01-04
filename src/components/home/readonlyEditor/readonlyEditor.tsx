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
import { $getRoot, $nodesOfType, EditorState, LexicalEditor, LexicalNode, TextNode } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { InlineImageNode } from '~/components/admin/editor/plugins/imagePlugin/InlineImageNode';
import { LayoutContainerNode } from '~/components/admin/editor/plugins/LayoutPlugin/LayoutContainerNode';
import { LayoutItemNode } from '~/components/admin/editor/plugins/LayoutPlugin/LayoutItemNode';


export default function ReadonlyEditor({  content, contents, editorTheme, shellClassName, contentClassName }) {

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
      LayoutItemNode
    ],
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    readonly: true,
    theme: editorTheme
  };

  const editor = useRef<LexicalEditor>(null);
  useEffect(() => {

      if (content && editor && editor.current) {

        let editorState: EditorState | null = null
        let width = ''
  
        var newState = JSON.parse(content)
        width = newState.width
  
        editorState = editor.current.parseEditorState(newState.editorState)
  
        let imageNodes: ImageNode[] = []
        let inlineImageNodes: InlineImageNode[] = []
        editorState.read(() => {
          imageNodes = $nodesOfType(ImageNode);
          inlineImageNodes = $nodesOfType(InlineImageNode);
          
        })
  
        imageNodes.forEach(c => {
          var cntnt = contents.find(d => d && d.name && d.name == c.__imgId)
  
          if (cntnt?.url) c.__src = cntnt.url
        })
  
        inlineImageNodes.forEach(c => {
          var cntnt = contents.find(d => d && d.name && d.name == c.__imgId)
  
          if (cntnt?.url) c.__src = cntnt.url
        })
        editor.current.setEditorState(editorState)
        
        editor.current.setEditable(false)
        
      }
  

  }, []);


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