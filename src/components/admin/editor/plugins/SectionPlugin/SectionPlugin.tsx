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
import { $createSectionNode, SectionNode } from './SectionNode';


function use(editor: LexicalEditor): void {
  useEffect(() => {
    if (!editor.hasNodes([SectionNode])) {
      throw new Error('SectionNode: SectionNode not registered on editor');
    }
  }, [editor]);
}

export default function SectionPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  use(editor);
  return null;
}