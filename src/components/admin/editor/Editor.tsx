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
import { LexicalEditor } from 'node_modules/lexical/LexicalEditor';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { $copyNode, $createParagraphNode, $getRoot, $insertNodes, $nodesOfType, CLEAR_EDITOR_COMMAND, EditorState, LexicalNode, TextNode } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import editorTheme from '~/themes/EditorTheme';
import ToolbarPlugin, { ToolbarConfig } from './ToolbarPlugin';
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
import LayoutPlugin from './plugins/LayoutPlugin';
import { LayoutContainerNode } from './plugins/LayoutPlugin/LayoutContainerNode';
import { LayoutItemNode } from './plugins/LayoutPlugin/LayoutItemNode';
import ContentModel from '~/models/ContentModel';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

type EditorConfiguration = {
  allowedToolBarOptions: ToolbarConfig,
  heightRem: string
}

const editorConfig = {
  namespace: 'Main Editor',
  nodes: [HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    ImageNode,
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
  contents: ContentModel[],
  post: PostModel,
  onContentDeletedCallback: () => void,
  config: EditorConfiguration
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

    toHtml: (): string => {
      return toHtml();
    },

    replaceContent: (externalContent: string, template: string) => {
      if (!editor?.current) return;
      return replaceContent(externalContent, template, editor.current)
    },

    getEditor: (): LexicalEditor | null => { return editor.current },

    getState: (): ContentState | null => {
      return getActualState()
    },

    clearAll: () => {
      if (!editor?.current) return;
      editor.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      //setIsClearAll(!isClearAll)
    }
  }));

  const { width, ref } = useObserveElementWidth<HTMLDivElement>();

  const [contentWidth, setContentWidthRem] = useState('50rem')

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
      var newState = JSON.parse(props.content)
      var w = newState.width
      setContentWidthRem(w)
      initialEditorState = editor.current.parseEditorState(newState.editorState)

      if (!initialEditorState) return

      let imageNodes: ImageNode[] = []
      let inlineImageNodes: InlineImageNode[] = []
      initialEditorState.read(() => {
        imageNodes = $nodesOfType(ImageNode);
        inlineImageNodes = $nodesOfType(InlineImageNode);
      })

      imageNodes.forEach(c => {
        var cntnt = props.contents.find(d => d && d.name && d.name == c.__imgId)

        if (cntnt?.url) c.__src = cntnt.url
      })

      inlineImageNodes.forEach(c => {
        var cntnt = props.contents.find(d => d && d.name && d.name == c.__imgId)

        if (cntnt?.url) c.__src = cntnt.url
      })

      queueMicrotask(() => {
        if (editor?.current) {
          editor.current.setEditorState(initialEditorState)
        }
      });
    }

  }, [props.content]);

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


  const getActualState = (): ContentState | null => {
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
      width: contentWidth,
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
    if (data.MaxLength) setContentWidthRem(data.MaxLength)
  }



  const addOffsetContentWidthrem = (val) => {
    if (typeof val == typeof '' && val.indexOf('rem') != -1) {
      val = val.replace('rem', '')
    }

    return (Number(val) + 2) + 'rem'
  }

  const replaceContent = (externalContentHtml: string, template: string, editor: LexicalEditor) => {

    let textNodes: TextNode[] = []
    
    editor.update(() => {

      const parser = new DOMParser();
      const dom = parser.parseFromString(externalContentHtml, 'text/html');

      // Generate Lexical nodes from the DOM
      const nodes = $generateNodesFromDOM(editor, dom);

      textNodes = $nodesOfType(TextNode);

      const paragraphNode = $createParagraphNode();

      nodes.forEach((n)=> paragraphNode.append(n))

      for (const node of textNodes) {
        const text = node.getTextContent();

        if (text == template && nodes) {

          //$insertNodes(nodes);
          //const copy = $copyNode(titleFirstNode)
          node.replace(paragraphNode)

        }
      }
    })
  }

  const toHtml = (): string => {

    if (editor?.current == null) return ''

    let htmlString = '';
    editor.current.update(() => {
      htmlString = $generateHtmlFromNodes(editor.current, null); // The second parameter is for selection, pass null for the entire content
    });
    return htmlString;
  }

  return (
    <>

      <div className="editor-shell">

        <LexicalComposer initialConfig={editorConfig}>

          <EditorRefPlugin editorRef={editor} />
          <ToolbarPlugin post={props.post}
            defaultWidth={contentWidth}
            setIsLinkEditMode={setIsLinkEditMode}
            onPropertiesChange={onToolbarProperties}
            onEditorClearCallback={props.onContentDeletedCallback}
            config={props.config.allowedToolBarOptions} />
          <ClearEditorPlugin />
          <ListPlugin />
          <ImagesPlugin />
          <InlineImagePlugin />
          <LinkPlugin hasLinkAttributes={false} />
          <LayoutPlugin />
          <DrawIOPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <LexicalAutoLinkPlugin />
          <ClickableLinkPlugin />
          <OnChangePlugin onChange={onChange} />
          <HorizontalRulePlugin />
          <TablePlugin hasCellBackgroundColor={true} hasCellMerge={true} hasHorizontalScroll={true} hasTabHandler={true} />
          <TableCellResizerPlugin />

          <div className='editor-container'>
            <div style={{ minHeight: props.config.heightRem, height: 'auto', width: addOffsetContentWidthrem(contentWidth) }} ref={ref}>

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


