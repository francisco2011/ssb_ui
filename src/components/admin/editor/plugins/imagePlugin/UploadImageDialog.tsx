import { useEffect, useState } from "react";
import { InsertImagePayload } from "./ImagesPlugin";
import FileInput from "~/components/FileInput";
import TextInput from "~/components/TextInput";
import { DialogActions } from "~/components/Dialog";
import Button from "~/components/Button";
import ContentService from "~/services/ContentService";
import { ContentType } from "~/models/ContentType";
import ContentModel from "~/models/ContentModel";
import ImgModel from "~/models/ImgModel";

export function UploadImageDialogBody({
    onClick,
    showDialogAction,
    showAlternativeText,
    onImageLoaded,
    imgClassname,
    postId,
    contentType,
    alreadyLoadedImgUrl
}: {
    onClick: (payload: InsertImagePayload) => void;
    showDialogAction: boolean,
    showAlternativeText: boolean,
    onImageLoaded: (payload: InsertImagePayload) => void | null;
    imgClassname: string,
    postId: number,
    contentType: string,
    alreadyLoadedImgUrl: ImgModel | null
}) {
    const [src, setSrc] = useState('');
    const [imgId, setImgId] = useState('');
    const [altText, setAltText] = useState('');
    
    var _postId = postId;

    useEffect(() => {
        _postId = postId

        if(alreadyLoadedImgUrl && alreadyLoadedImgUrl.src && alreadyLoadedImgUrl.name){
            setSrc(alreadyLoadedImgUrl.src)
            setImgId(alreadyLoadedImgUrl.name)
        }

      }, [postId]);

    const isDisabled = src === '';

    const service = new ContentService()

    const loadImage = async (files: FileList | null) => {

        if (!files) return

        //const reader = new FileReader();
        //reader.onload = function () {
        //    if (typeof reader.result === 'string') {
        //        setSrc(reader.result);
        //    }
        //    return '';
        //};
        //if (files !== null && files.length > 0) {
        var file = files[0];

        if (file) {
            const result = await service.UploadFile(file, _postId, contentType)

            if (result.url) setSrc(result.url)
            if (result.name) setImgId(result.name)

            if(onImageLoaded && result.url && result.name) onImageLoaded({ altText: '', src: result.url, imgId: result.name })
        }

        //    if (file) reader.readAsDataURL(file);
        //}
    };

    return (
        <>
            <></>

            <div className="mb-1 flex justify-center items-center">

                {
                    src ?
                        <img
                            className={imgClassname}
                            alt=""
                            src={src} /> : null

                }
            </div>



            <FileInput
                onChange={loadImage}
                accept="image/*"
                data-test-id="image-modal-file-upload"
            />

            <TextInput
                        placeholder="External source"
                        onChange={setSrc}
                        value={src}
                    />

            {
                showAlternativeText ?
                    <TextInput
                        placeholder="Descriptive alternative text"
                        onChange={setAltText}
                        value={altText}
                        data-test-id="image-modal-alt-text-input"
                    /> : null
            }



            {
                showDialogAction ? <DialogActions>
                    <Button
                        data-test-id="image-modal-file-upload-btn"
                        disabled={isDisabled}
                        onClick={() => onClick({ altText, src, imgId })}
                    >
                        Confirm
                    </Button>
                </DialogActions> : null
            }


        </>
    );
}