'use client'

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

import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';


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
import { $applyNodeReplacement, $copyNode, $createParagraphNode, $getRoot, $getSelection, $insertNodes, $nodesOfType, BaseSelection, CLEAR_EDITOR_COMMAND, EditorState, ElementFormatType, ElementNode, LexicalNode, ParagraphNode, TextNode } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import editorTheme from '~/themes/EditorTheme';
import ToolbarPlugin, { ToolbarConfig } from './ToolbarPlugin';
import TreeViewPlugin from './TreeViewPlugin';
import { ContentType } from '~/models/ContentType';
import ContentEditable from '~/components/ContentEditable';
import ToolBarProperties from './ToolbarProperties';
import { useObserveElementWidth } from './utils/useObserveElementWidth';
import { HorizontalRuleNode } from '@lexical/extension';
import { InlineImageNode, UpdateInlineImagePayload } from './plugins/imagePlugin/InlineImageNode';
import InlineImagePlugin from './plugins/imagePlugin/InlineImagePlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import TableCellResizerPlugin from './plugins/TableCellResizer';
import TableActionMenuPlugin from './plugins/TableActionMenu';
import TableHoverActionsPlugin from './plugins/TableHoverActionsPlugin';
import LayoutPlugin from './plugins/LayoutPlugin';
import { LayoutContainerNode } from './plugins/LayoutPlugin/LayoutContainerNode';
import { LayoutItemNode } from './plugins/LayoutPlugin/LayoutItemNode';
import ContentModel from '~/models/ContentModel';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import ImageInterface from './plugins/imagePlugin/ImageInterface';
import { SectionNode } from './plugins/SectionPlugin/SectionNode';
import SectionPlugin from './plugins/SectionPlugin/SectionPlugin';
import { createHeadlessEditor } from '@lexical/headless';
import { SelectionAlwaysOnDisplay } from "@lexical/react/LexicalSelectionAlwaysOnDisplay";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { CustomTableOfContentsPlugin, TableOfContentsEntry } from './plugins/TableOfContents/CustomTableOfContentsPlugin';
import { CustomTableOfContentsNode } from './plugins/TableOfContents/CustomTableOfContentsNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createCustomHeadingNode, CustomHeadingNode } from './plugins/CustomHeadingTag/CustomHeadingTagNode';
import { v4 as uuidv4 } from 'uuid';
import { WebLLMContext, WebLLMProvider } from '../webLLM/WebLLMProvider';
import { $createMyDivNode, DivNode } from './plugins/Div/DivNode';
import SectionGeneratorInterface from './SectionReplaceHelpers/SectionGeneratorInterface';

type EditorConfiguration = {
  allowedToolBarOptions: ToolbarConfig,
  heightRem: string
}

const allNodes = [
  CustomHeadingNode,
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
  LayoutContainerNode,
  LayoutItemNode,
  SectionNode,
  CustomTableOfContentsNode,
  DivNode
]

const sectionEditor = createHeadlessEditor({
  namespace: 'Readonly-editor',
  nodes: allNodes,
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  theme: editorTheme
});


const editorConfig = {
  namespace: 'Main Editor',
  nodes: allNodes,
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
  onContentDeletedCallback: () => void,
  config: EditorConfiguration,

}

