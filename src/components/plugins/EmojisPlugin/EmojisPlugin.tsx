/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TextNode } from 'lexical';
import { useEffect } from 'react';
import { $createEmojiNode, EmojiNode } from './EmojiNode';


const emojis: Map<string, [string, string]> = new Map([
  [':)', ['emoji happysmile', '🙂']],
  [':D', ['emoji veryhappysmile', '😀']],
  [':(', ['emoji unhappysmile', '🙁']],
  [';D', ['emoji winkingface', '😉']],
  ['<3', ['emoji heart', '❤']],
  [';P', ['emoji goofyface', '🤪']],
  ['8)', ['emoji coolguyface', '😎']],
  [':|', ['emoji blankface', '😐']],
  ['o_O', ['emoji grossedoutface', '🤔']],
  [':/', ['emoji sickface', '🫤']],
  [':O', ['emoji surprisedface', '😮']],
  ['^.^', ['emoji nerdiepoundie', '🤓']],
  [':x', ['emoji kissyface', '😙']],
  ['m)', ['emoji facepalm', '🤦']],
  ['xD', ['emoji cryinglaughing', '🤣']],
  [":'(", ['emoji cryingface', '😭']],
  [":')", ['emoji smilecryingface', '🥲']],
  [":S", ['emoji confusedface', '😵‍💫']]
]);


function $findAndTransformEmoji(node: TextNode): null | TextNode {
  const text = node.getTextContent();

  for (let i = 0; i < text.length; i++) {

    var len = 0;

    let emojiData = emojis.get(text.slice(i, i + 2))

    if (emojiData) len = 2

    if (!emojiData) {
      emojiData = emojis.get(text.slice(i, i + 3));
      len = 3
    }

    if (emojiData !== undefined) {
      const [emojiStyle, emojiText] = emojiData;
      let targetNode;

      if (i === 0) {
        [targetNode] = node.splitText(i + len);
      } else {
        [, targetNode] = node.splitText(i, i + len);
      }

      const emojiNode = $createEmojiNode(emojiStyle, emojiText);
      targetNode.replace(emojiNode);
      return emojiNode;
    }
  }

  return null;
}

function $textNodeTransform(node: TextNode): void {
  let targetNode: TextNode | null = node;

  while (targetNode !== null) {
    if (!targetNode.isSimpleText()) {
      return;
    }

    targetNode = $findAndTransformEmoji(targetNode);
  }
}

function useEmojis(editor: LexicalEditor): void {
  useEffect(() => {
    if (!editor.hasNodes([EmojiNode])) {
      throw new Error('EmojisPlugin: EmojiNode not registered on editor');
    }

    return editor.registerNodeTransform(TextNode, $textNodeTransform);
  }, [editor]);
}

export default function EmojisPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEmojis(editor);
  return null;
}