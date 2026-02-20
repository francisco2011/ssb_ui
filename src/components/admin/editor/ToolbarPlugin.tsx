
'use client'
import React, { Dispatch, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    CAN_UNDO_COMMAND,
    CAN_REDO_COMMAND,
    RangeSelection,
    $createParagraphNode,
    BaseSelection,
    DRAGSTART_COMMAND,
    COMMAND_PRIORITY_LOW,
    NodeKey,
    $getNodeByKey,
    $isElementNode,
    $createTextNode,
    COMMAND_PRIORITY_EDITOR,
    CLICK_COMMAND,
    $nodesOfType,
    $applyNodeReplacement,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
    $createQuoteNode,
    $isQuoteNode,
    HeadingTagType
} from "@lexical/rich-text";

import {
    $getSelectionStyleValueForProperty,
    $isParentElementRTL,
    $patchStyleText,
    $setBlocksType,
    $wrapNodes,
} from '@lexical/selection';

import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
    insertList,
    removeList
} from "@lexical/list";


import { $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import ItalicButton from "./toolbar/ItalicButton";
import BoldButton from "./toolbar/BoldButton";
import UnderlineButton from "./toolbar/ButtonUnderline";
import UndoButton from "./toolbar/UndoButton";
import RedoButton from "./toolbar/RedoButton";
import StrikethroughButton from "./toolbar/StrikethroughButton";
import LeftButton from "./toolbar/align/LeftButton";
import RightButton from "./toolbar/align/RightButton";
import CenterButton from "./toolbar/align/CenterButton";
import JustifyButton from "./toolbar/align/JustifyButton";
import FontSizeSelect from "./toolbar/FontSizeSelect";
import FontFamilySelect from "./toolbar/FontFamilySelect";
import HeadingSelect from "./toolbar/HeadingSelect";
import BulletListButton from "./toolbar/bulletListButton";
import OrderedListButton from "./toolbar/OrderedListButton";
import QuoteButton from "./toolbar/QuoteButton";
import InsertImageModal from "./toolbar/InsertImageModal";
import LanguageSelect from "./toolbar/CodeSelect";
import { $createCodeNode, $isCodeHighlightNode, $isCodeNode, CODE_LANGUAGE_MAP } from "@lexical/code";
import CodeButton from "./toolbar/CodeButton";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { sanitizeUrl } from "~/components/admin/editor/plugins/shared/url";
import InsertLinkButton from "./toolbar/InsertLinkButton";
import { getSelectedNode } from "~/components/admin/editor/plugins/shared/getSelectedNode";
import FloatingLinkEditorPlugin from "~/components/admin/editor/plugins/LinkPlugin/FloatingLinkEditorPlugin";
import ClearFormatingButton from "./toolbar/ClearFormatingButton";
import { clearFormatting } from "./utils/ClearFormating";
import IndentButton from "./toolbar/indent/IndentButton";
import OutdentButton from "./toolbar/indent/OutdentButton";
import PostModel from "~/models/PostModel";
import LineHeightSelect from "./toolbar/LineHeightSelect";
import TextColorPickerButton from "./toolbar/colorPicker/TextColorPickerButton";
import BgColorPickerButton from "./toolbar/colorPicker/BgColorPickerButton";
import FormatCopyButton from "./toolbar/formatCopy/FormatCopyButton";
import { getFormattingStates } from "~/components/admin/editor/plugins/shared/getFormattingStates";
import getSelectionFormat from "./toolbar/formatCopy/getSelectionFormat";
import FormatContainer from "./toolbar/formatCopy/FormatContainer";
import PasteCopiedFormatButton from "./toolbar/formatCopy/PasteCopiedFomartButton";
import SuperscriptButton from "./toolbar/script/SuperscriptButton";
import SubscriptButton from "./toolbar/script/SubscriptButton";
import MaxLengthBar, { Unit } from "~/components/admin/editor/plugins/MaxWidthPlugin/MaxWidthBar";
import ToolBarProperties from "./ToolbarProperties";
import EmojiPickerButton from "./toolbar/emojiPicker/EmojiPickerButton";
import { $createEmojiNode } from "~/components/admin/editor/plugins/EmojisPlugin/EmojiNode";
import GifPickerButton from "./toolbar/gif/GifPickerButton";
import { INSERT_IMAGE_COMMAND, InsertImagePayload } from "~/components/admin/editor/plugins/imagePlugin/ImagesPlugin";
import HorizontalRuleButton from "./toolbar/HorizontalRuleButton";
import { INSERT_INLINE_IMAGE_COMMAND } from "./plugins/imagePlugin/InlineImagePlugin";
import InsertTableButton from "./toolbar/InsertTableButtons";
import DrawIOModalButton from "./toolbar/DrawIOModalButton";
import ContentService from "~/services/ContentService";
import ContentModel from "~/models/ContentModel";
import DrawIOResponse from "./plugins/DrawIOPlugin/DrawIOResponse";
import InsertColumnLayoutModal from "./toolbar/InsertColumnLayaoutModal";
import ClearEditorButton from "./toolbar/ClearEditorButton";
import { INSERT_LAYOUT_COMMAND } from "./plugins/LayoutPlugin";
import SectionSelect, { SelectionResult } from "./toolbar/SectionSelect";
import { $createHorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension";
import { $createSectionNode } from "./plugins/SectionPlugin/SectionNode";
import { $isInlineImageNode } from "./plugins/imagePlugin/InlineImageNode";
import { $createCustomTableOfContentNode, CustomTableOfContentsNode } from "./plugins/TableOfContents/CustomTableOfContentsNode";
import { TableOfContentsEntry } from "./plugins/TableOfContents/CustomTableOfContentsPlugin";
import { $createCustomHeadingNode, $isCustomHeadingNode } from "./plugins/CustomHeadingTag/CustomHeadingTagNode";
import slugify from 'react-slugify';
import { v4 as uuidv4 } from 'uuid';
import TableOfContentsButton from "./toolbar/TableOfContentButton";
import LLMButton from "./toolbar/LLMButton";

export type ToolbarConfig = {
    allowImages?: boolean,
    allowEmogis?: boolean,
    allowGif?: boolean,
    allowDiagram?: boolean,
    allowTable?: boolean,
    allowColumn?: boolean,
    allowCode?: boolean,
    allowSection?: boolean,
    allowTableOfContents?: boolean
}

type Props = {
    setIsLinkEditMode: Dispatch<boolean>,
    onPropertiesChange: Dispatch<ToolBarProperties>
    onEditorClearCallback: () => void,
    config?: ToolbarConfig,
    headerTags: TableOfContentsEntry[]
}

export default function ToolbarPlugin({ setIsLinkEditMode, onPropertiesChange, onEditorClearCallback, config, headerTags }: Props) {

    const defaultFontSize = '15px';
    const defaultFontFamily = 'Arial';
    const defaultLineHeight = '1.2';
    const LowPriority = 1;
    const defaultColor = '#000000'
    const defaultBgColor = '#FFFFFF'

    const toolbarRef = useRef(null);
    const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
        null,
    );
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isSubscript, setIsSubscript] = useState(false);
    const [isSuperscript, setIsSuperscript] = useState(false);
    const [codeLanguage, setCodeLanguage] = useState<string>('');
    const [isCode, setIsCode] = useState(false);
    const [fontSize, setFontSize] = useState<string>(defaultFontSize);
    const [fontFamily, setFontFamily] = useState<string>(defaultFontFamily);
    const [section, setSection] = useState<string>("");
    const [lineHeight, setLineHeight] = useState<string>(defaultLineHeight);
    const [headingSize, setHeadingSize] = useState<string>('');
    const [isBulletList, setIsBulletList] = useState(false);
    const [isOrderedList, setIsOrderedList] = useState(false);
    const [isQuote, setIsQuote] = useState<boolean>(false);
    const [isLink, setIsLink] = useState<boolean>(false);
    const [color, setColor] = useState<string>(defaultColor);
    const [bgColor, setBgColor] = useState<string>(defaultBgColor);
    const [canUndo, setCanUndo] = useState(true);
    const [canRedo, setCanRedo] = useState(true);
    const [alignment, setAlignment] = useState('')

    const [copiedFormat, setCopiedFormat] = useState<FormatContainer | null>(null)

    const copyFormat = useCallback(
        () => {

            const format = getSelectionFormat(editor, defaultFontSize, defaultFontFamily, defaultLineHeight, defaultColor, defaultBgColor)
            setCopiedFormat(format)

        }, [editor]
    )

    const applyFormat = useCallback(
        () => {
            editor.update(() => {

                if (!copiedFormat) return
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {

                    if (copiedFormat.IsBold) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    if (copiedFormat.IsItalic) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                    if (copiedFormat.IsStrikethrough) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                    if (copiedFormat.IsUnderline) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                    if (copiedFormat.IsCode) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                    if (copiedFormat.IsSubscript) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
                    if (copiedFormat.IsSuperscript) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");

                    const styles: Record<string, string> = {}


                    if (copiedFormat.FontSize) styles['font-size'] = copiedFormat.FontSize
                    if (copiedFormat.FontColor) styles['color'] = copiedFormat.FontColor
                    if (copiedFormat.BackgroundColor) styles['background-color'] = copiedFormat.BackgroundColor
                    if (copiedFormat.FontFamily) styles['font-family'] = copiedFormat.FontFamily
                    if (copiedFormat.LineHeight) styles['line-height'] = copiedFormat.LineHeight

                    if (Object.keys(styles).length > 0) $patchStyleText(selection, styles);

                    if (copiedFormat.IsQuote) $wrapNodes(selection, () => $createQuoteNode());

                    if (copiedFormat.HeadingType) $wrapNodes(selection, () => $createCustomHeadingNode(copiedFormat.HeadingType, uuidv4()));
                    if (copiedFormat.IsListBulletList) editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                    if (copiedFormat.IsOrderedList) editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);

                    if (copiedFormat.Alignment == 'center') editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                    if (copiedFormat.Alignment == 'right') editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                    if (copiedFormat.Alignment == 'left') editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                    if (copiedFormat.Alignment == 'justify') editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");

                    setCopiedFormat(null)
                }
            },
                { tag: 'historic' }
            );
        },
        [editor, copiedFormat]
    );

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));

            setIsSubscript(selection.hasFormat('subscript'));
            setIsSuperscript(selection.hasFormat('superscript'));

            setIsCode(selection.hasFormat('code'));
            setFontSize(
                $getSelectionStyleValueForProperty(
                    selection,
                    'font-size',
                    defaultFontSize
                )
            );

            setFontFamily(
                $getSelectionStyleValueForProperty(
                    selection,
                    'font-family',
                    defaultFontFamily
                )
            );


            setLineHeight(
                $getSelectionStyleValueForProperty(
                    selection,
                    'line-height',
                    defaultLineHeight
                )
            );

            setColor(
                $getSelectionStyleValueForProperty(
                    selection,
                    'color',
                    defaultColor
                )
            );

            setBgColor(
                $getSelectionStyleValueForProperty(
                    selection,
                    'background-color',
                    defaultBgColor
                )
            );

            const element = getElementNode(selection)
            const anchorNode = getAnchorNode(selection)
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);

            if (elementDOM != null) {
                setSelectedElementKey(elementKey);
            }

            setIsQuote($isQuoteNode(element))
            setHeadingSize($isCustomHeadingNode(element) ? element.getTag() : '');
            setIsBulletList($isListNode(element) && element.getTag() == 'ul');
            setIsOrderedList($isListNode(element) && element.getTag() == 'ol');
            setAlignment(element.getFormatType())

            if ($isCodeHighlightNode(anchorNode)) {
                const hType = element.getLanguage()
                setCodeLanguage(hType)
            } else {
                setCodeLanguage('')
            }

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            const isLink = $isLinkNode(parent) || $isLinkNode(node);
            setIsLink(isLink);


        }
    }, []);

    const applyStyleText = useCallback(
        (styles: Record<string, string>, skipHistoryStack?: boolean) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $patchStyleText(selection, styles);
                }
            },
                skipHistoryStack ? { tag: 'historic' } : {},
            );
        },
        [editor]
    );



    const insertLink = useCallback(() => {
        if (!isLink) {
            setIsLinkEditMode(true);
            editor.dispatchCommand(
                TOGGLE_LINK_COMMAND,
                sanitizeUrl('https://'),
            );
        } else {

            setIsLinkEditMode(false);
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, setIsLinkEditMode, isLink]);

    const insertGif = useCallback((payload: InsertImagePayload) => {
        editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload);

    }, [editor])

    const applyHeadingText = useCallback(
        (heading: HeadingTagType) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {

                    if (heading) {

                        var text = selection.getTextContent()
                        var anchorText = selection.anchor.getNode().getTextContent()
                        const id = text ? slugify(text) : anchorText ? slugify(anchorText) : uuidv4();

                        $wrapNodes(selection, () => $createCustomHeadingNode(heading, id));
                    } else {
                        $wrapNodes(selection, () => $createParagraphNode());
                    }
                }
            });
        },
        [editor]
    );

    const applyCodeLanguage = useCallback(
        (language: string) => {

            language =
                language as keyof typeof CODE_LANGUAGE_MAP;
            editor.update(() => {
                let selection = $getSelection();
                if (selection && $isRangeSelection(selection)) {

                    if (language) {
                        if (selection !== null) {

                            if (selectedElementKey !== null) {
                                const node = $getNodeByKey(selectedElementKey);
                                if ($isCodeNode(node)) {
                                    node.setLanguage(language);
                                    return
                                }
                            }

                            if (selection.isCollapsed()) {
                                $setBlocksType(selection, () => $createCodeNode());
                            } else {
                                const textContent = selection.getTextContent();
                                const codeNode = $createCodeNode(language);
                                selection.insertNodes([codeNode]);
                                selection.insertRawText(textContent);

                            }
                        }
                    } else {
                        $wrapNodes(selection, () => $createParagraphNode());
                    }
                }
            });
        },
        [editor, selectedElementKey]
    );



    const applyQuoteText = useCallback(
        (data: boolean) => {
            editor.update(() => {

                const selection = $getSelection();
                if ($isRangeSelection(selection)) {

                    const element = getElementNode(selection);

                    if (!$isQuoteNode(element)) {
                        $wrapNodes(selection, () => $createQuoteNode());
                    } else {
                        $wrapNodes(selection, () => $createParagraphNode());
                    }
                }
            });
        },
        [editor]
    );

    const insertEmoji = useCallback(
        (emoji: string) => {
            editor.update(() => {

                const selection = $getSelection();
                if ($isRangeSelection(selection)) {


                    var newNode = $createEmojiNode('', emoji)
                    selection?.insertNodes([newNode])

                }
            });
        },
        [editor]
    )

    const insertSection = useCallback(
        (section: SelectionResult) => {
            editor.update(() => {

                const selection = $getSelection();
                if ($isRangeSelection(selection)) {

                    var newNode = $createSectionNode(section.tag)
                    selection?.insertNodes([newNode])

                }
            });
        },
        [editor]
    )

    const getElementNode = (selection: any): any => {
        const anchorNode = selection.anchor.getNode();
        const element =
            anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();

        return element;
    }

    const getAnchorNode = (selection: any): any => {
        return selection.anchor.getNode();

    }

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),

            editor.registerCommand(
                INSERT_ORDERED_LIST_COMMAND,
                () => {
                    insertList(editor, 'number');
                    return true;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                INSERT_UNORDERED_LIST_COMMAND,
                () => {
                    insertList(editor, 'bullet');
                    return true;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                REMOVE_LIST_COMMAND,
                () => {
                    removeList(editor);
                    return true;
                },
                COMMAND_PRIORITY_LOW,
            ),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                INSERT_HORIZONTAL_RULE_COMMAND,
                () => {
                    const horizontalRuleNode = $createHorizontalRuleNode();
                    // Custom logic can be added here, e.g., to replace an empty block
                    editor.update(() => {
                        $insertNodeToNearestRoot(horizontalRuleNode);
                    });
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),

        );


    }, [editor, $updateToolbar]);

    const onClearFormatting = () => {
        clearFormatting(editor)
    }


    /////////////////////DRAWIO/////////////////

    const onDrawIO = async (data: DrawIOResponse | null) => {
        if (data && data.Content) {
            editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, { src: data.Content, position: 'full', imgId: data.name });
        }
    }

    ////////////////////////////////////

    const insertColumnLayout = (layout: string) => {

        if (layout) editor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);

    }

    /////////TEST//////////////////

    const addTableOfContents = () => {

        editor.update(() => {

            const listNodes = $nodesOfType(CustomTableOfContentsNode);

            if (listNodes && listNodes.length > 0) return

            const newNode = $createCustomTableOfContentNode({ entries: headerTags });
            $insertNodeToNearestRoot(newNode);
        },
        );
    }

    useEffect(() => {

        editor.update(() => {

            const listNodes = $nodesOfType(CustomTableOfContentsNode);
            if (listNodes && listNodes.length > 0) {

                //there can only be one
                var existingNode = listNodes[0]
                const newNode = $createCustomTableOfContentNode({ entries: headerTags });
                existingNode?.replace(newNode)
            }

        },
        );

    }, [headerTags])

    ///////////////////////////////

    ////////////// RESULT FROM LLM ////////////////

    const onllMMessageSelected = async (message: string) => {
        editor.update(() => {
            var selection = $getSelection()

            if (!selection) return

            // 2. Create the new TextNode and ParagraphNode
            const textNode = $createTextNode(message);
            const paragraphNode = $createParagraphNode();

            // 3. Append the text node to the paragraph node
            paragraphNode.append(textNode);

            if ($isRangeSelection(selection)) {
                // $setBlocksType will iterate over selected nodes and change their type
                // to the new node returned by the provided function.
                selection.insertNodes([paragraphNode])
            }else{
                selection.insertRawText(message)
            }

        })
    }

    //////////////////////////////////////////////
    return (
        <div style={{ "zIndex": 999 }} className=" sticky top-3  bg-white h-auto px-2 py-2 mb-4 space-x-2 items-center my-4 mx-auto rounded-sm text-black dark:text-white leading-5 font-normal text-left rounded-tl-sm rounded-tr-sm" ref={toolbarRef}>

            <div className="flex flex-wrap gap-[2px] space-x-1">
                <ClearEditorButton onClickCallback={onEditorClearCallback} />
                <StrikethroughButton isActive={isStrikethrough} />

                <BoldButton isActive={isBold} />

                <ItalicButton isActive={isItalic} />

                <UnderlineButton isActive={isUnderline} />

                <span className="w-[2px] bg-black block h-full">'</span>

                <LeftButton isActive={alignment == 'left'} />
                <CenterButton isActive={alignment == 'center'} />
                <JustifyButton isActive={alignment == 'justify'} />
                <RightButton isActive={alignment == 'right'} />
                <span className="w-[2px] bg-black block h-full">'</span>

                <OutdentButton isActive={true} />
                <IndentButton isActive={true} />

                <span className="w-[2px] bg-black block h-full">'</span>

                <FontSizeSelect callback={applyStyleText} selectedOption={fontSize} />
                <FontFamilySelect callback={applyStyleText} selectedOption={fontFamily} />
                <HeadingSelect callback={applyHeadingText} selectedOption={headingSize} />

                <BulletListButton isActive={isBulletList} />
                <OrderedListButton isActive={isOrderedList} />
                <QuoteButton callback={applyQuoteText} selectedOption={isQuote} />

                {
                    config && config.allowCode == true ?

                        <><CodeButton isActive={isCode} /><LanguageSelect callback={applyCodeLanguage} selectedOption={codeLanguage} /></>

                        : null
                }



                <InsertLinkButton onClickCallback={insertLink} isActive={isLink} />
                <span className="w-[2px] bg-black block h-full">'</span>
                <UndoButton isActive={canUndo} />
                <RedoButton isActive={canRedo} />
                <span className="w-[2px] bg-black block h-full">'</span>
                <LineHeightSelect callback={applyStyleText} selectedOption={lineHeight} />

                <span className="w-[2px] bg-black block h-full">'</span>

                <TextColorPickerButton callback={applyStyleText} selectedOption={color} />
                <BgColorPickerButton callback={applyStyleText} selectedOption={bgColor} />

                <span className="w-[2px] bg-black block h-full">'</span>

                <FormatCopyButton onClickCallback={copyFormat} isActive={copiedFormat != null} />
                <PasteCopiedFormatButton onClickCallback={applyFormat} />
                <ClearFormatingButton onClickCallback={onClearFormatting} />
                <span className="w-[2px] bg-black block h-full">'</span>

                <SubscriptButton isActive={isSubscript} />
                <SuperscriptButton isActive={isSuperscript} />
                <span className="w-[2px] bg-black block h-full">'</span>

                {
                    config && config.allowImages ?
                        <InsertImageModal isActive={false} contentType={"imgBody"} />
                        : null
                }

                {
                    config && config.allowEmogis ?
                        <EmojiPickerButton onClickCallback={insertEmoji} />
                        : null
                }

                {
                    config && config.allowGif ?
                        <GifPickerButton onClickCallback={insertGif} />
                        : null
                }


                <HorizontalRuleButton />

                {
                    config && config.allowTable ?
                        <InsertTableButton />
                        : null
                }

                {
                    config && config.allowColumn ?
                        <InsertColumnLayoutModal onContentCallback={insertColumnLayout} />
                        : null
                }

                {
                    config && config.allowDiagram ?
                        <DrawIOModalButton id={undefined} src={undefined} onContentCallback={onDrawIO} />
                        : null
                }

                {
                    config && config.allowSection ?
                        <SectionSelect selectedOption={section} callback={insertSection} />
                        : null
                }

                {config && config.allowTableOfContents ?
                    <TableOfContentsButton onClickCallback={addTableOfContents} />
                    : null
                }

                <LLMButton onContentCallback={onllMMessageSelected} />



            </div>

        </div>

    );
}

