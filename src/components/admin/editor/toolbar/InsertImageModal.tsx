import { faImage, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { LexicalEditor } from "lexical";
import { ImageLoaded, UploadImageDialogBody } from "~/components/admin/imageUploader/UploadImageDialog";
import { INSERT_INLINE_IMAGE_COMMAND, InsertInlineImagePayload } from "../plugins/imagePlugin/InlineImagePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useModal from "~/components/useModal";

function ImageDialog({
    activeEditor,
    onClose,
    contentType,
}: {
    activeEditor: LexicalEditor;
    onClose: () => void;
    contentType: string,
}): JSX.Element {

    const onClickLoadInline = (payload: ImageLoaded) => {

        let transformedPayload: InsertInlineImagePayload = {
            src: payload.src, imgId: payload.imgId, altText: payload?.altText ?? '',
            height: 'inherit'
        }

        activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, transformedPayload);
        onClose();
    };



    return (
        <>
            <UploadImageDialogBody alreadyLoadedImgUrl={null} onAccept={onClickLoadInline} contentType={contentType} onImageLoaded={() => { } } showDialogAction={true} showAlternativeText={true}/>
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