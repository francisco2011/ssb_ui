'use client'

import { stat } from 'fs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import PostRow from "~/components/admin/Row/PostRow";
import CustomPaginator from '~/components/pagination/CustomPaginator';
import PostModelResponse from '~/models/PostModelResponse';
import PostTypeModel from '~/models/PostTypeModel';
import TagModel from '~/models/TagModel';
import PostService from "~/services/PostService";
import PostTypeService from '~/services/PostTypeService';
import TagService from '~/services/TagService';

type LocalState = {
    selectedTags: string[],
    type: PostTypeModel | null,
    pageSize: number,
    page: number
}

export default function Posts() {

    const [postResponse, setPostResponse] = useState<PostModelResponse>({
        posts: [],
        pagination: {
            page: 0,
            pageCount: 0,
            pageSize: 0,
            totalCount: 0
        }
    })

    const [postTypes, setPostTypes] = useState<PostTypeModel[]>([])
    const [tags, setTags] = useState<TagModel[]>([])
    const [state, setState] = useState<LocalState>({
        selectedTags: [],
        type: null,
        pageSize: 10,
        page: 1
    })

    const router = useRouter()

    var postService = new PostService();

    async function goTo(id: number) {

        router.push('/admin/editor/' + id, undefined,)
    }

    async function loadData(_tags) {

        const offset = state.page == 1 ? 0 : (state.pageSize * ( state.page - ( state.page == 1 ? 0 : 1)))

        console.log(offset)

        const data = (await postService.List(state.pageSize, offset ));
        setPostResponse(data)
    }

    const loadPostTypes = async () => {

        try {
            const pt = await new PostTypeService().Get()
            if (pt) setPostTypes(pt)

        } catch (error) {
            console.error(error)
        }
    }

    const loadTags = async () => {

        try {
            const tags = await new TagService().List()
            setTags(tags)
        } catch (error) {
            console.error(error)
        }

    }

    function handleTypeSelected(e) {
        const st = postTypes.find(c => c.name == e.target.value)
        if (st) {
            //setSelectedPostType(st)

            const newState = { ...state, type: st }
            setState({ ...newState })

        }
    }

    function handlePageSizeChanged(newPageSize: number) {

        if (state.pageSize == newPageSize) return
        const newState = { ...state, pageSize: newPageSize }
        setState({ ...newState })
    }

    function handlePageChanged(newPage: number) {

        if (state.pageSize == newPage) return
        const newState = { ...state, page: newPage }
        setState({ ...newState })
    }

    useEffect(() => {

        loadData([]);
        loadPostTypes()
        loadTags()

    }, []);

    const onSearchClicked = () => {
        loadData([]);
    }

    return (
        <div className="">

            <div>
                <h1 className='font-extrabold text-4xl mt-4'>Posts</h1>
            </div>

            <div className='flex flex-row m-8 items-end'>
                <div>
                    <div className="label">
                        <span className="label-text">Type</span>
                    </div>

                    <div className="mr-2 ml-2">
                        <select onChange={(e) => handleTypeSelected(e)} value={state.type ? state.type.name : 'DEFAULT'} className="select select-xs select-bordered">
                            <option value="DEFAULT" disabled>Choose a type</option>
                            {
                                postTypes.map(c => <option key={c.id}>{c.name}</option>)
                            }

                        </select>
                    </div>
                </div>

                <div>
                    <div className="label">
                        <span className="label-text">Type</span>
                    </div>

                    <div className="mr-2 ml-2">
                        <select onChange={(e) => handleTypeSelected(e)} value={state.type ? state.type.name : 'DEFAULT'} className="select select-xs select-bordered">
                            <option value="DEFAULT" disabled>Choose a type</option>
                            {
                                tags.map(c => <option key={c.term}>{c.term}</option>)
                            }

                        </select>
                    </div>
                </div>



                <button onClick={() => onSearchClicked()} className="btn btn-sm sm:btn-sm md:btn-md">Search</button>
            </div>
            <div>
                <table className="">
                    <thead>
                        <tr>
                            <th className="w-32">Title</th>
                            <th className="w-96">Description</th>
                            <th className="w-48">Type</th>
                            <th className="w-32">Date</th>
                            <th className="w-96">Tags</th>
                            <th className="w-32">published</th>
                            <th className="w-60">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            postResponse?.posts.map(c => <PostRow key={c.id} post={c} onEditClickCallback={goTo} />)
                        }
                    </tbody>
                </table>
            </div>
            <CustomPaginator onPageSelected={handlePageChanged} onPageSizeChanged={handlePageSizeChanged} model={postResponse?.pagination} ></CustomPaginator>

            <div>

            </div>
        </div>
    );
}