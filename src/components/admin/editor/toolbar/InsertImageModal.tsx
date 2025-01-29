import { faImage, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import ButtonProps from "./props/IButtonProps";

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
    _postId,
    imgClassName
}: {
    activeEditor: LexicalEditor;
    onClose: () => void;
    contentType: string,
    _postId: number,
    imgClassName: string
}): JSX.Element {

    const [postId, setPostId] = useState<number>(0)

    const onClick = (payload: InsertImagePayload) => {
        activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
        onClose();
    };

    const onClickLoadInline = (payload: InsertInlineImagePayload) => {
        activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload);
        onClose();
    };

    useEffect(() => {

        if (_postId) {
            setPostId(_postId)
        }

    }, [_postId]);

    return (
        <>
            <UploadImageDialogBody allowLoadInline={true} alreadyLoadedImgUrl={null} onClickLoadInline={onClickLoadInline} contentType={contentType} postId={postId} onImageLoaded={() => { }} onClick={onClick} showDialogAction={true} showAlternativeText={true} imgClassname={imgClassName} />
        </>
    );
}

function InsertImageModal({ isActive, contentType, _postId, _className }) {

    const [modal, showModal] = useModal();
    const [editor] = useLexicalComposerContext();
    const [postId, setPostId] = useState<number>(0)

    useEffect(() => {

        if (_postId) {
            setPostId(_postId)
        }

    }, [_postId]);


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
                        _postId={postId}
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