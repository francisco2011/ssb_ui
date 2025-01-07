import { $getSelection, $isElementNode, $isRangeSelection, BaseSelection, LexicalEditor } from "lexical";

import {
        $getSelectionStyleValueForProperty
} from '@lexical/selection';

import {
        $isHeadingNode,
        $isQuoteNode
} from "@lexical/rich-text";

import {
        $isListNode,
} from "@lexical/list";
import FormatContainer from "./FormatContainer";
import { getSelectedNode } from "~/components/plugins/shared/getSelectedNode";

const getElementNode = (selection: BaseSelection): any => {
        const anchorNode = selection.anchor.getNode();
        const element =
                anchorNode.getKey() === "root"
                        ? anchorNode
                        : anchorNode.getTopLevelElementOrThrow();

        return element;
}

export default function getSelectionFormat(editor: LexicalEditor, defaultFontSize: string,
        defaultFontFamily: string, defaultLineHeight: string,
        defaultColor: string, defaultBgColor: string): FormatContainer {
        const container = new FormatContainer()


        editor.update(() => {

                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                        container.IsBold = selection.hasFormat('bold')
                        container.IsItalic = selection.hasFormat('italic')
                        container.IsUnderline = selection.hasFormat('underline')
                        container.IsStrikethrough = selection.hasFormat('strikethrough')
                        container.IsCode = selection.hasFormat('code')
                        container.IsSubscript = selection.hasFormat('subscript')
                        container.IsSuperscript = selection.hasFormat('superscript')
                        container.FontSize = $getSelectionStyleValueForProperty(
                                selection,
                                'font-size',
                                defaultFontSize);
                        container.FontFamily = $getSelectionStyleValueForProperty(
                                selection,
                                'font-family',
                                defaultFontFamily
                        );
                        container.LineHeight = $getSelectionStyleValueForProperty(
                                selection,
                                'line-height',
                                defaultLineHeight
                        )

                        container.FontColor = $getSelectionStyleValueForProperty(
                                selection,
                                'color',
                                defaultColor
                        );

                        container.BackgroundColor = $getSelectionStyleValueForProperty(
                                selection,
                                'background-color',
                                defaultBgColor
                        )

                        const element = getElementNode(selection)

                        if (element) {
                                container.IsQuote = $isQuoteNode(element)
                                container.HeadingType = $isHeadingNode(element) ? element.getTag() : '';
                                container.IsListBulletList = $isListNode(element) && element.getTag() == 'ul'
                                container.IsOrderedList = $isListNode(element) && element.getTag() == 'ol'
                                container.Alignment = element.getFormatType()
                        }
                }
        })

        return container;

}
