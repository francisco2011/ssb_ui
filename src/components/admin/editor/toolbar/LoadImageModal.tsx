import { faImage, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import ButtonProps from "./props/IButtonProps";

import { INSERT_IMAGE_COMMAND, InsertImagePayload } from "../plugins/imagePlugin/ImagesPlugin";
import { UploadImageDialogBody } from "~/components/admin/editor/plugins/imagePlugin/UploadImageDialog";
import { ContentType } from "~/models/ContentType";
import { useEffect, useState } from "react";

const CAN_USE_DOM: boolean =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined';

function InsertImageDialog({
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

    useEffect(() => {

        if(_postId){
            setPostId(_postId)
        }

      }, [_postId]);

    return (
        <>
            <UploadImageDialogBody alreadyLoadedImgUrl={null} contentType={contentType} postId={postId} onImageLoaded={() => { } } onClick={onClick} showDialogAction={true} showAlternativeText={true} imgClassname={imgClassName} />
        </>
    );
}

function LoadImageModal({ isActive, currentEditor, contentType, _postId, _className }) {

    const [postId, setPostId] = useState<number>(0)

    function closeModal() {
        const modal = document.getElementById('my_modal_1') as any;
        modal.close()
    }

    useEffect(() => {

        if(_postId){
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
                if (CAN_USE_DOM) {

                    const modal : any = CAN_USE_DOM && document ? document.getElementById('my_modal_1') : null
                    if (modal) modal.showModal()
                }
            }}
        >
            <FontAwesomeIcon
                icon={faImage}
                className="text-white w-3.5 h-3.5" />
        </button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">

                    <InsertImageDialog
                        activeEditor={currentEditor}
                        onClose={closeModal}
                        contentType = {contentType}
                        _postId = {postId}
                        imgClassName = {_className}
                    />

                </div>
            </dialog></>
    );

}

export default LoadImageModal;