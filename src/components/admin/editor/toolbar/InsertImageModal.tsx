import { faImage, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { LexicalEditor } from "lexical";

import { INSERT_IMAGE_COMMAND, InsertImagePayload } from "../plugins/imagePlugin/ImagesPlugin";
import { UploadImageDialogBody } from "~/components/admin/editor/plugins/imagePlugin/UploadImageDialog";
import { useEffect, useState } from "react";
import { INSERT_INLINE_IMAGE_COMMAND, InsertInlineImagePayload } from "../plugins/imagePlugin/InlineImagePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useModal from "~/components/useModal";
import { v4 as uuidv4 } from 'uuid';

function ImageDialog({
    activeEditor,
    onClose,
    contentType,
    imgClassName
}: {
    activeEditor: LexicalEditor;
    onClose: () => void;
    contentType: string,
    imgClassName: string
}): JSX.Element {

    const onClickLoadInline = (payload: InsertInlineImagePayload) => {
        activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload);
        onClose();
    };



    return (
        <>
            <UploadImageDialogBody alreadyLoadedImgUrl={null} onClickLoadInline={onClickLoadInline} contentType={contentType} onImageLoaded={() => { }}  showDialogAction={true} showAlternativeText={true} imgClassname={imgClassName} />
        </>
    );
}

function InsertImageModal({ isActive, contentType }) {

    const [modal, showModal] = useModal();
    const [editor] = useLexicalComposerContext();

    return (
        <><button
            className={clsx(
                "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
                isActive ? "bg-gray-600" : "bg-gray-400"
            )}
            onClick={() => {
                showModal('Load image', (onClose) => (
                    <ImageDialog
                        activeEditor={editor}
                        onClose={onClose}
                        contentType={contentType}
                        imgClassName={"h-[25rem] object-scale-down"}
                    />

                ));
            }}
        >
            <FontAwesomeIcon
                icon={faImage}
                className="text-white w-3.5 h-3.5" />
        </button>
        {modal}
        </>
    );

}

export default InsertImageModal;