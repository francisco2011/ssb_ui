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
import editorTheme from '~/themes/EditorTheme';
import { useParams } from 'next/navigation';
import Editor, { ContentState } from '~/components/admin/editor/Editor';
import { InlineImageNode } from '~/components/admin/editor/plugins/imagePlugin/InlineImageNode';
import VerticalToolbar from "~/components/admin/editor/VerticalToolbar";
import SectionService from "~/services/SectionService";
import SectionModel from "~/models/SectionModel";

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

export default function SectionEditor() {

  const params = useParams<{ id: string; }>()
  const service = new SectionService();

  const [section, setSection] = useState<SectionModel | null>(null)
  
  const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const editorRef = useRef(null);
  
  useEffect(() => {

    const get = async () => {

      if (params?.id && params.id != 'none') {
        const p = await service.Get(params.id)

        setSection(p)

      } else {
        const section: SectionModel = {
          id: null,
          name: '',
          tag: '',
          content: null,
          modifiable: true
        };

        const p = await service.Save(section)
        setSection(p)
      }
    }
    get()

  }, []);


  const clearAll = () => {
    setIsClearAll(true)
  }

  const onsave = async () => {
    if (!section) return
    if (!editorRef?.current) return;

     //@ts-ignore
     const editorState = editorRef.current.getState() as ContentState | null;

     if(!editorState)return

    section.content = editorState.Content
    
    ////////////////////////////

debugger
    try{
      const result = await service.Save(section)
      setSection({ ...section, id: result.id, content: section.content })
//debugger
    }catch(error){

    }


  }

  return (
    <>


      {section ?

        <>

          <main className="flex min-h-screen flex-col">

            <div className="grid grid-cols-[5%_70%_25%] w-[75rem]">

              <div>
                <VerticalToolbar onsaveCallback={onsave} />
              </div>

              <div>


                <div>

                </div>
                <div>
                <Editor ref={editorRef}
                    content={section.content ?? ''}
                    contents={[]}
                    onContentDeletedCallback={clearAll}
                    config={{
                      heightRem: '50rem', allowedToolBarOptions: {
                        allowCode: true, allowColumn: true,
                        allowDiagram: true, allowEmogis: true,
                        allowGif: true, allowImages: true,
                        allowTable: true, allowWidthRule: true
                      }
                    }}></Editor>
                </div>

              </div>




            </div>

          </main></>

        : null
      }


    </>
  );
}