const Editor = forwardRef<typeof Editor, props>((props, ownRef) => {

  const [headers, setHeaders] = useState<TableOfContentsEntry[]>([])
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const editor = useRef<LexicalEditor>(null);

  var FreezedState: EditorState | null = null;

  const theme = useContext(WebLLMContext); // theme will be 'dark' from the provider


  useImperativeHandle(ownRef, () => ({

    toHtml: (): string => {
      return toHtml();
    },

    replaceContent: (externalContent: string[], templates: string[]) => {
      if (!editor?.current) return;
      return replaceContent(externalContent, templates, editor.current)
    },

    replaceSingleContent: (sectionGenerator:SectionGeneratorInterface, tag: string) => {
      if (!editor?.current) return;

      return replaceSingleContent(sectionGenerator, tag, editor.current)
    },

    getState: (): ContentState | null => {
      return getActualState()
    },

    getStateAsString: (): string => {
      return getActualState()?.Content
    },


    clearAll: () => {
      if (!editor || !editor.current) throw new Error("Editor can not be null!");
      editor.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    },

    getAllImages: (): ImageInterface[] => {
      if (!editor?.current) return [];

      return getAllImages()
    },

    UpdateImages: (images: ContentModel[]) => {
      UpdateImages(images)
    },

    getAllSections: (): string[] => {
      return getAllSections()
    },

    freezeState: () => {
      freezeCurrentState()
    },

    restoreState: () => {
      restoreStateFromPreviousFreezedState()
    }
  }));



  const { width, ref } = useObserveElementWidth<HTMLDivElement>();



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


  const getActualState = (): ContentState => {
    if (!editor || !editor.current) throw new Error("Editor can not be null!");

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
      width: '0rem',
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
  }


  const replaceSingleContent = (sectionGenerator:SectionGeneratorInterface, tag: string, editor: LexicalEditor) => {

    editor.update(() => {

      const sectionNodes = $nodesOfType(SectionNode);

      const sectionNode = sectionNodes.find(c => c.__text == tag)
      debugger
      if (!sectionNode ) return

      var newNode = sectionGenerator.execute()
      sectionNode.replace(newNode)

    })

  }

  const replaceContent = (externalContentHtml: string[], tags: string[], editor: LexicalEditor) => {

    const parser = new DOMParser();

    editor.update(() => {

      const sectionNodes = $nodesOfType(SectionNode);

      for (let i = 0; i < tags.length; i++) {

        var tag = tags[i]
        var content = externalContentHtml[i]
        const sectionNode = sectionNodes.find(c => c.__text == tag)

        if (!content || !tag || !sectionNode) continue

        const dom = parser.parseFromString(content, 'text/html');
        // Generate Lexical nodes from the DOM
        const nodesFromDom = $generateNodesFromDOM(editor, dom);


          const firstNodeFromDom = nodesFromDom[0];
          const firstNodeFromDomAs = firstNodeFromDom as ElementNode
          const parentNode = sectionNode.getParent()
          if (parentNode) {
            const format = parentNode.getFormatType()

            if (format) firstNodeFromDomAs.setFormat(format)

            sectionNode.replace(firstNodeFromDomAs)
          }
        
      }

    })
  }

  const UpdateImages = (images: ContentModel[]) => {
    if (!editor || !editor?.current) throw new Error("Editor can not be null")

    let imageNodes: ImageNode[] = []
    let imageInLineNodes: InlineImageNode[] = []
    editor?.current.read(() => {
      imageNodes = $nodesOfType(ImageNode);
      imageInLineNodes = $nodesOfType(InlineImageNode)
    })

    editor?.current.update(() => {
      for (var img of images) {
        var foundedImgNode = imageNodes.find(c => c.__imgId == img.previousId)
        var foundedImgInLineNode = imageInLineNodes.find(c => c.__imgId == img.previousId)

        //if(foundedImgNode){
        //  if(img.name) foundedImgNode.__imgId = img.name
        //  if(img.url) foundedImgNode.__src = img.url

        //} 
        if (foundedImgInLineNode) {

          var updateObj: UpdateInlineImagePayload = {}
          if (img.name) updateObj.imgId = img.name
          if (img.url) updateObj.src = img.url
          foundedImgInLineNode.update(updateObj)
        }
      }
    }, { discrete: true })

  }

  const getAllImages = (): ImageInterface[] => {
    if (!editor || !editor?.current) throw new Error("Editor can not be null")

    let imageNodes: ImageNode[] = []
    let imageInLineNodes: InlineImageNode[] = []
    editor?.current.read(() => {
      imageNodes = $nodesOfType(ImageNode);
      imageInLineNodes = $nodesOfType(InlineImageNode)
    })

    return [...imageNodes.map(c => c.toImageInterface()),
    ...imageInLineNodes.map(c => c.toImageInterface())]

  }

  const getAllSections = (): string[] => {
    if (!editor || !editor.current) throw new Error("Editor can not be null")

    let sectionNodes: SectionNode[] = []
    editor.current.read(() => {
      sectionNodes = $nodesOfType(SectionNode)
    })

    return sectionNodes.map(c => c.__text)

  }

  const toHtml = (): string => {

    const editor = getEditor()

    let htmlString = '';
    editor.update(() => {
      htmlString = $generateHtmlFromNodes(editor, null); // The second parameter is for selection, pass null for the entire content
    });
    return htmlString;
  }

  const freezeCurrentState = () => {

    const editor = getEditor()

    editor.update(() => {
      FreezedState = editor._editorState // The second parameter is for selection, pass null for the entire content
    });
  }

  const restoreStateFromPreviousFreezedState = () => {

    if (!FreezedState) throw new Error("Freezed state is null!")
    const editor = getEditor()

    editor.update(() => {
      editor.setEditorState(FreezedState as EditorState) // The second parameter is for selection, pass null for the entire content
    });

  }

  const getEditor = (): LexicalEditor => {
    if (!editor || !editor?.current) throw new Error("Editor can not be null")

    return (editor.current as LexicalEditor)
  }

  return (
    <>

      <div className="editor-shell">

        <LexicalComposer initialConfig={editorConfig}>

          <EditorRefPlugin editorRef={editor} />
          <ToolbarPlugin
            setIsLinkEditMode={setIsLinkEditMode}
            onPropertiesChange={onToolbarProperties}
            onEditorClearCallback={props.onContentDeletedCallback}
            config={props.config.allowedToolBarOptions}
            headerTags={headers}
          />
          <ClearEditorPlugin />
          <ListPlugin />
          <ImagesPlugin />
          <InlineImagePlugin />
          <LinkPlugin hasLinkAttributes={false} />
          <LayoutPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <LexicalAutoLinkPlugin />
          <ClickableLinkPlugin />
          <OnChangePlugin onChange={onChange} />
          <SectionPlugin />
          <TablePlugin hasCellBackgroundColor={true} hasCellMerge={true} hasHorizontalScroll={true} hasTabHandler={true} />
          <TableCellResizerPlugin />
          <SelectionAlwaysOnDisplay />
          <TabIndentationPlugin />
          <CustomTableOfContentsPlugin onHeadersChange={(content: TableOfContentsEntry[]) => { setHeaders(content); }} />


          <div className='editor-container'>
            <div style={{ minHeight: props.config.heightRem, height: 'auto', width: 'inherit' }} ref={ref}>

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


