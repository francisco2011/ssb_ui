'use client'


import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { HashtagNode } from "@lexical/hashtag";

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';


import { ImageNode } from "~/components/admin/editor/plugins/imagePlugin/ImageNode";
import { TagNode } from '~/components/admin/editor/plugins/tagsPlugin/TagNode';
import { EmojiNode } from '~/components/admin/editor/plugins/EmojisPlugin/EmojiNode';
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from "@lexical/link";
import PostModel from '~/models/PostModel';
import PostService from '~/services/PostService';
import editorTheme from '~/themes/EditorTheme';
import { useParams } from 'next/navigation';
import Editor, { ContentState } from '~/components/admin/editor/Editor';
import { InlineImageNode } from '~/components/admin/editor/plugins/imagePlugin/InlineImageNode';

import ContentMetada from '~/models/ContentMetadata';
import VerticalToolbar from "~/components/admin/editor/VerticalToolbar";
import TagSelector from "~/components/admin/tagSelector/TagSelector";
import PostPreview from "~/components/admin/editor/PostPreview";
import { Metadata } from "next";

const editorConfig = {
  namespace: 'Main Editor',
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

  const [tags, setTags] = useState<string[]>([])
  const [post, setPost] = useState<PostModel | null>(null)
  const [metadata, setMetadata] = useState<ContentMetada>({
    isPublished: false,
    imgModel: null,
    title: '',
    type: null
  })
  const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const editorRef = useRef(null);
  const descriptionEditorRef = useRef(null)

  useEffect(() => {

    const getPost = async () => {

      if (params?.id && params.id != 'none') {
        const p = await service.Get(params.id)

        setPost(p)

        const metadata: ContentMetada = {
          isPublished: p.isPublished,
          imgModel: null,// prevImg?.name && prevImg?.url ? { name: prevImg.name, src: prevImg.url } : null,
          title: p.title,
          type: p.type
        }
        setMetadata(metadata)

      } else {
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

  const updateMetadata = async (_metadata: ContentMetada) => {

    var isPublishedStateSame = metadata.isPublished == _metadata.isPublished
    setMetadata(metadata)

    if(!isPublishedStateSame && post?.id){
      await service.changePublishState(post?.id)
    }

  }

  const clearAll = () => {
    setIsClearAll(true)
  }

  const addTag = val => {
    var string_copy = (' ' + val).slice(1);

    if (tags.indexOf(string_copy) == -1) {
      setTags([...tags, string_copy])

    }
  }



  const onsave = async () => {
    if (!post) return
    if (!editorRef?.current) return;

    //@ts-ignore
    const editorState = editorRef.current.getState() as ContentState | null;
    //@ts-ignore
    const descriptionEditorState = descriptionEditorRef.current.getState() as ContentState | null;

    if (!editorState) return

    // @ts-ignore
    if (metadata.imgModel) post.contents.push({ name: metadata.imgModel.name, type: ContentType.preview })


    post.content = editorState.Content
    post.contents = editorState.Imgs
    post.title = metadata.title
    post.description = descriptionEditorState?.Content??''
    post.type = metadata.type

    const result = await service.Save(post)
    setPost({ ...post, id: result.id })

  }

  return (
    <>


      {post ?

        <>

          <main className="flex min-h-screen flex-col">

            <div className="grid grid-cols-[5%_70%_25%] w-[1200]">

              <div>
                <VerticalToolbar onsaveCallback={onsave} />
              </div>

              <div>

                <div className="collapse bg-base-200 my-5" >
                  <input type="checkbox" />
                  <div className="collapse-title text-xl font-medium">Edit Description</div>
                  <div className="collapse-content">
                    <Editor ref={descriptionEditorRef} content={post.description ?? ''} post={post} onContentDeletedCallback={() => {}}></Editor>
                  </div>
                </div>
                <div>
                  <Editor ref={editorRef} content={post.content ?? ''} post={post} onContentDeletedCallback={clearAll}></Editor>
                </div>

              </div>



              <div className='w-64 ml-2 mt-4'>

                <div className=' sticky top-3'>
                  <TagSelector externalValues={tags} isClean={isClearAll} onNewCallback={addTag} />
                </div>


                <div className=' sticky top-32'>
                  <PostPreview post={post} onChange={updateMetadata} />
                </div>

              </div>
            </div>

          </main></>

        : null
      }


    </>
  );
}