//Based on: 

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
import DrawIOComponent from './DrawIOComponent';
  
  const Component = React.lazy(() => import('./DrawIOComponent'));
  
  export type Position = 'left' | 'right' | 'full' | undefined;
  
  export interface DrawIOImagePayload {
    height?: number;
    key?: NodeKey;
    src: string;
    width?: number;
    position?: Position;
    imgId?: string;
    isSplitHalves?: boolean
  }
  
  export interface UpdateDrawIOImagePayload {
    position?: Position;
    isSplitInHalves?: boolean
  }
  
  function $convertImageElement(domNode: Node): null | DOMConversionOutput {
    if (isHTMLElement(domNode) && domNode.nodeName === 'IMG') {
      const {alt: altText, src, width, height} = domNode as HTMLImageElement;
      const node = $createNode({altText, height, src, width});
      return {node};
    }
    return null;
  }
  
  export type SerializedDrawIOImageNode = Spread<
    {
      height?: number;
      src: string;
      width?: number;
      position?: Position;
      imgId?: string;
      isSplitHalves?: boolean
    },
    SerializedLexicalNode
  >;
  
  export class DrawIOImageNode extends DecoratorNode<Element> {
    __src: string;
    __width: 'inherit' | number;
    __height: 'inherit' | number;
    __position: Position;
    __imgId: string | undefined;
    __isSplitHalves: boolean | undefined;
  
    static getType(): string {
      return 'drawio-image';
    }
  
    static clone(node: DrawIOImageNode): DrawIOImageNode {
      return new DrawIOImageNode(
        node.__src,
        node.__position,
        node.__width,
        node.__height,
        node.__key,
        node.__imgId,
        node.__isSplitHalves
      );
    }
  
    static importJSON(
      serializedNode: SerializedDrawIOImageNode,
    ): DrawIOImageNode {
      const {height, width, src, position, imgId, isSplitHalves} = serializedNode;
      return $createNode({
        height,
        position,
        src,
        width,
        imgId,
        isSplitHalves
      }).updateFromJSON(serializedNode);
    }
  
    static importDOM(): DOMConversionMap | null {
      return {
        img: (node: Node) => ({
          conversion: $convertImageElement,
          priority: 0,
        }),
      };
    }
  
    constructor(
      src: string,
      position: Position,
      width?: 'inherit' | number,
      height?: 'inherit' | number,
      key?: NodeKey,
      imgId?: string,
      isSplitHalves?: boolean
    ) {
      super(key);
      this.__src = src;
      this.__width = width || 'inherit';
      this.__height = height || 'inherit';
      this.__position = position;
      this.__imgId = imgId
      this.__isSplitHalves = isSplitHalves
    }
  
    exportDOM(): DOMExportOutput {
      const element = document.createElement('img');
      element.setAttribute('src', this.__src);
      element.setAttribute('alt', '');
      element.setAttribute('width', this.__width.toString());
      element.setAttribute('height', this.__height.toString());
      return {element};
    }
  
    exportJSON(): SerializedDrawIOImageNode {
      return {
        ...super.exportJSON(),
        height: this.__height === 'inherit' ? 0 : this.__height,
        position: this.__position,
        src: this.getSrc(),
        width: this.__width === 'inherit' ? 0 : this.__width,
        imgId: this.__imgId,
        isSplitHalves: this.__isSplitHalves
      };
    }
  
    getSrc(): string {
      return this.__src;
    }
  
    setWidthAndHeight(
      width: 'inherit' | number,
      height: 'inherit' | number,
    ): void {
      const writable = this.getWritable();
      writable.__width = width;
      writable.__height = height;
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

    update(payload: UpdateDrawIOImagePayload): void {
      const writable = this.getWritable();
      const { position, isSplitInHalves} = payload;
      
      if (position !== undefined) {
        writable.__position = position;
      }

      if(isSplitInHalves !== undefined){
        writable.__isSplitHalves = isSplitInHalves
      }
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
          <DrawIOComponent
            src={this.__src}
            width={this.__width}
            height={this.__height}
            nodeKey={this.getKey()}
            position={this.__position}
            isSplitHalves={this.__isSplitHalves}
          />
        </Suspense>
      );
    }
  }
  
  export function $createNode({
    height,
    src,
    width,
    key,
    imgId,
    isSplitHalves
  }: DrawIOImageNode): DrawIOImageNode {
    return $applyNodeReplacement(
      new DrawIOImageNode(
        src,
        width,
        height,
        key,
        imgId,
        isSplitHalves
      ),
    );
  }
  
  export function $isDrawIOImageNode(
    node: LexicalNode | null | undefined,
  ): node is DrawIOImageNode {
    return node instanceof DrawIOImageNode;
  }