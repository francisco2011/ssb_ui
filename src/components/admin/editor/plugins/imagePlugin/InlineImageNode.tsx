/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalEditor,
    LexicalNode,
    LexicalUpdateJSON,
    NodeKey,
    SerializedEditor,
    SerializedLexicalNode,
    Spread,
  } from 'lexical';
  
  import {
    $applyNodeReplacement,
    createEditor,
    DecoratorNode,
    isHTMLElement,
  } from 'lexical';
  import * as React from 'react';
  import {Suspense} from 'react';
import ImageInterface from './ImageInterface';
  
  const InlineImageComponent = React.lazy(() => import('./InlineImageComponent'));
  
  export type Position = 'left' | 'right' | 'full' | undefined;
  
  export interface InlineImagePayload extends ImageInterface {
    altText: string;
    caption?: LexicalEditor;
    width?: number | "inherit";
    height: number | "inherit";
    key?: NodeKey;
    showCaption?: boolean;
    src: string;
    position?: Position;
    imgId?: string;
    isSplitHalves?: boolean;
    hyperlink?: string;
  }
  
  export interface UpdateInlineImagePayload {
    altText?: string;
    showCaption?: boolean;
    position?: Position;
    isSplitInHalves?: boolean;
    src?: string;
    imgId?: string;
    width?: number | "inherit";
    height: number | "inherit";
    hyperlink?: string;
  }
  
  function $convertInlineImageElement(domNode: Node): null | DOMConversionOutput {
    if (isHTMLElement(domNode) && domNode.nodeName === 'IMG') {
      const {alt: altText, src, width, height} = domNode as HTMLImageElement;
      const node = $createInlineImageNode({altText, height, src, width});
      return {node};
    }
    return null;
  }
  
  export type SerializedInlineImageNode = Spread<
    {
      altText: string;
      caption: SerializedEditor;
      showCaption: boolean;
      src: string;
      width?: number | "inherit";
      height: number | "inherit";
      position?: Position;
      imgId?: string;
      isSplitHalves?: boolean
      hyperlink?: string;
    },
    SerializedLexicalNode
  >;
  
  export class InlineImageNode extends DecoratorNode<Element> {
    __src: string;
    __altText: string;
    __width: 'inherit' | number;
    __height: 'inherit' | number;
    __showCaption: boolean;
    __caption: LexicalEditor;
    __position: Position;
    __imgId: string | undefined;
    __isSplitHalves: boolean | undefined;
    __hyperlink?: string;
  
    static getType(): string {
      return 'inline-image';
    }
  
    static clone(node: InlineImageNode): InlineImageNode {
      return new InlineImageNode(
        node.__src,
        node.__altText,
        node.__position,
        node.__width,
        node.__height,
        node.__showCaption,
        node.__caption,
        node.__key,
        node.__imgId,
        node.__isSplitHalves,
        node.__hyperlink
      );
    }
  
    static importJSON(
      serializedNode: SerializedInlineImageNode,
    ): InlineImageNode {
      const {altText, height, width, src, showCaption, position, imgId, isSplitHalves, hyperlink} = serializedNode;
      return $createInlineImageNode({
        altText,
        height,
        position,
        showCaption,
        src,
        width,
        imgId,
        isSplitHalves,
        hyperlink
      }).updateFromJSON(serializedNode);
    }

    updateFromJSON(
      serializedNode: LexicalUpdateJSON<SerializedInlineImageNode>,
    ): this {
      const {caption} = serializedNode;
      const node = super.updateFromJSON(serializedNode);
      const nestedEditor = node.__caption;
      const editorState = nestedEditor.parseEditorState(caption.editorState);
      if (!editorState.isEmpty()) {
        nestedEditor.setEditorState(editorState);
      }
      return node;
    }
  
    static importDOM(): DOMConversionMap | null {
      return {
        img: (node: Node) => ({
          conversion: $convertInlineImageElement,
          priority: 0,
        }),
      };
    }
  
    constructor(
      src: string,
      altText: string,
      position: Position,
      width?: 'inherit' | number,
      height?: 'inherit' | number,
      showCaption?: boolean,
      caption?: LexicalEditor,
      key?: NodeKey,
      imgId?: string,
      isSplitHalves?: boolean,
      hyperlink?: string
    ) {
      super(key);
      this.__src = src;
      this.__altText = altText;
      this.__width = width || 'inherit';
      this.__height = height || 'inherit';
      this.__showCaption = showCaption || false;
      this.__caption = caption || createEditor();
      this.__position = position;
      this.__imgId = imgId
      this.__isSplitHalves = isSplitHalves,
      this.__hyperlink = hyperlink
    }
  
    exportDOM(): DOMExportOutput {

      
      const span = document.createElement('span');
      const className = `editor-shell editor-image position-${this.__position} ${this.__isSplitHalves === undefined || this.__isSplitHalves ? 'half' : ''}`;

      if (className !== undefined) {
        span.className = className;
      }
      
      const element = document.createElement('img');
      element.setAttribute('src', this.__src);
      element.setAttribute('alt', this.__altText);
      element.setAttribute('width', this.__width.toString());
      element.setAttribute('height', this.__height.toString());

      const sizeInherit = this.__width != "inherit" && this.__height != "inherit";
      var style = "display: block;"
      style += sizeInherit ?  `width:${this.__width}px; height:${this.__height}px;` : ""
      style += this.__hyperlink ? "cursor: pointer;" : ""
      element.setAttribute("style", style)
      
      if(this.__hyperlink){
        const a = document.createElement('a');
        a.setAttribute("href", this.__hyperlink)
        a.setAttribute("target", "_blank")
        a.setAttribute("rel", "noopener noreferrer")
        a.appendChild(element)
        span.appendChild(a)

      }else{
        span.appendChild(element)
      }

      return {element:span};
    }
  
    exportJSON(): SerializedInlineImageNode {
      return {
        ...super.exportJSON(),
        altText: this.getAltText(),
        caption: this.__caption.toJSON(),
        height: this.__height === 'inherit' ? 0 : this.__height,
        position: this.__position,
        showCaption: this.__showCaption,
        src: this.getSrc(),
        width: this.__width === 'inherit' ? 0 : this.__width,
        imgId: this.__imgId,
        isSplitHalves: this.__isSplitHalves,
        hyperlink: this.__hyperlink
      };
    }
  
 toImageInterface(): ImageInterface {

    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      width: this.__width === 'inherit' ? 0 : this.__width,
      imgId: this.__imgId
    }
  }

    getSrc(): string {
      return this.__src;
    }
  
    getAltText(): string {
      return this.__altText;
    }
  
    setAltText(altText: string): void {
      const writable = this.getWritable();
      writable.__altText = altText;
    }
  
    setWidthAndHeight(
      width: 'inherit' | number,
      height: 'inherit' | number,
    ): void {
      const writable = this.getWritable();
      writable.__width = width;
      writable.__height = height;
    }
  
    getShowCaption(): boolean {
      return this.__showCaption;
    }
  
    setShowCaption(showCaption: boolean): void {
      const writable = this.getWritable();
      writable.__showCaption = showCaption;
    }
  
    getPosition(): Position {
      return this.__position;
    }
  
    setPosition(position: Position): void {
      const writable = this.getWritable();
      writable.__position = position;
    }
  
    getIsSplitInHalves(): boolean{
      return this.__isSplitHalves === undefined || this.__isSplitHalves;
    }

    getHeight(): number | "inherit"{
      return this.__height;
    }

    getWidth(): number | "inherit"{
      return this.__width;
    }

    isSizeInherit(): boolean {
      return this.__height == "inherit" && this.__width == "inherit";
    }

    getHyperlink(): string | undefined {
      return this.__hyperlink;
    }

    update(payload: UpdateInlineImagePayload): void {
      const writable = this.getWritable();
      const {altText, showCaption, position, isSplitInHalves, src, imgId, height, width, hyperlink} = payload;
      if (altText) writable.__altText = altText;
      if (showCaption) writable.__showCaption = showCaption;
      if (position) writable.__position = position;
      if(isSplitInHalves === true || isSplitInHalves === false) writable.__isSplitHalves = isSplitInHalves
      if(src) writable.__src = src
      if(imgId) writable.__imgId = imgId
      if(height) writable.__height = height
      if(width) writable.__width = width
      if(hyperlink) writable.__hyperlink = hyperlink
    }
  
    // View
  
    createDOM(config: EditorConfig): HTMLElement {
      if(!config.theme.inlineImage) console.warn("must set config.theme.inlineImage variable")

      
      const span = document.createElement('span');

      const className = `${config.theme.inlineImage} position-${this.__position} ${this.__isSplitHalves === undefined || this.__isSplitHalves ? 'half' : ''}`;

      if (className !== undefined) {
        span.className = className;
      }
      return span;
    }
  
    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): false {
      if(!config.theme.inlineImage) console.warn("must set config.theme.inlineImage variable")
      const position = this.__position;
      const splitInHalves = this.__isSplitHalves;
      if (position !== prevNode.__position || splitInHalves != prevNode.__isSplitHalves) {
        const className = `${config.theme.inlineImage} position-${position} ${this.__isSplitHalves === undefined || this.__isSplitHalves ? 'half' : ''}`;
        if (className !== undefined) {
          dom.className = className;
        }
      }
      return false;
    }
  
    decorate(): Element {
      return (
        <Suspense fallback={null}>
          <InlineImageComponent
            src={this.__src}
            altText={this.__altText}
            width={this.__width}
            height={this.__height}
            nodeKey={this.getKey()}
            showCaption={this.__showCaption}
            caption={this.__caption}
            position={this.__position}
            isSplitHalves={this.__isSplitHalves}
            hyperlink={this.__hyperlink}
          />
        </Suspense>
      );
    }
  }
  
  export function $createInlineImageNode({
    altText,
    position,
    height,
    src,
    width,
    showCaption,
    caption,
    key,
    imgId,
    isSplitHalves,
    hyperlink
  }: InlineImagePayload): InlineImageNode {
    return $applyNodeReplacement(
      new InlineImageNode(
        src,
        altText,
        position,
        width,
        height,
        showCaption,
        caption,
        key,
        imgId,
        isSplitHalves,
        hyperlink
      ),
    );
  }
  
  export function $isInlineImageNode(
    node: LexicalNode | null | undefined,
  ): node is InlineImageNode {
    return node instanceof InlineImageNode;
  }