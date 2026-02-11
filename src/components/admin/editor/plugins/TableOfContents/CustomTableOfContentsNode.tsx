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
    DecoratorNode,
} from 'lexical';
import { TableOfContentsEntry } from './CustomTableOfContentsPlugin';
import CustomTableOfContentsHelper from './CustomTableOfContentsHelper';


export type SerializedCustomTableOfContentsNode = Spread<
    {
        entries: TableOfContentsEntry[];

    },
    SerializedLexicalNode
>;

export interface UpdateCustomTableOfContentsPayload {
    entries: TableOfContentsEntry[];
}


export class CustomTableOfContentsNode extends DecoratorNode<Element> {
    __entries: TableOfContentsEntry[];


    static getType(): string {
        return 'table-of-contents';
    }

    static clone(node: CustomTableOfContentsNode): CustomTableOfContentsNode {
        return new CustomTableOfContentsNode(
            node.__entries,
        );
    }

    static importJSON(
        serializedNode: SerializedCustomTableOfContentsNode,
    ): CustomTableOfContentsNode {
        const { entries } = serializedNode;
        return $createCustomTableOfContentNode({
            entries
        }).updateFromJSON(serializedNode);
    }

    updateFromJSON(
        serializedNode: LexicalUpdateJSON<SerializedCustomTableOfContentsNode>,
    ): this {
        const { entries } = serializedNode;
        const node = super.updateFromJSON(serializedNode);
        return node;
    }



    constructor(
        entries: TableOfContentsEntry[],
        key?: NodeKey,

    ) {
        super(key);
        this.__entries = entries
    }

    getLiElement(entry: TableOfContentsEntry): HTMLLIElement {

        var node = entry[0]
        var content = entry[1]
        var type = entry[2]

        const element = document.createElement("li");
        element.innerText = content

        return element
    }

    getUlElement(): HTMLUListElement {

        const ul = document.createElement('ul');

        return ul
    }



    exportDOM(): DOMExportOutput {

        var tree = new CustomTableOfContentsHelper().toTree(this.__entries)

        debugger
        const div = document.createElement('div');
        const lastUl = this.getUlElement()
        div.appendChild(lastUl)

        //all roots
        var allNodes = [...tree.Children]

        allNodes.forEach(c => {
            if (c.Entry) {
                const li = this.getLiElement(c.Entry)
                c.Li = li
                lastUl.appendChild(li)
            }
        })

        while (allNodes.length > 0) {

            var root = allNodes.shift()

            if (!root) continue


            if (root.Children.length > 0) {

                allNodes.unshift(...root.Children)
                const newUl = this.getUlElement()
                root.Li.appendChild(newUl)

                root.Children.forEach(c => {
                    if (c.Entry) {
                        const li = this.getLiElement(c.Entry)
                        c.Li = li
                        lastUl.appendChild(li)
                    }
                })
            }

        }

        return { element: div };

    }

    exportJSON(): SerializedCustomTableOfContentsNode {
        return {
            ...super.exportJSON(),
            entries: this.__entries
        };
    }




    update(payload: UpdateCustomTableOfContentsPayload): void {
        const writable = this.getWritable();
        const { entries } = payload;
        if (entries) writable.__entries = entries;

    }

    // View

    createDOM(config: EditorConfig): HTMLElement {
        // if (!config.theme.inlineImage) console.warn("must set config.theme.inlineImage variable")


        var tree = new CustomTableOfContentsHelper().toTree(this.__entries)

        const div = document.createElement('div');
        let lastUl = this.getUlElement()
        div.appendChild(lastUl)

        //all roots
        var allNodes = [...tree.Children]

        allNodes.forEach(c => {
            if (c.Entry) {
                const li = this.getLiElement(c.Entry)
                c.Li = li
                lastUl.appendChild(li)
            }
        })

        while (allNodes.length > 0) {

            var root = allNodes.shift()

            if (!root) continue


            if (root.Children.length > 0) {

                allNodes.unshift(...root.Children)
                const newUl = this.getUlElement()
                lastUl = newUl
                root.Li.appendChild(newUl)

                root.Children.forEach(c => {
                    if (c.Entry) {
                        const li = this.getLiElement(c.Entry)
                        c.Li = li
                        lastUl.appendChild(li)
                    }
                })
            }

        }

        return div;
    }

    updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): false {
       // if (!config.theme.inlineImage) console.warn("must set config.theme.inlineImage variable")
       
       dom = this.createDOM(config)

       
       return false;
    }

}

export function $createCustomTableOfContentNode({
    entries
  }: UpdateCustomTableOfContentsPayload): CustomTableOfContentsNode {
    return $applyNodeReplacement(
      new CustomTableOfContentsNode(
        entries
      ),
    );
  }

export function $isCustomTableOfContentNode(
    node: LexicalNode | null | undefined,
): node is CustomTableOfContentsNode {
    return node instanceof CustomTableOfContentsNode;
}