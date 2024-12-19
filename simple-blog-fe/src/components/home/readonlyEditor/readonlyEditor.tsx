'use client'



import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { HashtagNode } from "@lexical/hashtag";
import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import { ImageNode } from "~/components/plugins/imagePlugin/ImageNode";
import { TagNode } from '~/components/plugins/tagsPlugin/TagNode';
import { EmojiNode } from '~/components/plugins/EmojisPlugin/EmojiNode';
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from "@lexical/link";
import ClickableLinkPlugin from '~/components/plugins/LinkPlugin/ClickableLinkPlugin';
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { $nodesOfType, EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';


export default function ReadonlyEditor({ content, contents, editorTheme, shellClassName, contentClassName, onHtmlGenerated  }) {

  const editorConfig = {
    namespace: 'Readonly-editor',
    nodes: [HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      ImageNode,
      TagNode,
      EmojiNode,
      CodeNode,
      CodeHighlightNode,
      HashtagNode,
      AutoLinkNode,
      LinkNode
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
    
    if(content && editor.current){
        const initialEditorState = editor.current.parseEditorState(content)

        let imageNodes: ImageNode[] =[]
        initialEditorState.read(() => {
            imageNodes = $nodesOfType(ImageNode);
        })

        

        imageNodes.forEach(c => {
          var cntnt = contents.find(d => d.name == c.__imgId)

          if(cntnt) c.__src = cntnt.url
        })
        
        queueMicrotask(() => {

          if(editor?.current){
            editor.current.setEditorState(initialEditorState)
            editor.current.setEditable(false)

            initialEditorState.read(() => {
              if(editor.current){
                var html = $generateHtmlFromNodes(editor.current)
                onHtmlGenerated(html)
              }
              
            });
          }
        });


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