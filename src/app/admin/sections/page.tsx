'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import PostRow from "~/components/admin/Row/PostRow";
import CustomPaginator from '~/components/pagination/CustomPaginator';
import PostModelResponse from '~/models/PostModelResponse';
import PostTypeModel from '~/models/PostTypeModel';
import PostService from "~/services/PostService";
import PostTypeService from '~/services/PostTypeService';
import TagService from '~/services/TagService';
import Select, { SelectInstance } from 'react-select';
import PostModel from '~/models/PostModel';
import PostServiceArticleTransformSA from '~/services/PostServiceArticleTransformSA';
import SectionModel, { SectionModelResponse } from '~/models/SectionModel';
import SectionService from '~/services/SectionService';
import SectionRow from '~/components/admin/Row/SectionRow';

type LocalState = {
    pageSize: number,
    page: number
}

type option = {
    value: string,
    label: string
}


export default function Sections() {

    const getEmptyState = (): LocalState => {
        return {
            pageSize: 10,
            page: 1
        }
    }

    const [postResponse, setPostResponse] = useState<SectionModelResponse>({
        sections: [],
        pagination: {
            page: 0,
            pageCount: 0,
            pageSize: 0,
            totalCount: 0
        }
    })

    const [state, setState] = useState<LocalState>(getEmptyState())
    const [isClient, setIsClient] = useState(false)

    const selectInputRef = useRef<SelectInstance<option | null>>(null)
    const router = useRouter()

    const service = new SectionService();

    async function goTo(id: number | null) {

        router.push('/admin/section/' + id, undefined,)
    }

    async function loadData() {

        const offset = state.page == 1 ? 0 : (state.pageSize * (state.page - (state.page == 1 ? 0 : 1)))

        const data = (await service.List(state.pageSize, offset));
        setPostResponse(data)
    }

    async function loadDataWithParams(_state) {

        const offset = _state.page == 1 ? 0 : (_state.pageSize * (_state.page - (_state.page == 1 ? 0 : 1)))

        const data = (await service.List(_state.pageSize, offset, ));


        setPostResponse(data)
    }

    function handlePageSizeChanged(newPageSize: number) {

        if (state.pageSize == newPageSize) return
        const newState = { ...state, pageSize: newPageSize, page: 1 }
        setState({ ...newState })
        loadDataWithParams(newState)
    }

    function handlePageChanged(newPage: number) {

        if (state.pageSize == newPage) return
        const newState = { ...state, page: newPage }
        setState({ ...newState })
        loadDataWithParams(newState)
    }

    useEffect(() => {

        const load = async () => {
            await loadData();
        }

        load()

        setIsClient(true)

    }, []);

    const onClearClicked = async () => {

        const emptyState = getEmptyState()
        setState(emptyState)

        if (selectInputRef?.current) selectInputRef.current.clearValue()
        await loadDataWithParams(emptyState)
    }

    const onSearchClicked = async () => {
        const newState = { ...state, pageSize: 10, page: 1 }
        setState({ ...newState })

        setState(newState)
        await loadDataWithParams(newState)
    }

    const onDeleteClicked = async (id: number) => {
    //    const p = await postService.Delete(id)
    //    await onClearClicked()
    }

    const onNewClicked = async () => {
        const _section: SectionModel = {
            id: null,
            name: '',
            content: null,
            modifiable: true,
            tag: ''
          };
  
          //const p = await postService.Save(_post)
          await goTo(null)
    }

    return (
        <div className="">

            <div>
                <h1 className='font-extrabold text-4xl mt-4'>Sections</h1>
            </div>

            <div className='flex flex-row m-8 items-end'>

                <button onClick={() => onClearClicked()} className="btn btn-sm sm:btn-sm md:btn-md">Clear</button>
                <div className='ml-1'>
                    <button onClick={() => onSearchClicked()} className="btn btn-sm sm:btn-sm md:btn-md">Search</button>
                </div>
                <div className='ml-1'>
                    <button onClick={() => onNewClicked()} className="btn btn-sm sm:btn-sm md:btn-md">New</button>
                </div>

            </div>
            <div>
                <table className="">
                    <thead>
                        <tr>
                            <th className="w-16">ID</th>
                            <th className="w-48">Name</th>
                            <th className="w-48">Tag</th>
                            <th className="w-32">Modifiable</th>
                            <th className="w-48">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            postResponse?.sections.map(c => <SectionRow key={c.id} section={c} onEditClickCallback={goTo} onDeleteClickCallback={onDeleteClicked} />)
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