import { useEffect, useRef, useState } from "react";
import FileInput from "~/components/FileInput";
import TextInput from "~/components/TextInput";
import { DialogActions } from "~/components/Dialog";
import Button from "~/components/Button";
import ImgModel from "~/models/ImgModel";
import { v4 as uuidv4 } from 'uuid';
import StorageExplorerModal from "~/components/storageExplorer/storageExplorerModal";
import { FileFromStorage } from "~/components/storageExplorer/storageExplorer";

import ReactCrop, { Crop } from 'react-image-crop';

export type ImageLoaded = {
    altText?: string;
    width?: number | "inherit";
    height?: number | "inherit";
    showCaption?: boolean;
    src: string;
    imgId?: string;
}

export function UploadImageDialogBody({
    onAccept,
    showDialogAction,
    showAlternativeText,
    onImageLoaded,
    alreadyLoadedImgUrl
}: {

    onAccept: (payload: ImageLoaded) => void;
    showDialogAction: boolean,
    showAlternativeText: boolean,
    onImageLoaded: (payload: ImageLoaded) => void | null;
    alreadyLoadedImgUrl: ImgModel | null
}) {
    const [src, setSrc] = useState('');
    const [imgId, setImgId] = useState(uuidv4());
    const [altText, setAltText] = useState('');
    const [crop, setCrop] = useState<Crop>()

    const imageRef = useRef(null)

    useEffect(() => {
        if (alreadyLoadedImgUrl && alreadyLoadedImgUrl.src) {
            setSrc(alreadyLoadedImgUrl.src)
            if (alreadyLoadedImgUrl.name) setImgId(alreadyLoadedImgUrl.name)
        }

    }, [alreadyLoadedImgUrl]);

    const isDisabled = src === '';


    const onClickAccept = async (payload: ImageLoaded) => {

        if (!payload?.src) throw new Error("payload or src can not be null")

        if (crop) {
            var newImg = await makeClientCrop(crop)

            if (newImg != null) {
                await readAsDataURLAsync(newImg).then(src => payload.src = src)
            }
        }


        onAccept(payload)
    }

    const loadImageFromStorage = (file: FileFromStorage) => {

        if (!file.url) return

        setSrc(file.url)
        onImageLoaded({ src: file.url, imgId: file.name, altText: "" })
    }

    const readAsDataURLAsync = async (file): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result as string); // Resolve on 'load' event
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
                //ensured by readAsDataURL
                onImageLoaded({ src: reader.result as string, altText: '' })
            }

        });

        if (file) {
            reader.readAsDataURL(file);
        }

    };

    ///////////taken from: https://codesandbox.io/p/sandbox/react-image-crop-demo-s8xr4?file=%2Fsrc%2Findex.js%3A45%2C3-89%2C4

    const makeClientCrop = async (crop): Promise<File> => {

        if (imageRef && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                imageRef.current,
                crop,
                "newFile.png"
            );
            return croppedImageUrl;
        }

        throw new Error("Crop or imageRef can not be null")
    }

    const getCroppedImg = (image, crop, fileName): Promise<File> => {

        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw Error("ctx can not be null")

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
                    reject(new Error('Canvas is empty'));
                    console.error("Canvas is empty");
                    return;
                }
                resolve(new File([blob], fileName, { type: "image/png" }));
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
                                className="object-fill"
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

            {
                showDialogAction ? <DialogActions>
                    <Button
                        data-test-id="image-modal-file-upload-btn"
                        disabled={isDisabled}
                        onClick={() => onClickAccept({ altText, src, imgId })}
                    >
                        Confirm
                    </Button>
                </DialogActions> : null
            }




        </>
    );
}