'use client'
import PostModel from "~/models/PostModel";
import { useEffect, useRef, useState } from "react";
import ContentService from "~/services/ContentService";
import { ContentType } from "~/models/ContentType";

type Props = {
    post: PostModel;
    onTagClickCallback: (tag: string) => void
}


export default function CodeSnippetCard({ post, onTagClickCallback }: Props) {

    const [titleHtml, setTitleHtml] = useState('')
    const [bodyHtml, setBodyHtml] = useState('')
    const [descriptionHtml, setDescriptionHtml] = useState('')
    const [isShowMore, setIsShowMore] = useState<boolean>(true);
    const ref = useRef<HTMLDivElement>(null);


    const service = new ContentService()
    

    useEffect(() => {
        const loadData = async () => {
            
            var bodyRender = post.contents.find(c => c.type == ContentType.render);
            var titleRender = post.contents.find(c => c.type == ContentType.titleRender)
            var descriptionRender = post.contents.find(c => c.type == ContentType.descriptionRender)

            if(bodyRender && bodyRender.url){
                const bodyHtml = await service.GetExternalContentAsStr(bodyRender.url)
                setBodyHtml(bodyHtml)
            }

            if(titleRender && titleRender.url){
                const titleHtml = await service.GetExternalContentAsStr(titleRender.url)
                setTitleHtml(titleHtml)
            }

            if(descriptionRender && descriptionRender.url){
                const html = await service.GetExternalContentAsStr(descriptionRender.url)
                setDescriptionHtml(html)
            }

        }

        loadData()

    }, [])


    const toggleShowMore = () => {
        const div = ref.current; // corresponding DOM node

        if (div && div.className) {
            div.className = "overflow-hidden rounded-lg" + (isShowMore ? '' : ' h-[150px]');
            setIsShowMore(!isShowMore)
        }

    }

    return (
        <>
            <div ref={ref} key={post.id} className="overflow-hidden rounded-lg h-[10rem]">
                <div className=" text-black">

                    <div dangerouslySetInnerHTML={{ __html: titleHtml }}/>

                    <div className="m-1">
                        {post.tags.map(c => <div key={c} onClick={() => onTagClickCallback(c)} className="badge badge-outline cursor-pointer m-1">
                            {c}
                        </div>)}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3">

                            <div dangerouslySetInnerHTML={{ __html: bodyHtml }}/>


                        </div>

                        <div className="col-span-1">

                            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }}/>


                        </div>
                    </div>

                </div>
            </div>
            <button onClick={() => toggleShowMore()} className="text-gray-600 text-md">{isShowMore ? 'show more...' : 'show less...'}</button>
        </>
    );
}