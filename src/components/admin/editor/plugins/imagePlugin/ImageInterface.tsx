import { LexicalEditor, NodeKey } from "lexical";

export default interface ImageInterface {
    altText: string;
    caption?: LexicalEditor;
    height?: number;
    key?: NodeKey;
    showCaption?: boolean;
    src: string;
    width?: number;
    imgId?: string;
      
}