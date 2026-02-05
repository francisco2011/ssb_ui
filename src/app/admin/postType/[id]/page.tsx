'use client'
import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Editor, { ContentState } from '~/components/admin/editor/Editor';
import VerticalToolbar from "~/components/admin/editor/VerticalToolbar";
import SectionService from "~/services/SectionService";
import SectionModel from "~/models/SectionModel";
import TextInput from "~/components/TextInput";
import PostTypeService from '~/services/PostTypeService';
import PostTypeModel from '~/models/PostTypeModel';
import TagService from '~/services/TagService';
import TagModel from '~/models/TagModel';
import TagsDisplay from '~/components/tagCloud/TagsDisplay';
import TagPill from '~/components/tagCloud/TagPill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';



export default function PostType() {


    const [tags, setTags] = useState<TagModel[]>([])
    const params = useParams<{ id: string; }>()
    const service = new PostTypeService();
    const tagService = new TagService();

    const [postType, setPostType] = useState<PostTypeModel>({ id: 0, name: "" })

    const editorRef = useRef(null);

    useEffect(() => {

        const get = async () => {

            if (params?.id && params.id != 'none') {
                const p = await service.GetBy(Number(params.id))
                setPostType(p)

                const tags = await tagService.List(p.id)
                setTags(tags)
            }
        }
        get()

    }, []);

    const updateName = (value: string) => {
        setPostType({ ...postType, name: value })
    }

    const onsave = async () => {

       service.Update(postType)
        .then(postType => {
            toast.success('Post Type updated!')
          })
          .catch(error => toast.error('Post Type not updated!'))

    }

    return (
        <main className="flex min-h-screen flex-col">

            <div>
                <h1 className='font-extrabold text-4xl m-4'>{postType.name}</h1>
            </div>

            <div className="w-[50rem] m-4">

                <div>
                    <TextInput onChange={updateName} value={postType.name} label="Name"></TextInput>
                </div>

                <div>
                    <label>
                        Tags
                    </label>

                    <ul className="flex gap-3 my-4 md:my-12 flex-wrap px-4">

                        {tags.map(c => <TagPill onTagClicked={() => { }} tag={c} key={c.term}></TagPill>)}

                    </ul>
                </div>


            </div>

            <div className='content-end'>
                <button
                    className=""
                    onClick={() => {

                        onsave()
                    }}
                >
                    
                    <FontAwesomeIcon
                        icon={faSave}
                        className="text-black w-6 h-6"
                    />
                    
                </button>
            </div>

        </main>
    );
}