import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InsertImagePayload } from "../plugins/imagePlugin/ImagesPlugin";
import { UploadImageDialogBody } from "~/components/admin/editor/plugins/imagePlugin/UploadImageDialog";
import { useEffect, useState } from "react";
import PostTypeService from "~/services/PostTypeService";
import PostTypeModel from "~/models/PostTypeModel";

const CAN_USE_DOM: boolean =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined';

function ContentConfigDialog({
    onClose,
    onSave,
}: {
    onClose: () => void;
    onSave: () => void;
}): JSX.Element {

    const [img, setImg] = useState<InsertImagePayload | null>(null);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [postTypes, setPostTypes] = useState<PostTypeModel[]>([])
    const [selectedPostType, setSelectedPostType] = useState<PostTypeModel | null>(null)

    const onSetImg = (payload: InsertImagePayload) => {
        setImg(payload)
    };

    const onClickSave = () => {
        const metda = { description: description, imgModel: img ? { src: img.src, name: img.imgId ? img.imgId : '' } : null, title: title, type: selectedPostType }
        //onSave(metda);
        onClose()
    };

    useEffect(() => {
        const loadPostTypes = async () => {

            try {
                const pt = await new PostTypeService().Get()
                if (pt) setPostTypes(pt)

            } catch (error) {
                console.error(error)
            }
        }

        loadPostTypes()
    }, []);

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function cleanTitle() {
        setTitle('');
    }

    function handleTypeSelected(e){
        const st = postTypes.find(c => c.name == e.target.value) 
        if(st){
            setSelectedPostType(st)
        } 


    }

    return (
        <>
            <div className="label">
                <span className="label-text">Background img</span>
            </div>
            <UploadImageDialogBody imgClassname="" onImageLoaded={onSetImg} showDialogAction={false} showAlternativeText={false} onClick={() =>{}} />

            <div className="label">
                <span className="label-text">Title</span>
            </div>

            <label className="input input-bordered flex items-center gap-2 ">
                <input value={title}
                    onChange={(e) => handleTitleChange(e)} type="text" className="grow text-black w-full" placeholder="Add a title" />
                <kbd onClick={() => cleanTitle()} className="kbd kbd-sm">X</kbd>
            </label>

            <div className="label">
                <span className="label-text">Type</span>
            </div>

            <select defaultValue={'DEFAULT'} onChange={(e) => handleTypeSelected(e)} className="select select-bordered w-full max-w text-black">
            <option value="DEFAULT" disabled>Choose a type</option>
                {
                    postTypes.map(c => <option key={c.id.toString()}>{c.name}</option>)
                }

            </select>

            <div className="label">
                <span className="label-text">Description</span>
            </div>
            <textarea value={description}
                onChange={(e) => handleDescriptionChange(e)}
                className="textarea textarea-bordered text-black w-full"
                placeholder="Add some description">
            </textarea>

            <div className="">
                <button onClick={() => onClose()} className="btn btn-xs sm:btn-sm md:btn-md m-1">Cancel</button>
                <button onClick={() => onClickSave()} className="btn btn-xs sm:btn-sm md:btn-md m-1">Save</button>
            </div>

        </>
    );
}

function SaveContentModal({ onSave }) {

    function closeModal() {
        const modal = document.getElementById('save_modal') as any;
        modal.close()
    }

    return (
        <><button
            className=""
            onClick={() => {

                    onSave()
            }}
        >
            <FontAwesomeIcon
                icon={faSave}
                className="text-black w-6 h-6"
            />
        </button>
            <dialog id="save_modal" className="modal">
                <div className="modal-box">

                    <ContentConfigDialog onSave={onSave} onClose={closeModal}></ContentConfigDialog>


                </div>
            </dialog></>
    );

}

export default SaveContentModal;