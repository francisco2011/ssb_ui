import { $applyNodeReplacement } from "lexical";
import { ImageNode } from "./ImageNode";
import ImagePayload from "./ImagePayload";

export default function $createImageNode({
    altText,
    height,
    maxWidth = 500,
    captionsEnabled = true,
    src,
    width,
    showCaption = true,
    caption,
    key,
    imgId
  }: ImagePayload): ImageNode {
    return $applyNodeReplacement(
      new ImageNode(
        src,
        altText,
        maxWidth,
        width,
        height,
        showCaption,
        caption,
        captionsEnabled,
        key,
        imgId
      )
    );
  }
