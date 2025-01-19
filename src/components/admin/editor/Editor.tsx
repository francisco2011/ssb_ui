'use client'

import 'prismjs/components/prism-csharp';
import 'prismjs/themes/prism-coy.css'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { HashtagNode } from "@lexical/hashtag";
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';


import { ImageNode } from "~/components/admin/editor/plugins/imagePlugin/ImageNode";
import ImagesPlugin from "~/components/admin/editor/plugins/imagePlugin/ImagesPlugin";
import TagSelector from '~/components/admin/tagSelector/TagSelector';
import { TagNode } from '~/components/admin/editor/plugins/tagsPlugin/TagNode';
import TagPlugin from '~/components/admin/editor/plugins/tagsPlugin/TagPlugin';
import { EmojiNode } from '~/components/admin/editor/plugins/EmojisPlugin/EmojiNode';
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from "@lexical/link";
import CodeHighlightPlugin from '~/components/admin/editor/plugins/CodeHighlight/CodeHighlightPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import LexicalAutoLinkPlugin from '~/components/admin/editor/plugins/LinkPlugin/AutoLinkPlugin';
import ClickableLinkPlugin from '~/components/admin/editor/plugins/LinkPlugin/ClickableLinkPlugin';
import FloatingLinkEditorPlugin from '~/components/admin/editor/plugins/LinkPlugin/FloatingLinkEditorPlugin';
import { CAN_USE_DOM } from '~/components/admin/editor/plugins/shared/canUseDOM';
import DraggableBlockPlugin from '~/components/admin/editor/plugins/DraggableBlockPlugin/DraggableBlockPlugin';
import LinkPlugin from '~/components/admin/editor/plugins/LinkPlugin/LinkPlugin';
import VerticalToolbarPlugin from '~/components/admin/editor/VerticalToolbar';
import { LexicalEditor } from 'node_modules/lexical/LexicalEditor';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import ContentMetada from '~/models/ContentMetadata';
import { $nodesOfType, CLEAR_EDITOR_COMMAND, EditorState } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import editorTheme from '~/themes/EditorTheme';
import ToolbarPlugin from './ToolbarPlugin';
import TreeViewPlugin from './TreeViewPlugin';
import PostModel from '~/models/PostModel';
import { ContentType } from '~/models/ContentType';
import PostPreview from './PostPreview';
import ContentEditable from '~/components/ContentEditable';

import { $generateHtmlFromNodes } from '@lexical/html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faCheck, faEye } from '@fortawesome/free-solid-svg-icons';
import ToolBarProperties from './ToolbarProperties';
import { useObserveElementWidth } from './utils/useObserveElementWidth';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin'
import { InlineImageNode } from './plugins/imagePlugin/InlineImageNode';
import InlineImagePlugin from './plugins/imagePlugin/InlineImagePlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import TableCellResizerPlugin from './plugins/TableCellResizer';
import TableActionMenuPlugin from './plugins/TableActionMenu';
import TableHoverActionsPlugin from './plugins/TableHoverActionsPlugin';

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
    LinkNode,
    HorizontalRuleNode,
    InlineImageNode,
    TableNode,
    TableCellNode,
    TableRowNode
  ],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: editorTheme,

};



