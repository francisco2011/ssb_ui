
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
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
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


import { mergeRegister } from "@lexical/utils";
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
import LoadImageModal from "./toolbar/LoadImageModal";
import LanguageSelect from "./toolbar/CodeSelect";
import { $createCodeNode, $isCodeHighlightNode, $isCodeNode } from "@lexical/code";
import CodeButton from "./toolbar/CodeButton";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { sanitizeUrl } from "~/components/plugins/shared/url";
import InsertLinkButton from "./toolbar/InsertLinkButton";
import { getSelectedNode } from "~/components/plugins/shared/getSelectedNode";
import FloatingLinkEditorPlugin from "~/components/plugins/LinkPlugin/FloatingLinkEditorPlugin";
import ClearFormatingButton from "./toolbar/ClearFormatingButton";
import { clearFormatting } from "./utils/ClearFormating";
import IndentButton from "./toolbar/indent/IndentButton";
import OutdentButton from "./toolbar/indent/OutdentButton";
import PostModel from "~/models/PostModel";
import LineHeightSelect from "./toolbar/LineHeightSelect";
import TextColorPickerButton from "./toolbar/colorPicker/TextColorPickerButton";
import BgColorPickerButton from "./toolbar/colorPicker/BgColorPickerButton";
import FormatCopyButton from "./toolbar/formatCopy/FormatCopyButton";
import { getFormattingStates } from "~/components/plugins/shared/getFormattingStates";
import getSelectionFormat from "./toolbar/formatCopy/getSelectionFormat";
import FormatContainer from "./toolbar/formatCopy/FormatContainer";
import PasteCopiedFormatButton from "./toolbar/formatCopy/PasteCopiedFomartButton";
import SuperscriptButton from "./toolbar/script/SuperscriptButton";
import SubscriptButton from "./toolbar/script/SubscriptButton";
import MaxLengthBar from "~/components/plugins/MaxWidthPlugin/MaxWidthBar";
import ToolBarProperties from "./ToolbarProperties";



type Props = {
    setIsLinkEditMode: Dispatch<boolean>,
    post: PostModel,
    onPropertiesChange: Dispatch<ToolBarProperties>
    defaultWidth: string
}

