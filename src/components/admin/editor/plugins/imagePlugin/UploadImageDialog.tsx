import { useEffect, useState } from "react";
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

export function UploadImageDialogBody({
    onClick,
    onClickLoadInline,
    showDialogAction,
    showAlternativeText,
    onImageLoaded,
    imgClassname,
    alreadyLoadedImgUrl,
    allowLoadInline
}: {
    onClick: (payload: InsertImagePayload) => void;
    onClickLoadInline: (payload: InsertInlineImagePayload) => void;
    showDialogAction: boolean,
    showAlternativeText: boolean,
    onImageLoaded: (payload: InsertImagePayload) => void | null;
    imgClassname: string,
    contentType: string,
    alreadyLoadedImgUrl: ImgModel | null,
    allowLoadInline: boolean | undefined
}) {
    const [src, setSrc] = useState('');
    const [imgId, setImgId] = useState(uuidv4());
    const [altText, setAltText] = useState('');
    const [loadInline, setLoadInline] = useState(true)


    const handleChange = () => {
        setLoadInline(!loadInline);
    };

    useEffect(() => {
        if (alreadyLoadedImgUrl && alreadyLoadedImgUrl.src) {
            setSrc(alreadyLoadedImgUrl.src)
            if(alreadyLoadedImgUrl.name) setImgId(alreadyLoadedImgUrl.name)
        }

    }, [alreadyLoadedImgUrl]);

    const isDisabled = src === '';

    const service = new ContentService()

    const loadImageFromStorage = (file: FileFromStorage) => {
        
        if(!file.url) return
        
        setSrc(file.url)
        onImageLoaded({ src: file.url, imgId: file.name, altText: ""})
    }

    const loadImage = async (files: FileList | null) => {

        if (!files) return
        var file = files[0];

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            
           if(reader.result){
            setSrc(reader.result as string)
            onImageLoaded({ src: reader.result, altText: ''})
           } 
            
        });

  if (file) {
    reader.readAsDataURL(file);
  }


 
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


            <div>
                <StorageExplorerModal onContentCallback={loadImageFromStorage}/>
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
                allowLoadInline ?
            
                        <label className="cursor-pointer label">
                            <span className="label-text">Load inline</span>
                            <input type="checkbox"  checked={loadInline} onChange={handleChange}  className="checkbox" />
                        </label>
                    : null
            }



            {
                showDialogAction ? <DialogActions>
                    <Button
                        data-test-id="image-modal-file-upload-btn"
                        disabled={isDisabled}
                        onClick={() => loadInline ? onClickLoadInline({ altText, src, imgId }) : onClick({ altText, src, imgId })}
                    >
                        Confirm
                    </Button>
                </DialogActions> : null
            }

            


        </>
    );
}