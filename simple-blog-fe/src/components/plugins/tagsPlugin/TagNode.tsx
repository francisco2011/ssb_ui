/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedTextNode,
    Spread,
  } from 'lexical';
  
  import {$applyNodeReplacement, TextNode} from 'lexical';
  
  export type SerializedTagNode = Spread<
    {
      className: string;
    },
    SerializedTextNode
  >;
  
  export class TagNode extends TextNode {
    __className: string;
  
    static getType(): string {
      return 'tag';
    }
  
    static clone(node: TagNode): TagNode {
      return new TagNode(node.__className, node.__text, node.__key);
    }
  
    constructor(className: string, text: string, key?: NodeKey) {
      super(text, key);
      this.__className = className;
    }
  
    createDOM(config: EditorConfig): HTMLElement {
      const dom = document.createElement('span');
      const inner = super.createDOM(config);
      dom.className = this.__className;
      inner.className = 'tag-inner';
      dom.appendChild(inner);
      return dom;
    }
  
    updateDOM(
      prevNode: TextNode,
      dom: HTMLElement,
      config: EditorConfig,
    ): boolean {
      const inner = dom.firstChild;
      if (inner === null) {
        return true;
      }
      super.updateDOM(prevNode, inner as HTMLElement, config);
      return false;
    }
  
    static importJSON(serializedNode: SerializedTagNode): TagNode {
      const node = $createTagNode(
        serializedNode.className,
        serializedNode.text,
      );
      node.setFormat(serializedNode.format);
      node.setDetail(serializedNode.detail);
      node.setMode(serializedNode.mode);
      node.setStyle(serializedNode.style);
      return node;
    }
  
    exportJSON(): SerializedTagNode {
      return {
        ...super.exportJSON(),
        className: this.getClassName(),
        type: 'tag',
      };
    }
  
    getClassName(): string {
      const self = this.getLatest();
      return self.__className;
    }
  }
  
  export function $isTagNode(
    node: LexicalNode | null | undefined,
  ): node is TagNode {
    return node instanceof TagNode;
  }
  
  export function $createTagNode(
    className: string,
    text: string,
  ): TagNode {
    const node = new TagNode(className, text).setMode('token');
    return $applyNodeReplacement(node);
  }