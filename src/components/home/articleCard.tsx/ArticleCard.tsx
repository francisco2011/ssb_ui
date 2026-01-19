'use client'
import { ContentType } from "~/models/ContentType";
import PostModel from "~/models/PostModel";
import Link from 'next/link'
import { format } from 'date-fns'
import ContentService from "~/services/ContentService";
import { useEffect, useState } from "react";

type Props = {
    post: PostModel;
    onTagClickCallback: any
}


export default function ArticleCard({ post, onTagClickCallback }: Props) {

    const [titleHtml, setTitleHtml] = useState('')
    const [descriptionHtml, setDescriptionHtml] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')

    const service = new ContentService()

    useEffect(() => {
            if (post.contents && post.contents.length > 0){
            const titleUrl =   post.contents.find(c => c.type == ContentType.titleRender)
            const descriptionUrl =   post.contents.find(c => c.type == ContentType.descriptionRender)
            var previewContent = post.contents.find(c => c.type == ContentType.preview);
         
            if(titleUrl && titleUrl.url){
                
                const getTitle = async () => {

                    var titleHtml = await service.GetExternalContentAsStr(titleUrl.url)
                    setTitleHtml(titleHtml)
                }

                getTitle()
            }
            
            if(descriptionUrl && descriptionUrl.url){
                const getDescription = async () => {

                    var descriptionHtml = await service.GetExternalContentAsStr(descriptionUrl.url)
                    setDescriptionHtml(descriptionHtml)
                }

                getDescription()
            }

            if(previewContent && previewContent.url) setPreviewUrl(previewContent.url)
            
        }

    }, [])
    



    return (
        <div key={post.id} className="card  image-full w-max-56 h-max-56 2xl:w-[18rem] 2xl:h-56 xl:w-[16rem] xl:h-52 lg:w-48 lg:h-48 md:w-40 md:h-40 sm:w-36 sm:h-36 m-4">

            {
                previewUrl ?
                    <figure>
                        <img className="h-auto w-auto"
                            src={previewUrl} />
                    </figure>
                    : null
            }

            <div className="card-body">
                <h6 className="text-right">
                    {format(post.createdAt, "yyyy-MM-dd")}
                </h6>
                <div className="card-title">
                    <Link className="line-clamp-2 break-all" href={"/home/post/" + post.id} dangerouslySetInnerHTML={{ __html: titleHtml }}></Link>
                </div>

                <div className="line-clamp-2 text-xs" dangerouslySetInnerHTML={{ __html: descriptionHtml }}></div>
                <div className="card-actions justify-end line-clamp-1">

                    {
                        post.tags.map(c => <div key={c} onClick={() => onTagClickCallback([c])} className="badge badge-outline cursor-pointer">{c}</div>)
                    }

                </div>
            </div>



        </div>
    );
}