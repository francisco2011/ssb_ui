'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import ClickableLinkPlugin from '~/components/admin/editor/plugins/LinkPlugin/ClickableLinkPlugin';
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { LexicalEditor } from 'lexical';


export default function CodePreviewReadonlyEditor({ content, contents, editorTheme, shellClassName, contentClassName  }) {

  const editorConfig = {
    namespace: 'Readonly-editor',
    nodes: [
        CodeNode,
      CodeHighlightNode,
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
        queueMicrotask(() => {

          if(editor?.current){
            editor.current.setEditorState(initialEditorState)
            editor.current.setEditable(false)
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