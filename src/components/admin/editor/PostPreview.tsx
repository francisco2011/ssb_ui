import { UploadImageDialogBody } from "~/components/plugins/imagePlugin/UploadImageDialog";
import { useEffect, useState } from "react";
import PostTypeService from "~/services/PostTypeService";
import PostTypeModel from "~/models/PostTypeModel";
import { InsertImagePayload } from "~/components/plugins/imagePlugin/ImagesPlugin";
import ContentMetadaModel from "~/models/ContentMetadata";
import PostModel from "~/models/PostModel";
import { ContentType } from "~/models/ContentType";

export default function PostPreview({ onChange, post }: { onChange: any, post: PostModel | null }): JSX.Element {

    const [postTypes, setPostTypes] = useState<PostTypeModel[]>([])

    const [state, setState] = useState<ContentMetadaModel>({
        description: '',
        title: '',
        imgModel: null,
        type: null
    })

    const [postId, setPostId] = useState<number>(0)

    const onSetImg = (payload: InsertImagePayload) => {
        //setImg(payload)
        // TODO: see that weird payload.imgId??''
        setState({ ...state, imgModel: { name: payload.imgId ?? '', src: payload.src } })
        onChange(state)
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

            var img = post.contents.find(c => c.type == "preview")
            setState({
                description: post.description,
                imgModel: img && img.name && img.url ? { name: img.name, src: img.url } : null,
                title: post.title,
                type: post.type
            })

            setPostId(post.id)
        }
        

    }, [post]);

    function handleDescriptionChange(e) {
        //setDescription(e.target.value);
        setState({ ...state, description: e.target.value })
        onChange(state)
    }

    function handleTitleChange(e) {
        //setTitle(e.target.value);
        setState({ ...state, title: e.target.value })
        onChange(state)
    }

    function handleTypeSelected(e) {
        const st = postTypes.find(c => c.name == e.target.value)
        if (st) {
            //setSelectedPostType(st)
            
            const newState = { ...state, type: st }
            setState({...newState})
            onChange(newState)
        }
    }

    return (
        <>
            <div className="bg-base-200">

                <div className="text-center">Preview</div>


                <div className="label">
                    <span className="label-text">Background img</span>
                </div>
                <div className="mr-2 ml-2">
                    <UploadImageDialogBody alreadyLoadedImgUrl={state.imgModel} postId={postId} contentType={'preview'} imgClassname="h-46 w-48" onImageLoaded={onSetImg} showDialogAction={false} showAlternativeText={false} onClick={() => { }} />
                </div>


                <div className="label">
                    <span className="label-text">Title</span>
                </div>

                <div className="mr-2 ml-2">

                    <textarea value={state.title}
                        onChange={(e) => handleTitleChange(e)}
                        className="textarea textarea-bordered textarea-xs text-black w-full"
                        placeholder="Add a title"
                    >
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
                    <span className="label-text">Description</span>
                </div>

                <div className="mr-2 ml-2">
                    <textarea value={state.description}
                        onChange={(e) => handleDescriptionChange(e)}
                        className="textarea textarea-xs textarea-bordered text-black w-full"
                        placeholder="Add some description">
                    </textarea>

                </div>
            </div>



        </>
    );
}
