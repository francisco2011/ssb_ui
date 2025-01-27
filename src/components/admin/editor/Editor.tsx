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
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';


import { ImageNode } from "~/components/admin/editor/plugins/imagePlugin/ImageNode";
import ImagesPlugin from "~/components/admin/editor/plugins/imagePlugin/ImagesPlugin";
import TagSelector from '~/components/admin/tagSelector/TagSelector';
import { TagNode } from '~/components/admin/editor/plugins/tagsPlugin/TagNode';
import TagPlugin from '~/components/admin/editor/plugins/tagsPlugin/TagPlugin';
import { EmojiNode } from '~/components/admin/editor/plugins/EmojisPlugin/EmojiNode';
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from "@lexical/link";
import CodeHighlightPlugin from '~/components/admin/editor/plugins/CodeHighlight/CodeHighlightPlugin';
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
import ContentEditable from '~/components/ContentEditable';
import ToolBarProperties from './ToolbarProperties';
import { useObserveElementWidth } from './utils/useObserveElementWidth';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { InlineImageNode } from './plugins/imagePlugin/InlineImageNode';
import InlineImagePlugin from './plugins/imagePlugin/InlineImagePlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import TableCellResizerPlugin from './plugins/TableCellResizer';
import TableActionMenuPlugin from './plugins/TableActionMenu';
import TableHoverActionsPlugin from './plugins/TableHoverActionsPlugin';
import { DrawIOImageNode } from './plugins/DrawIOPlugin/DrawIOImageNode';
import DrawIOPlugin from './plugins/DrawIOPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin';
import { LayoutContainerNode } from './plugins/LayoutPlugin/LayoutContainerNode';
import { LayoutItemNode } from './plugins/LayoutPlugin/LayoutItemNode';
import ContentModel from '~/models/ContentModel';

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
    TableRowNode,
    DrawIOImageNode,
    LayoutContainerNode,
    LayoutItemNode
  ],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: editorTheme,

};

export type ContentState = {
  
  Content: string,
  Imgs: ContentModel[]

}

type props = {
  content: string,
  post: PostModel,
  onContentDeletedCallback: () => void
}

const Editor = forwardRef<typeof Editor, props>((props, ownRef) => {
  const [tags, setTags] = useState<string[]>([])
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  //const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const editor = useRef<LexicalEditor>(null);

useImperativeHandle(ownRef, () => ({
    getState: () : ContentState | null => {
      return getActualState()
    },

    clearAll: () => {
      if (!editor?.current) return;
      editor.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      //setIsClearAll(!isClearAll)
    }
  }));

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
    
    if (props.content && props.content != '' && editor.current) {

      let initialEditorState: EditorState | null = null

      if (props.content.startsWith('{"w')) {

        var newState = JSON.parse(props.content)
        var w = newState.width
        setContentWidthpx(w)
        initialEditorState = editor.current.parseEditorState(newState.editorState)

      } else {
        initialEditorState = editor.current.parseEditorState(props.content)
      }

      if (!initialEditorState) return

      let imageNodes: ImageNode[] = []
      initialEditorState.read(() => {
        imageNodes = $nodesOfType(ImageNode);
      })

      imageNodes.forEach(c => {
        var cntnt = props.post.contents.find(d => d && d.name && d.name == c.__imgId)

        if (cntnt?.url) c.__src = cntnt.url
      })

      queueMicrotask(() => {
        if (editor?.current) {
          editor.current.setEditorState(initialEditorState)
        }
      });
    }

  }, [props.post]);

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


  const getActualState = () : ContentState | null => {
    if (!editor?.current) return null;
    
    const editorState = editor.current.getEditorState();

    let imageNodes: ImageNode[] = []
    editorState.read(() => {
      imageNodes = $nodesOfType(ImageNode);
    })

    const imgs: ContentModel[] = []

    imageNodes.filter(c => c.__imgId).forEach(c => {
      if (c.__imgId && typeof c.__imgId === typeof '') {

        const contentType = ContentType.imgBody

        // @ts-ignore
        imgs.push({ name: c.__imgId, type: contentType })
      }
    })


    const extendedState = {
      width: contentWidthpx,
      editorState: editorState.toJSON()
    }

    const json = JSON.stringify(extendedState);


    return {
      Content: json,
      Imgs: imgs
    }
  }


  const treeActive = false

  const onChange = (data: any) => {
    //console.log(data)
  }

  const onToolbarProperties = (data: ToolBarProperties) => {
    if (data.MaxLengthpx) setContentWidthpx(data.MaxLengthpx)
  }



  const addOffsetContentWidthpx = (val) => {
    if (typeof val == typeof '' && val.indexOf('px') != -1) {
      val = val.replace('px', '')
    }

    return (Number(val) + 35) + 'px'
  }

  return (
    <>



      <div className="editor-shell">

        <LexicalComposer initialConfig={editorConfig}>

          <EditorRefPlugin editorRef={editor} />
          <ToolbarPlugin post={props.post} defaultWidth={contentWidthpx} setIsLinkEditMode={setIsLinkEditMode} onPropertiesChange={onToolbarProperties} onEditorClearCallback={props.onContentDeletedCallback} />
          <ClearEditorPlugin />
          <ListPlugin />
          <ImagesPlugin />
          <InlineImagePlugin />
          <TagPlugin onNewCallback={(c) => addTag(c)} />
          <LinkPlugin hasLinkAttributes={false} />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <LexicalAutoLinkPlugin />
          <ClickableLinkPlugin />
          <OnChangePlugin onChange={onChange} />
          <HorizontalRulePlugin />
          <TablePlugin hasCellBackgroundColor={true} hasCellMerge={true} hasHorizontalScroll={true} hasTabHandler={true} />
          <TableCellResizerPlugin />
          <DrawIOPlugin />
          <LayoutPlugin />

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
                    cellMerge={true} />

                  <TableHoverActionsPlugin
                    anchorElem={floatingAnchorElem} />
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



    </>
  );
})

export default Editor;