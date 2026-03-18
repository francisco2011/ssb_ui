import { ElementNode, LexicalNode, NodeKey } from 'lexical';

interface SerializedDivNode {
  className?: string;
  text?:string
}

export class DivNode extends ElementNode {
  __className: string;
  __text: string

  static getType(): string {
    return 'div-node';
  }

  getClassName(): string {
    const self = this.getLatest();
    return self.__className;
  }

  getText(): string {
    const self = this.getLatest();
    return self.__text;
  }

  constructor(className: string, text: string, key?: NodeKey) {
    super(key);
    this.__className = className;
    this.__text = text
  }

  static clone(node: DivNode): DivNode {
    return new DivNode(node.__className, node.__text, node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('div');
    dom.className = this.__className;
    dom.innerText = this.__text
    // Add any custom classes or attributes here
    // dom.classList.add('my-custom-div'); 
    return dom;
  }

  exportJSON(): SerializedDivNode {
    const json = {
      className: this.__className,
      text: this.__text
    };
    return json;
  }

  static importJSON(
    serializedNode: SerializedDivNode
  ): DivNode {
    const { className, text } = serializedNode;
    return new DivNode(className??'', text??'');
  }

  
  // Other methods like importJSON, exportJSON, etc.
}

export function $createMyDivNode(className: string, text: string): DivNode {
  return new DivNode(className, text);
}

export function $isMyDivNode(node: LexicalNode | null | undefined): boolean {
  return node instanceof DivNode;
}