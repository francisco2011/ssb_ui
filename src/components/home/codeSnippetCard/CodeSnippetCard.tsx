'use client'
import PostModel from "~/models/PostModel";
import { useRef, useState } from "react";

type Props = {
    post: PostModel;
    onTagClickCallback: (tag: string) => void
}


export default function CodeSnippetCard({ post, onTagClickCallback }: Props) {

    const [isShowMore, setIsShowMore] = useState<boolean>(true);
    const ref = useRef<HTMLDivElement>(null);

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
                        <div className="">
                            <p className="text-sm font-normal text-gray-500">{post.description}</p>
                        </div>
                        <div >

                            <div style={{width: post._contentWidth}} dangerouslySetInnerHTML={{ __html: post._htmlContent }} >

                            </div>


                        </div>
                    </div>

                </div>
            </div>
            <button onClick={() => toggleShowMore()} className="text-gray-600 text-md">{isShowMore ? 'show more...' : 'show less...'}</button>
        </>
    );
}