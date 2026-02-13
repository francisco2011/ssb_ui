import './CustomTableOfContentsNode.css'
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
    isHTMLElement,
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

function $convertCustomTableOfContentElement(domNode: Node): null | DOMConversionOutput {
    return null;
  }

export class CustomTableOfContentsNode extends DecoratorNode<Element> {
    __entries: TableOfContentsEntry[];


    static getType(): string {
        return 'table-of-contents';
    }

    static clone(node: CustomTableOfContentsNode): CustomTableOfContentsNode {
        return new CustomTableOfContentsNode(
            node.__entries,
            node.__key,
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

        var content = entry[1]
        var id = entry[3]

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", "#"+id)
        //<a href="#section-2">2. Core Concepts</a>
        li.appendChild(a)
        a.innerText = content

        return li
    }

    getUlElement(): HTMLUListElement {

        const ul = document.createElement('ul');

        return ul
    }



    exportDOM(): DOMExportOutput {

        const div = this.createTree()

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

    static importDOM(): DOMConversionMap | null {
        return {
            div: (node: Node) => ({
                conversion: $convertCustomTableOfContentElement,
                priority: 0,
            }),
        };
    }

    createTree(): HTMLElement {
        var tree = new CustomTableOfContentsHelper().toTree(this.__entries)

        const div = document.createElement('div');
        div.className = "toc_div"
        const nav = document.createElement('nav')
        nav.id = "toc_container"
        const title = document.createElement('p')
        title.className = "toc_title"
        title.innerText = "Table of Contents"
        nav.appendChild(title)
        let lastUl = this.getUlElement()
        lastUl.className = "toc_list"
        div.appendChild(nav)
        nav.appendChild(lastUl)

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

    createDOM(config: EditorConfig): HTMLElement {
        return this.createTree()
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