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

export type SerializedSectionNode = SerializedTextNode
;

export class SectionNode extends TextNode {
  static getType(): string {
    return 'section';
  }

  static clone(node: SectionNode): SectionNode {
    return new SectionNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const inner = super.createDOM(config);
    return inner;
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

  static importJSON(serializedNode: SerializedSectionNode): SectionNode {
    const node = $createSectionNode(
      serializedNode.text,
    );
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedSectionNode {
    return {
      ...super.exportJSON(),
      type: 'section',
    };
  }

}

export function $isSectionNode(
  node: LexicalNode | null | undefined,
): node is SectionNode {
  return node instanceof SectionNode;
}

export function $createSectionNode(
  text: string,
): SectionNode {
  const node = new SectionNode(text).setMode('token');
  return $applyNodeReplacement(node);
}