import PostModel from "~/models/PostModel";
import { useRef, useState } from "react";
import ContentService from "~/services/ContentService";
import { ContentType } from "~/models/ContentType";

type Props = {
    post: PostModel;
    onTagClickCallback: (tag: string) => void
}


export default async function CodeSnippetCard({ post, onTagClickCallback }: Props) {

    const [isShowMore, setIsShowMore] = useState<boolean>(true);
    const ref = useRef<HTMLDivElement>(null);

    const service = new ContentService()
    
    let titleHtml = ''
    let bodyHtml = ''
    
    var bodyRender = post.contents.find(c => c.type == ContentType.render);
    var titleRender = post.contents.find(c => c.type == ContentType.titleRender)

    if(bodyRender && bodyRender.url){
        bodyHtml = await service.GetExternalContentAsStr(bodyRender.url)
    }

    if(titleRender && titleRender.url){
         titleHtml = await service.GetExternalContentAsStr(titleRender.url)
    }


    const toggleShowMore = () => {
        const div = ref.current; // corresponding DOM node

        if (div && div.className) {
            div.className = "overflow-hidden rounded-lg" + (isShowMore ? '' : ' h-[150px]');
            setIsShowMore(!isShowMore)
        }

    }

    return (
        <>
            <div ref={ref} key={post.id} className="overflow-hidden rounded-lg h-[150px]">
                <div className=" text-black">



                    <h1 className="text-md font-bold">{post.title}</h1>
                    <div className="m-1">
                        {post.tags.map(c => <div key={c} onClick={() => onTagClickCallback(c)} className="badge badge-outline cursor-pointer m-1">
                            {c}
                        </div>)}
                    </div>

                    <div className="grid grid-cols-[40%_60%]">
                        <div >

                            <div style={{width: post._contentHtml?.width}} dangerouslySetInnerHTML={{ __html: bodyHtml }}/>


                        </div>
                    </div>

                </div>
            </div>
            <button onClick={() => toggleShowMore()} className="text-gray-600 text-md">{isShowMore ? 'show more...' : 'show less...'}</button>
        </>
    );
}