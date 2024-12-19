'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import PostRow from "~/components/admin/Row/PostRow";
import PostModel from "~/models/PostModel";
import PostTypeModel from '~/models/PostTypeModel';
import TagModel from '~/models/TagModel';
import PostService from "~/services/PostService";
import PostTypeService from '~/services/PostTypeService';
import TagService from '~/services/TagService';

export default function Posts() {

    const [posts, setPosts] = useState<PostModel[]>([])

    const [postTypes, setPostTypes] = useState<PostTypeModel[]>([])
    const [tags, setTags] = useState<TagModel[]>([])
    const [state, setState] = useState<any>({
        selectedTags: [],
        type: null
    })

    const router = useRouter()

    var postService = new PostService();

    async function goTo(id: number) {

        router.push('/admin/editor/' + id, undefined,)
    }

    async function loadData(_tags) {
        const data = (await postService.List(10, 0));
        setPosts(data)
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

    useEffect(() => {

        loadData([]);
        loadPostTypes()
        loadTags()

    }, []);

    return (
        <div className="max-w-fit fixed top-5 overflow-x-auto">

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

            <table className="rounded-full  border-spacing-4">
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
                        posts.map(c => <PostRow key={c.id} post={c} onEditClickCallback={goTo} />)
                    }
                </tbody>
            </table>
        </div>
    );
}