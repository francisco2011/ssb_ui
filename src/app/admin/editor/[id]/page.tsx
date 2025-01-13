'use client'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { HashtagNode } from "@lexical/hashtag";

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';


import { ImageNode } from "~/components/admin/editor/plugins/imagePlugin/ImageNode";
import ImagesPlugin from "~/components/admin/editor/plugins/imagePlugin/ImagesPlugin";
import TagSelector from '~/components/admin/tagSelector/TagSelector';
import { TagNode } from '~/components/admin/editor/plugins/tagsPlugin/TagNode';
import TagPlugin from '~/components/admin/editor/plugins/tagsPlugin/TagPlugin';
import { EmojiNode } from '~/components/admin/editor/plugins/EmojisPlugin/EmojiNode';
import EmojisPlugin from '~/components/admin/editor/plugins/EmojisPlugin/EmojisPlugin';
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from "@lexical/link";
import CodeHighlightPlugin from '~/components/admin/editor/plugins/CodeHighlight/CodeHighlightPlugin';
import LexicalAutoLinkPlugin from '~/components/admin/editor/plugins/LinkPlugin/AutoLinkPlugin';
import ClickableLinkPlugin from '~/components/admin/editor/plugins/LinkPlugin/ClickableLinkPlugin';
import FloatingLinkEditorPlugin from '~/components/admin/editor/plugins/LinkPlugin/FloatingLinkEditorPlugin';
import { CAN_USE_DOM } from '~/components/admin/editor/plugins/shared/canUseDOM';
import LinkPlugin from '~/components/admin/editor/plugins/LinkPlugin/LinkPlugin';
import VerticalToolbarPlugin from '~/components/admin/editor/VerticalToolbar';
import PostModel from '~/models/PostModel';
import { LexicalEditor } from 'node_modules/lexical/LexicalEditor';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import PostService from '~/services/PostService';
import ContentMetada from '~/models/ContentMetadata';
import { $nodesOfType, CLEAR_EDITOR_COMMAND } from 'lexical';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import { ContentType } from '~/models/ContentType';
import editorTheme from '~/themes/EditorTheme';
import ToolbarPlugin from '~/components/admin/editor/ToolbarPlugin';
import TreeViewPlugin from '~/components/admin/editor/TreeViewPlugin';
import { useParams, useSearchParams } from 'next/navigation';
import Editor from '~/components/admin/editor/Editor';


const editorConfig = {
  namespace: 'Main Editor',
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
  // The editor theme
  theme: editorTheme,
};



export default function PostEditor() {

  const params = useParams<{ id: string; }>()
  const service = new PostService();

  const [post, setPost] = useState<PostModel | null> (null)

  useEffect(() => {
    
    const getPost = async () => {

      if(params?.id && params.id != 'none'){
        const p = await service.Get(params.id)
        
        setPost(p)
  
      }else{
        let _post: PostModel = {
          id: null,
          title: '',
          description: '',
          content: null,
          tags: [],
          type: null,
          contents: [] = [],
          createdAt: new Date(),
          isPublished: false
        };

        const p = await service.Save(_post)
        setPost(p)
      }
    }
    getPost()
    
  }, []);



  const onsaveCallback = async (post: PostModel) => {
    
    const result = await service.Save(post)
    setPost({...post, id: result.id})
  }

  const onChangePublishState = async () => {

    if(post && post.id)     await service.changePublishState(post.id)

  }
  return (
    <>

{ post ?
  <Editor onChangePublishState={onChangePublishState} post={post} onsaveCallback={onsaveCallback}></Editor> : null
} 
    

    </>
  );
}