export default function ToolbarPlugin({ setIsLinkEditMode, post, onPropertiesChange, defaultWidth }: Props) {

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

                if(!copiedFormat) return
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {

                    if(copiedFormat.IsBold) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    if(copiedFormat.IsItalic) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                    if(copiedFormat.IsStrikethrough) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                    if(copiedFormat.IsUnderline) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                    if(copiedFormat.IsCode) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                    if(copiedFormat.IsSubscript) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
                    if(copiedFormat.IsSuperscript) editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
                    
                    const styles: Record<string, string> = {}
                    

                    if(copiedFormat.FontSize) styles['font-size'] = copiedFormat.FontSize
                    if(copiedFormat.FontColor) styles['color'] = copiedFormat.FontColor
                    if(copiedFormat.BackgroundColor) styles['background-color'] = copiedFormat.BackgroundColor
                    if(copiedFormat.FontFamily) styles['font-family'] = copiedFormat.FontFamily
                    if(copiedFormat.LineHeight) styles['line-height'] = copiedFormat.LineHeight
                    
                    if(Object.keys(styles).length > 0) $patchStyleText(selection, styles);
                    
                    if(copiedFormat.IsQuote) $wrapNodes(selection, () => $createQuoteNode());
                    
                    if(copiedFormat.HeadingType) $wrapNodes(selection, () => $createHeadingNode(copiedFormat.HeadingType));
                    if(copiedFormat.IsListBulletList) editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                    if(copiedFormat.IsOrderedList)  editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);

                    if(copiedFormat.Alignment == 'center')  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                    if(copiedFormat.Alignment == 'right')  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                    if(copiedFormat.Alignment == 'left')  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                    if(copiedFormat.Alignment == 'justify')  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");

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
            setHeadingSize($isHeadingNode(element) ? element.getTag() : '');
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



    const applyHeadingText = useCallback(
        (heading: HeadingTagType) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {

                    if (heading) {
                        $wrapNodes(selection, () => $createHeadingNode(heading));
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

        );


    }, [editor, $updateToolbar]);

    const onClearFormatting = () => {
        clearFormatting(editor)
    }

    const onMaxWidthChanged = (value: number) => {
        onPropertiesChange({MaxLengthpx: value + 'px'})
    }

    return (
        <div className="z-40 sticky top-3 bg-white h-auto min-w-52 px-2 py-2 mb-4 space-x-2 flex items-center my-4 mx-auto rounded-sm text-black dark:text-white leading-5 font-normal text-left rounded-tl-sm rounded-tr-sm" ref={toolbarRef}>

            <div className="grid-rows-3">
                <div className="flex items-stretch space-x-1 mb-1 ">
                    <StrikethroughButton currentEditor={editor} isActive={isStrikethrough} />

                    <BoldButton currentEditor={editor} isActive={isBold} />

                    <ItalicButton currentEditor={editor} isActive={isItalic} />

                    <UnderlineButton currentEditor={editor} isActive={isUnderline} />

                    <span className="w-[2px] bg-gray-600 block h-full"></span>

                    <LeftButton currentEditor={editor} isActive={alignment == 'left'} />
                    <RightButton currentEditor={editor} isActive={alignment == 'right'} />
                    <CenterButton currentEditor={editor} isActive={alignment == 'center'} />
                    <JustifyButton currentEditor={editor} isActive={alignment == 'justify'} />

                    <IndentButton currentEditor={editor} isActive={true} />
                    <OutdentButton currentEditor={editor} isActive={true} />

                    <span className="w-[2px] bg-black block h-full"></span>

                    <FontSizeSelect currentEditor={editor} callback={applyStyleText} selectedOption={fontSize} />
                    <FontFamilySelect currentEditor={editor} callback={applyStyleText} selectedOption={fontFamily} />
                    <HeadingSelect currentEditor={editor} callback={applyHeadingText} selectedOption={headingSize} />

                    <BulletListButton currentEditor={editor} isActive={isBulletList} />
                    <OrderedListButton currentEditor={editor} isActive={isOrderedList} />
                    <QuoteButton callback={applyQuoteText} currentEditor={editor} selectedOption={isQuote} />

                    <LoadImageModal isActive={false} currentEditor={editor} _className={""} _postId={post.id} contentType={"imgBody"} />

                </div>

                <div className="flex items-stretch space-x-1">
                    <CodeButton isActive={isCode} currentEditor={editor} />
                    <LanguageSelect currentEditor={editor} callback={applyCodeLanguage} selectedOption={codeLanguage} />
                    <InsertLinkButton onClickCallback={insertLink} isActive={isLink} />
                    <ClearFormatingButton onClickCallback={onClearFormatting} />
                    <span className="w-[2px] bg-black block h-full">|</span>
                    <UndoButton isActive={canUndo} currentEditor={editor} />
                    <RedoButton isActive={canRedo} currentEditor={editor} />
                    <span className="w-[2px] bg-black block h-full">|</span>
                    <LineHeightSelect callback={applyStyleText} currentEditor={editor} selectedOption={lineHeight} />
                    
                    <span className="w-[2px] bg-black block h-full">|</span>
                    
                    <TextColorPickerButton callback={applyStyleText} selectedOption={color} />
                    <BgColorPickerButton callback={applyStyleText} selectedOption={bgColor} />
                    
                    <span className="w-[2px] bg-black block h-full">|</span>

                    <FormatCopyButton onClickCallback={copyFormat} isActive={copiedFormat != null} />
                    <PasteCopiedFormatButton onClickCallback={applyFormat}/>

                    <span className="w-[2px] bg-black block h-full">|</span>

                    <SubscriptButton isActive={isSubscript} currentEditor={editor} />
                    <SuperscriptButton isActive={isSuperscript} currentEditor={editor}/>
                </div>
                <div className="mt-2">
                <MaxLengthBar maxWidth={700} defaultWidth={defaultWidth} onMaxChanged={onMaxWidthChanged}/>
                </div>

            </div>




        </div>

    );
}

