import { LexicalEditor, NodeKey } from "lexical";

export default interface ImageInterface {
    altText: string;
    caption?: LexicalEditor;
    width?: number | "inherit";
    height: number | "inherit";
    key?: NodeKey;
    showCaption?: boolean;
    src: string;
    imgId?: string;
      
}