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
import SectionService from "~/services/SectionService";
import SectionModel from "~/models/SectionModel";
import TextInput from "~/components/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSave } from "@fortawesome/free-solid-svg-icons";

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

  const [name, setName] = useState<string>('')

  const editorRef = useRef(null);

  useEffect(() => {

    const get = async () => {

      if (params?.id && params.id != 'none') {
        const p = await service.Get(params.id)
        setSection(p)
        setName(p.name)

      } else {
        const section: SectionModel = {
          id: null,
          name: '',
          tag: '',
          content: null,
          modifiable: true,
          contentHtml: null
        };

        const p = await service.Save(section)
        setSection(p)
      }
    }
    get()

  }, []);

  const onsave = async () => {
    if (!section || !section.id) return
    if (!editorRef?.current) return;

    //@ts-ignore
    const editorState = editorRef.current.getState() as ContentState;
    //@ts-ignore
    const contentHtml = editorRef.current.toHtml() as string

    section.content = editorState.Content
    section.name = name
    section.contentHtml = contentHtml

    ////////////////////////////



    await service.Update(section.id, section)
    setSection({ ...section, content: section.content })


  }

  return (
    <>


      {section ?

        <>

          <main className="flex min-h-screen flex-col">

            <div>
              <h1 className='font-extrabold text-4xl m-4'>{name}</h1>
            </div>

            <div className="m-4">
              <TextInput onChange={setName} value={name} label="Name"></TextInput>
            </div>

            <div className="">



              <div>

                <div className='grid grid-cols-[85%_15%]'>
                  <h1 className='font-extrabold text-4xl'>{section.name}</h1>

                  <div className="flex justify-end">

                    <div className="m-1 tooltip tooltip-left" data-tip="save">
                      <button
                        className=""
                        onClick={() => {

                          onsave()
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faSave}
                          className="text-black w-8 h-8"
                        />
                      </button>
                    </div>




                  </div>
                </div>

                <div>
                  <Editor ref={editorRef}
                    content={section.content ?? ''}
                    contents={[]}
                    onContentDeletedCallback={() => { }}
                    config={{
                      heightRem: '50rem', allowedToolBarOptions: {
                        allowCode: true, allowColumn: true,
                        allowDiagram: true, allowEmogis: true,
                        allowGif: true, allowImages: true,
                        allowTable: true
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