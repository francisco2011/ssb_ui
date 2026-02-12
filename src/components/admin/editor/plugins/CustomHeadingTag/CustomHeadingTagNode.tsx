import { addClassNamesToElement } from "@lexical/utils";
import { DOMConversionMap, DOMExportOutput, EditorConfig, ElementNode, LexicalEditor, NodeKey } from "lexical";

export type HeadingTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** @noInheritDoc */
export class CustomHeadingNode extends HeadingNode {
  /** @internal */
  __tag: HeadingTagType;
  __id: string;

  static getType(): string {
    return 'heading';
  }

  static getId(): string {
    return 'heading';
  }

  static clone(node: CustomHeadingNode): CustomHeadingNode {
    return new HeadingNode(node.__tag, node.__key);
  }

  constructor(tag: HeadingTagType, key?: NodeKey) {
    super(key);
    this.__tag = tag;
  }

  getTag(): HeadingTagType {
    return this.__tag;
  }

  setTag(tag: HeadingTagType): this {
    const self = this.getWritable();
    this.__tag = tag;
    return self;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const tag = this.__tag;
    const element = document.createElement(tag);
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
        conversion: $convertHeadingElement,
        priority: 0,
      }),
      h2: (node: Node) => ({
        conversion: $convertHeadingElement,
        priority: 0,
      }),
      h3: (node: Node) => ({
        conversion: $convertHeadingElement,
        priority: 0,
      }),
      h4: (node: Node) => ({
        conversion: $convertHeadingElement,
        priority: 0,
      }),
      h5: (node: Node) => ({
        conversion: $convertHeadingElement,
        priority: 0,
      }),
      h6: (node: Node) => ({
        conversion: $convertHeadingElement,
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
                node: $createHeadingNode('h1'),
              };
            },
            priority: 3,
          };
        }
        return null;
      },
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const {element} = super.exportDOM(editor);

    if (isHTMLElement(element)) {
      if (this.isEmpty()) {
        element.append(document.createElement('br'));
      }

      const formatType = this.getFormatType();
      if (formatType) {
        element.style.textAlign = formatType;
      }

      const direction = this.getDirection();
      if (direction) {
        element.dir = direction;
      }
    }

    return {
      element,
    };
  }

  static importJSON(serializedNode: SerializedHeadingNode): HeadingNode {
    return $createHeadingNode(serializedNode.tag).updateFromJSON(
      serializedNode,
    );
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedHeadingNode>,
  ): this {
    return super.updateFromJSON(serializedNode).setTag(serializedNode.tag);
  }

  exportJSON(): SerializedHeadingNode {
    return {
      ...super.exportJSON(),
      tag: this.getTag(),
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
        : $createHeadingNode(this.getTag());
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
      ? $createHeadingNode(this.getTag())
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