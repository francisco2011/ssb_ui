'use client'
import { LexicalNode } from "lexical";
import { ImageNode } from "./ImageNode";

export default function $isImageNode(
    node: LexicalNode | null | undefined
  ): node is ImageNode {
    return node instanceof ImageNode;
  }
