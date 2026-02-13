import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, $createParagraphNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, ElementFormatType, ElementNode, isHTMLElement, LexicalEditor, LexicalNode, LexicalUpdateJSON, NodeKey, ParagraphNode, RangeSelection, SerializedElementNode, setNodeIndentFromDOM, Spread } from "lexical";
import { HeadingNode, HeadingTagType } from "@lexical/rich-text";
import { v4 as uuidv4 } from 'uuid';

export type SerializedCustomHeadingNode = Spread<
  {
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    id: string
  },
  SerializedElementNode
>;

export class CustomHeadingNode extends HeadingNode {

  __id: string;

  static getType(): string {
    return 'custom-heading';
  }


  static clone(node: CustomHeadingNode): CustomHeadingNode {
    return new CustomHeadingNode(node.__tag,node.__id, node.__key);
  }

  constructor(tag: HeadingTagType,  id: string, key?: NodeKey) {
    super(tag, key);
    this.__tag = tag;
    this.__id = id;
  }

  getTag(): HeadingTagType {
    return this.__tag;
  }

  getId(): string {
    return this.__id;
  }


  setTag(tag: HeadingTagType): this {
    const self = this.getWritable();
    this.__tag = tag;
    return self;
  }

    setId(id: string): this {
    const self = this.getWritable();
    this.__id = id;
    return self;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const tag = this.__tag;
    const id = this.__id;
    const element = document.createElement(tag);
    element.id = id;
    const theme = config.theme;
    const classNames = theme.heading;
    if (classNames !== undefined) {
      const className = classNames[tag];
      addClassNamesToElement(element, className);
    }
    return element;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    return prevNode.__tag !== this.__tag;
  }




  static importDOM(): DOMConversionMap | null {
    return {
      h1: (node: Node) => ({
        conversion: $convertCustomHeadingElement,
        priority: 0,
      }),
      h2: (node: Node) => ({
        conversion: $convertCustomHeadingElement,
        priority: 0,
      }),
      h3: (node: Node) => ({
        conversion: $convertCustomHeadingElement,
        priority: 0,
      }),
      h4: (node: Node) => ({
        conversion: $convertCustomHeadingElement,
        priority: 0,
      }),
      h5: (node: Node) => ({
        conversion: $convertCustomHeadingElement,
        priority: 0,
      }),
      h6: (node: Node) => ({
        conversion: $convertCustomHeadingElement,
        priority: 0,
      }),
      p: (node: Node) => {
        // domNode is a <p> since we matched it by nodeName
        const paragraph = node as HTMLParagraphElement;
        const firstChild = paragraph.firstChild;
        if (firstChild !== null && isGoogleDocsTitle(firstChild)) {
          return {
            conversion: () => ({node: null}),
            priority: 3,
          };
        }
        return null;
      },
      span: (node: Node) => {
        if (isGoogleDocsTitle(node)) {
          return {
            conversion: (domNode: Node) => {
              return {
                node: $createCustomHeadingNode('h1', ''),
              };
            },
            priority: 3,
          };
        }
        return null;
      },
    };
  }

  static importJSON(serializedNode: SerializedCustomHeadingNode): CustomHeadingNode {
    return $createCustomHeadingNode(serializedNode.tag, serializedNode.id).updateFromJSON(
      serializedNode,
    );
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedCustomHeadingNode>,
  ): this {
    return super.updateFromJSON(serializedNode).setTag(serializedNode.tag).setId(serializedNode.id);
  }

  exportJSON(): SerializedCustomHeadingNode {
    return {
      ...super.exportJSON(),
      tag: this.getTag(),
      id: this.getId()
    };
  }

  // Mutation
  insertNewAfter(
    selection?: RangeSelection,
    restoreSelection = true,
  ): ParagraphNode | HeadingNode {
    const anchorOffet = selection ? selection.anchor.offset : 0;
    const lastDesc = this.getLastDescendant();
    const isAtEnd =
      !lastDesc ||
      (selection &&
        selection.anchor.key === lastDesc.getKey() &&
        anchorOffet === lastDesc.getTextContentSize());
    const newElement =
      isAtEnd || !selection
        ? $createParagraphNode()
        : $createCustomHeadingNode(this.getTag(), this.getId());
    const direction = this.getDirection();
    newElement.setDirection(direction);
    this.insertAfter(newElement, restoreSelection);
    if (anchorOffet === 0 && !this.isEmpty() && selection) {
      const paragraph = $createParagraphNode();
      paragraph.select();
      this.replace(paragraph, true);
    }
    return newElement;
  }

  collapseAtStart(): true {
    const newElement = !this.isEmpty()
      ? $createCustomHeadingNode(this.getTag(), this.getId())
      : $createParagraphNode();
    const children = this.getChildren();
    children.forEach((child) => newElement.append(child));
    this.replace(newElement);
    return true;
  }

  extractWithChild(): boolean {
    return true;
  }
}

function  $convertCustomHeadingElement(element: HTMLElement): DOMConversionOutput {
  const nodeName = element.nodeName.toLowerCase();
  const id = element.id;
  let node : CustomHeadingNode | null = null;
  if (
    nodeName === 'h1' ||
    nodeName === 'h2' ||
    nodeName === 'h3' ||
    nodeName === 'h4' ||
    nodeName === 'h5' ||
    nodeName === 'h6'
  ) {
    node = $createCustomHeadingNode(nodeName, id);
    if (element.style !== null) {
      setNodeIndentFromDOM(element, node);
      node.setFormat(element.style.textAlign as ElementFormatType);
    }
  }
  return {node};
}

function isGoogleDocsTitle(domNode: Node): boolean {
  if (domNode.nodeName.toLowerCase() === 'span') {
    return (domNode as HTMLSpanElement).style.fontSize === '26pt';
  }
  return false;
}

export function $createCustomHeadingNode(
  headingTag: HeadingTagType = 'h1',
  id: string,
): CustomHeadingNode {
  return $applyNodeReplacement(new CustomHeadingNode(headingTag, id));
}

export function $isCustomHeadingNode(
  node: LexicalNode | null | undefined,
): node is CustomHeadingNode {
  return node instanceof CustomHeadingNode;
}

