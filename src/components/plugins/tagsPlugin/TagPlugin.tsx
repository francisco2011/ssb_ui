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
import { $createTagNode, TagNode } from './TagNode';


const tagPrefix = "@@";
const tagStyle = "px-2 py-1 md:text-lg relative text-gray-500 bg-gray-100 rounded-badge select-none hover:shadow hover:shadow-teal-700 hover:outline hover:outline-teal-600 border border-gray-800"

function $findAndTransformTag(node: TextNode): null | TextNode {
    const text = node.getTextContent();
    
    let tagCount = 0

    var startIndex = text.indexOf(tagPrefix)
    var lastPrefixIndex = startIndex + tagPrefix.length -1; 

    if(startIndex == -1 || lastPrefixIndex == text.length -1 || text[lastPrefixIndex + 1] == " ") return null;
    
    tagCount += tagPrefix.length

    for (let i = startIndex; i < text.length; i++) {
        
        
        if (text[i]  != " " ) {
            tagCount++
            continue
        }

        let targetNode;
        if (text[i] == " ") {

            if(startIndex == 0){
                [targetNode] = node.splitText(0, i);
            }else{
                [, targetNode] = node.splitText(startIndex, i);
            }

            const textToReplace = text.substring(startIndex, i).replace(tagPrefix, '')

            if (targetNode) {
                const tagNode = $createTagNode(tagStyle, textToReplace);
                targetNode.replace(tagNode);
                return tagNode;
            }
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

        targetNode = $findAndTransformTag(targetNode);


    }
}

function useTag(editor: LexicalEditor): void {
    useEffect(() => {
        if (!editor.hasNodes([TagNode])) {
            throw new Error('TagNode not registered on editor');
        }

        return editor.registerNodeTransform(TextNode, $textNodeTransform);
    }, [editor]);
}


export default function TagPlugin({ onNewCallback  }): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    useTag(editor);

    if (onNewCallback) {
        editor.registerMutationListener(
            TagNode,
            (mutatedNodes, { updateTags, dirtyLeaves, prevEditorState }) => {
                // mutatedNodes is a Map where each key is the NodeKey, and the value is the state of mutation.
                for (let [nodeKey, mutation] of mutatedNodes) {

                    if (mutation == "created") {
                        onNewCallback(editor.getElementByKey(nodeKey)?.innerText)
                    }
                }
            },
            { skipInitialization: false }
        );
    }



    return null;
}