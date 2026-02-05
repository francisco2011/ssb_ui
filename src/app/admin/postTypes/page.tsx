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
import { toast } from 'sonner';
import PaginatedResult from '~/models/PaginatedResult';
import PostTypeRow from '~/components/admin/Row/PostTypeRow';

type option = {
    value: string,
    label: string
}

type LocalState = {
    pageSize: number,
    page: number
}

export default function Posts() {

    const getEmptyState = (): LocalState => {
        return {
            pageSize: 10,
            page: 1
        }
    }

    const [postResponse, setPostResponse] = useState<PaginatedResult<PostTypeModel>>({
        data: [],
        pagination: {
            page: 0,
            pageCount: 0,
            pageSize: 0,
            totalCount: 0
        }
    })

    const [state, setState] = useState<LocalState>(getEmptyState())
    const router = useRouter()

    const service = new PostTypeService();


    async function goTo(id: number) {

        router.push('/admin/postType/' + id, undefined,)
    }

    async function loadData() {

        const offset = state.page == 1 ? 0 : (state.pageSize * (state.page - (state.page == 1 ? 0 : 1)))

        const data = (await service.Get(state.pageSize, offset));
        setPostResponse(data)
    }

    async function loadDataWithParams(_state) {

        const offset = _state.page == 1 ? 0 : (_state.pageSize * (_state.page - (_state.page == 1 ? 0 : 1)))
        const data = await await service.Get(_state.pageSize, offset)

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

    }, []);

    const onClearClicked = async () => {

        const emptyState = getEmptyState()
        setState(emptyState)

        //if (selectInputRef?.current) selectInputRef.current.clearValue()
        await loadDataWithParams(emptyState)
    }

    const executeDelete = async () => {

       // if (!postToDelete || !postToDelete.id) return

       // postService.Delete(postToDelete?.id)
       //     .then(data => {
       //         onClearClicked()
       //     })
       //     .catch(error => toast.error('Post not deleted!'))
    }

    const onDeleteClicked = async (id: number) => {

       // var post = postResponse.posts.find(c => c.id == id)

       // if (!post) return

       // postToDelete = post

       // toast("Are you sure you want to delete " + post.name + "?",
       //     {
       //         action: {
       //             label: 'YES',
       //             onClick: (id) => executeDelete(),
       //         },
       //         cancel: {
       //             label: 'NO',
       //             onClick: () => { },
       //         }

        //    }
       // )

    }
    const onNewClicked = async () => {
        
        var newPostType ={name: "New post type dont forget to change its name", id: 0}
        service.Save(newPostType)
        .then(postType => {
            if (postType?.id) goTo(postType.id)
            toast.success('Post Type created!')
          })
          .catch(error => toast.error('Post Type not created!'))
    }

    return (
        <div className="">

            <div>
                <h1 className='font-extrabold text-4xl mt-4'>Post Types</h1>
            </div>

            <div className='flex flex-row m-8 justify-end'>
                <button onClick={() => onClearClicked()} className="btn btn-sm sm:btn-sm md:btn-md">Clear</button>
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
                            <th className="w-48">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            postResponse?.data.map(c => <PostTypeRow key={c.id} postType={c} onEditClickCallback={goTo} onDeleteClickCallback={onDeleteClicked} />)
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