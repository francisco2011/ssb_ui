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


    const onClick = (payload: InsertImagePayload) => {
        activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
        onClose();
    };

    const onClickLoadInline = (payload: InsertInlineImagePayload) => {
        activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload);
        onClose();
    };



    return (
        <>
            <UploadImageDialogBody allowLoadInline={true} alreadyLoadedImgUrl={null} onClickLoadInline={onClickLoadInline} contentType={contentType} onImageLoaded={() => { }} onClick={onClick} showDialogAction={true} showAlternativeText={true} imgClassname={imgClassName} />
        </>
    );
}

function InsertImageModal({ isActive, contentType, _className }) {

    const [modal, showModal] = useModal();
    const [editor] = useLexicalComposerContext();

    return (
        <><button
            className={clsx(
                "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
                isActive ? "bg-gray-600" : "bg-gray-400"
            )}
            onClick={() => {
                showModal('Column Layout', (onClose) => (
                    <ImageDialog
                        activeEditor={editor}
                        onClose={onClose}
                        contentType={contentType}
                        imgClassName={_className}
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