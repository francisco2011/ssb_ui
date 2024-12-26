'use client'

import { stat } from 'fs';
import { pages } from 'next/dist/build/templates/app-page';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import PostRow from "~/components/admin/Row/PostRow";
import CustomPaginator from '~/components/pagination/CustomPaginator';
import PostModelResponse from '~/models/PostModelResponse';
import PostTypeModel from '~/models/PostTypeModel';
import TagModel from '~/models/TagModel';
import PostService from "~/services/PostService";
import PostTypeService from '~/services/PostTypeService';
import TagService from '~/services/TagService';
import Select from 'react-select';

type LocalState = {
    selectedTags: string[],
    type: PostTypeModel | null,
    pageSize: number,
    page: number
}

type option = {
    value: string,
    label: string
}


export default function Posts() {

    const getEmptyState = (): LocalState => {
        return {
            selectedTags: [],
            type: null,
            pageSize: 10,
            page: 1
        }
    }

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
    const [tags, setTags] = useState<option[]>([])
    const [state, setState] = useState<LocalState>(getEmptyState())

    const selectInputRef = useRef(null);
    const router = useRouter()

    const postService = new PostService();

    async function goTo(id: number) {

        router.push('/admin/editor/' + id, undefined,)
    }

    async function loadData() {

        const offset = state.page == 1 ? 0 : (state.pageSize * (state.page - (state.page == 1 ? 0 : 1)))

        const data = (await postService.List(state.pageSize, offset));
        setPostResponse(data)
    }

    async function loadDataWithParams(_state) {

        const offset = _state.page == 1 ? 0 : (_state.pageSize * (_state.page - (_state.page == 1 ? 0 : 1)))

        const data = (await postService.List(_state.pageSize, offset, _state.type?.id ?? null, _state.selectedTags));
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
            const options = tags.map(c => { return { value: c.term, label: c.term } })

            setTags(options)
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
        const newState = { ...state, pageSize: newPageSize, page: 1 }
        setState({ ...newState })
        loadDataWithParams(newState)
    }

    function  handlePageChanged(newPage: number) {

        if (state.pageSize == newPage) return
        const newState = { ...state, page: newPage }
        setState({ ...newState })
        loadDataWithParams(newState)
    }

    useEffect(() => {

        loadData();
        loadPostTypes()
        loadTags()

    }, []);

    const onClearClicked = async () => {

        const emptyState = getEmptyState()
        setState(emptyState)

        if(selectInputRef?.current)  selectInputRef.current.clearValue()
        await loadDataWithParams(emptyState)
    }

    const onSearchClicked = async () => {
        const newState = { ...state, pageSize: 10, page: 1 }
        setState({ ...newState })

        setState(newState)
        await loadDataWithParams(newState)
    }

    const onTagSelected = (tags: option[]) => {
        const newState = { ...state, selectedTags: tags.map(c => { return c.label }) }
        setState({ ...newState })

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
                        <select onChange={(e) => handleTypeSelected(e)} value={state.type ? state.type.name : 'DEFAULT'} className="select select-sm select-bordered">
                            <option value="DEFAULT" disabled>Choose a type</option>
                            {
                                postTypes.map(c => <option key={c.id}>{c.name}</option>)
                            }

                        </select>
                    </div>
                </div>

                <div>
                    <div className="label">
                        <span className="label-text">Tags</span>
                    </div>

                    <div className="mr-2 ml-2">

                        <Select
                            onChange={onTagSelected}
                            options={tags}
                            isMulti
                            ref={selectInputRef}
                            className='select-bordered size-xs'
                        />

                    </div>
                </div>


                <button onClick={() => onClearClicked()} className="btn btn-sm sm:btn-sm md:btn-md">Clear</button>
                <div className='ml-1'>
                <button onClick={() => onSearchClicked()} className="btn btn-sm sm:btn-sm md:btn-md">Search</button>
                </div>
                
            </div>
            <div>
                <table className="">
                    <thead>
                        <tr>
                            <th className="w-16">ID</th>
                            <th className="w-32">Title</th>
                            <th className="w-96">Description</th>
                            <th className="w-48">Type</th>
                            <th className="w-32">Date</th>
                            <th className="w-96">Tags</th>
                            <th className="w-16">published</th>
                            <th className="w-48">Actions</th>
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