export default function Editor({ onsaveCallback, post, onChangePublishState }: { onsaveCallback: (post: PostModel) => void, post: PostModel, onChangePublishState: () => void }) {
  const [tags, setTags] = useState<string[]>([])
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const editor = useRef<LexicalEditor>(null);
  const [current, setCurrentPost] = useState<PostModel>(post)
  const [metadata, setMetadata] = useState<ContentMetada>({
    description: '',
    imgModel: null,
    title: '',
    type: null
  })

  const { width, ref } = useObserveElementWidth<HTMLDivElement>();

  const [contentWidthpx, setContentWidthpx] = useState('900px')


  const addTag = val => {
    var string_copy = (' ' + val).slice(1);

    if (tags.indexOf(string_copy) == -1) {
      setTags([...tags, string_copy])

    }
  }

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);

    }
  };

  useEffect(() => {

    if (post?.content && post.content != '' && editor.current) {

      let initialEditorState: EditorState | null = null 

      if(post.content.startsWith('{"w')){

        var newState = JSON.parse(post.content)
        var w = newState.width
        setContentWidthpx(w)
        initialEditorState = editor.current.parseEditorState(newState.editorState)

      }else{
        initialEditorState = editor.current.parseEditorState(post.content)
      }

      if(!initialEditorState) return

      //

      

      let imageNodes: ImageNode[] = []
      initialEditorState.read(() => {
        imageNodes = $nodesOfType(ImageNode);
      })

      imageNodes.forEach(c => {
        var cntnt = post.contents.find(d => d && d.name && d.name == c.__imgId)

        if (cntnt?.url) c.__src = cntnt.url
      })

      const prevImg = post.contents.find(c => c.type == "preview");

      const metadata: ContentMetada = {
        description: post.description,
        imgModel: prevImg?.name && prevImg?.url ? { name: prevImg.name, src: prevImg.url } : null,
        title: post.title,
        type: post.type
      }
      setMetadata(metadata)
      setCurrentPost(post)

      queueMicrotask(() => {
        if (editor?.current) {
          editor.current.setEditorState(initialEditorState)
        }
      });


    }

  }, [post]);

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);



  //const onsave = async (metadata: ContentMetada) => {
  const onsave = async () => {

    if (!post) return
    if (tags) post.tags = tags
    if (!editor?.current) return;
    const editorState = editor.current.getEditorState();

    //find all Image Nodes

    let imageNodes: ImageNode[] = []
    editorState.read(() => {
      imageNodes = $nodesOfType(ImageNode);
    })

    imageNodes.filter(c => c.__imgId).forEach(c => {
      if (c.__imgId && typeof c.__imgId === typeof '') {

        const contentType = ContentType.imgBody

        // @ts-ignore
        post.contents.push({ name: c.__imgId, type: contentType })
      }
    })

    // @ts-ignore
    if (metadata.imgModel) post.contents.push({ name: metadata.imgModel.name, type: ContentType.preview })

    const extendedState = {
      width: contentWidthpx,
      editorState: editorState.toJSON()
    }

    const json = JSON.stringify(extendedState);

    post.content = json as any
    post.title = metadata.title
    post.description = metadata.description
    post.type = metadata.type

    setCurrentPost(post)
    onsaveCallback(post)
  }

  const clearAll = () => {
    if (!editor?.current) return;
    editor.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    setIsClearAll(!isClearAll)
  }

  const treeActive = false

  const onChange = (data: any) => {
    //console.log(data)
  }

  const onToolbarProperties = (data: ToolBarProperties) => {
    if (data.MaxLengthpx) setContentWidthpx(data.MaxLengthpx)
  }

  const onChangePublicationState = () => {
    if (!post) return
    onChangePublishState()
    current.isPublished = !current.isPublished
    setCurrentPost({ ...current })
  }

  const addOffsetContentWidthpx = (val) => {
    if(typeof val == typeof '' && val.indexOf('px') != -1){
      val = val.replace('px', '')
    }

    return  (Number(val) + 35) + 'px'
  }

  return (
    <>

      <main className="flex min-h-screen flex-col">

        <div className='flex flex-row justify-end'>

          <div className='m-2'>
            {
              current?.isPublished ? <button className="btn btn-active btn-success">
                <FontAwesomeIcon
                  icon={faCheck}
                  className=" w-4 h-4"
                />Published</button>
                : <button className="btn btn-active btn-warning"> <FontAwesomeIcon
                  icon={faCancel}
                  className=" w-4 h-4"
                />Published</button>
            }
          </div>


        </div>

        <div className="grid grid-cols-[5%_70%_25%] w-[1200]">

          <div>
            <VerticalToolbarPlugin onChangePublicationState={onChangePublicationState} onsaveCallback={onsave} onCleanCallback={clearAll} />
          </div>

          <div className="editor-shell">

            <LexicalComposer initialConfig={editorConfig}>

              <EditorRefPlugin editorRef={editor} />
              <ToolbarPlugin post={post} defaultWidth={contentWidthpx} setIsLinkEditMode={setIsLinkEditMode} onPropertiesChange={onToolbarProperties} />
              <ClearEditorPlugin />
              <ListPlugin />
              <ImagesPlugin />
              <InlineImagePlugin/>
              <TagPlugin onNewCallback={(c) => addTag(c)} />
              <LinkPlugin hasLinkAttributes={false} />
              <AutoFocusPlugin />
              <CodeHighlightPlugin />
              <LexicalAutoLinkPlugin />
              <ClickableLinkPlugin />
              <OnChangePlugin onChange={onChange} />
              <HorizontalRulePlugin/>
              <TablePlugin hasCellBackgroundColor={true} hasCellMerge={true} hasHorizontalScroll={true} hasTabHandler={true} />
              <TableCellResizerPlugin/>
              
              <div className='editor-container'>
              <div style={{ height: '700px', width: addOffsetContentWidthpx(contentWidthpx) }} ref={ref}>

                {floatingAnchorElem && !isSmallWidthViewport && (
                  <>
                    <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                    <FloatingLinkEditorPlugin
                      anchorElem={floatingAnchorElem}
                      isLinkEditMode={isLinkEditMode}
                      setIsLinkEditMode={setIsLinkEditMode}
                    />
                    <TableActionMenuPlugin 
                      anchorElem={floatingAnchorElem}
                      cellMerge={true}/>

                    <TableHoverActionsPlugin 
                      anchorElem={floatingAnchorElem}/>
                  </>
                )}
                <RichTextPlugin
                  contentEditable={
                    <div className="editor-scroller">
                      
                        <div className="editor" ref={onRef}>
                          <ContentEditable placeholder={''} />
                        </div>
                      </div>

                   
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />

                {
                  treeActive ? <TreeViewPlugin /> : null
                }
              </div>
              </div>
            </LexicalComposer>
            <div />

          </div>


          <div className='w-64 ml-2 mt-4'>

            <div className=' sticky top-3'>
              <TagSelector externalValues={tags} isClean={isClearAll} onNewCallback={addTag} />
            </div>


            <div className=' sticky top-32'>
              <PostPreview post={post} onChange={setMetadata} />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}