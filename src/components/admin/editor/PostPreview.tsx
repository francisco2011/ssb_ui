import { UploadImageDialogBody } from "~/components/admin/editor/plugins/imagePlugin/UploadImageDialog";
import { useEffect, useState } from "react";
import PostTypeService from "~/services/PostTypeService";
import PostTypeModel from "~/models/PostTypeModel";
import { InsertImagePayload } from "~/components/admin/editor/plugins/imagePlugin/ImagesPlugin";
import ContentMetadaModel from "~/models/ContentMetadata";
import PostModel from "~/models/PostModel";
import { ContentType } from "~/models/ContentType";

export default function PostPreview({ onChange, post }: { onChange: any, post: PostModel | null }): JSX.Element {

    const [postTypes, setPostTypes] = useState<PostTypeModel[]>([])

    const [state, setState] = useState<ContentMetadaModel>({
        imgModel: null,
        type: null,
        isPublished: false,
        name: null
    })

    const [postId, setPostId] = useState<number>(0)

    const onSetImg = (payload: InsertImagePayload) => {
        
        const newState = { ...state, imgModel: { name: payload.imgId ?? '', src: payload.src } }

        setState(newState)
        onChange(newState)
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

    useEffect(() => {

        if (post && post.id) {
            var img = post.contents.find(c => c.type == ContentType.preview)
            
            setState({
                imgModel: img && img.url ? { name: img.name??'', src: img.url } : null,
                type: post.type,
                isPublished: post.isPublished,
                name: post.name
            })
            setPostId(post.id)
        }


    }, [post]);


    function handleTypeSelected(e) {
        const st = postTypes.find(c => c.name == e.target.value)
        if (st) {
            //setSelectedPostType(st)

            const newState = { ...state, type: st }
            setState(newState)
            onChange(newState)
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newState = { ...state, name: e.target.value }
        setState(newState)
        onChange(newState)
    }

    function onPublishedChange(e) {
        const newState = { ...state, isPublished: e.currentTarget.value == '1' }
        setState(newState)
        onChange(newState)
    }

    return (
        <>
            <div className="bg-base-200">

                <div className="label">
                    <span className="label-text">Name</span>
                </div>

                <div className="mr-2 ml-2">
                    <textarea className="w-auto" onChange={(e) => handleNameChange(e)} value={state?.name??''}>
                    </textarea>
                    
                </div>

                <div className="label">
                    <span className="label-text">Type</span>
                </div>

                <div className="mr-2 ml-2">
                    <select onChange={(e) => handleTypeSelected(e)} value={state.type ? state.type.name : 'DEFAULT'} className="select select-xs select-bordered w-full max-w">
                        <option value="DEFAULT" disabled>Choose a type</option>
                        {
                            postTypes.map(c => <option key={c.id}>{c.name}</option>)
                        }

                    </select>
                </div>

                <div className="label">
                    <span className="label-text">Published</span>
                </div>

                <div className="mr-2 ml-2">

                    <label>
                        <input type="radio" checked={state.isPublished === true} value={1} onChange={onPublishedChange} />
                        yes
                    </label>

                    <label>
                        <input type="radio" checked={state.isPublished === false} value={0} onChange={onPublishedChange} />
                        no
                    </label>

                </div>

                <div className="label">
                    <span className="label-text">Background img</span>
                </div>
                <div className="mr-2 ml-2">
                    <UploadImageDialogBody alreadyLoadedImgUrl={state.imgModel} imgClassname="h-46 w-48" onImageLoaded={onSetImg} showDialogAction={false} showAlternativeText={false} onClick={() => { }} />
                </div>
            </div>



        </>
    );
}
