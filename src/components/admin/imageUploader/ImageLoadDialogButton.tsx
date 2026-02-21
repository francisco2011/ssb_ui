import { faImage, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ImageLoaded, UploadImageDialogBody } from "~/components/admin/imageUploader/UploadImageDialog";
import useModal from "~/components/useModal";

export type props = {
    onAccept: (payload: ImageLoaded) => void;
    isActive: boolean;

}

export function ImageLoadDialogButton({ isActive, onAccept }: props) {

    const [modal, showModal, onClose] = useModal();

    function onAcceptClick (payload: ImageLoaded) {
        onAccept(payload)
        onClose()
    }


    return (
        <><button
            className={clsx(
                "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
                isActive ? "bg-gray-600" : "bg-gray-400"
            )}
            onClick={() => {
                showModal('Load image', (onClose) => (
                    <UploadImageDialogBody alreadyLoadedImgUrl={null} onAccept={onAcceptClick} onImageLoaded={() => { } } showDialogAction={true} showAlternativeText={true}/>

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

export default ImageLoadDialogButton;