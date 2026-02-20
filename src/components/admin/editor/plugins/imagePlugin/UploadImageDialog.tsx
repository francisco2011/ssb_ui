import { useEffect, useRef, useState } from "react";
import { InsertImagePayload } from "./ImagesPlugin";
import FileInput from "~/components/FileInput";
import TextInput from "~/components/TextInput";
import { DialogActions } from "~/components/Dialog";
import Button from "~/components/Button";
import ContentService from "~/services/ContentService";
import ImgModel from "~/models/ImgModel";
import { InsertInlineImagePayload } from "./InlineImagePlugin";
import { v4 as uuidv4 } from 'uuid';
import StorageExplorerModal from "~/components/storageExplorer/storageExplorerModal";
import { FileFromStorage } from "~/components/storageExplorer/storageExplorer";

import ReactCrop, { Crop } from 'react-image-crop';

export function UploadImageDialogBody({

    onClickLoadInline,
    showDialogAction,
    showAlternativeText,
    onImageLoaded,
    imgClassname,
    alreadyLoadedImgUrl
}: {

    onClickLoadInline: (payload: InsertInlineImagePayload) => void;
    showDialogAction: boolean,
    showAlternativeText: boolean,
    onImageLoaded: (payload: InsertImagePayload) => void | null;
    imgClassname: string,
    contentType: string,
    alreadyLoadedImgUrl: ImgModel | null
}) {
    const [src, setSrc] = useState('');
    const [imgId, setImgId] = useState(uuidv4());
    const [altText, setAltText] = useState('');
    const [loadInline, setLoadInline] = useState(true)
    const [crop, setCrop] = useState<Crop>()

    let imgSrcFromCrop = ''

    const imageRef = useRef(null)

    const handleChange = () => {
        setLoadInline(!loadInline);
    };

    useEffect(() => {
        if (alreadyLoadedImgUrl && alreadyLoadedImgUrl.src) {
            setSrc(alreadyLoadedImgUrl.src)
            if (alreadyLoadedImgUrl.name) setImgId(alreadyLoadedImgUrl.name)
        }

    }, [alreadyLoadedImgUrl]);

    const isDisabled = src === '';

    const service = new ContentService()

    const onAccept = async (payload: InsertInlineImagePayload) => {


        var newImg = await makeClientCrop(crop)

        if (newImg != null) {
            await readAsDataURLAsync(newImg).then(src => payload.src = src)
        }

        onClickLoadInline(payload)
    }

    const loadImageFromStorage = (file: FileFromStorage) => {

        if (!file.url) return

        setSrc(file.url)
        onImageLoaded({ src: file.url, imgId: file.name, altText: "" })
    }

    const readAsDataURLAsync = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result); // Resolve on 'load' event
            reader.onerror = (error) => reject(error);   // Reject on 'error' event

            reader.readAsDataURL(file);
        });
    }

    const loadImage = async (files: FileList | null) => {

        if (!files) return
        var file = files[0];

        const reader = new FileReader();

        reader.addEventListener("load", () => {

            if (reader.result) {
                setSrc(reader.result as string)
                onImageLoaded({ src: reader.result, altText: '' })
            }

        });

        if (file) {
            reader.readAsDataURL(file);
        }

    };

    ///////////taken from: https://codesandbox.io/p/sandbox/react-image-crop-demo-s8xr4?file=%2Fsrc%2Findex.js%3A45%2C3-89%2C4

    const makeClientCrop = async (crop) => {
        if (imageRef && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                imageRef.current,
                crop,
                "newFile.png"
            );
            return croppedImageUrl;
        }

        return null
    }

    const getCroppedImg = (image, crop, fileName) => {

        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                //window.URL.revokeObjectURL(this.fileUrl);
                //var fileUrl = window.URL.createObjectURL(blob);
                resolve(new File([blob], fileName));
            }, "image/png");
        });
    }

    return (
        <>
            <></>

            <div className="mb-1 h-[30rem] flex justify-center">

                {
                    src ?
                        <ReactCrop crop={crop} ruleOfThirds onChange={c => setCrop(c)}>
                            <img
                                ref={imageRef}
                                className={imgClassname}
                                alt=""
                                src={src} />
                        </ReactCrop> : null

                }
            </div>


            <div>
                <StorageExplorerModal onContentCallback={loadImageFromStorage} />
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


            <label className="cursor-pointer label">
                <span className="label-text">Load inline</span>
                <input type="checkbox" checked={loadInline} onChange={handleChange} className="checkbox" />
            </label>



            {
                showDialogAction ? <DialogActions>
                    <Button
                        data-test-id="image-modal-file-upload-btn"
                        disabled={isDisabled}
                        onClick={() => onAccept({ altText, src, imgId })}
                    >
                        Confirm
                    </Button>
                </DialogActions> : null
            }




        </>
    );
}