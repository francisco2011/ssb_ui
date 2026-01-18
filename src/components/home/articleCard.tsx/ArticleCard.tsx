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
        <div key={post.id} className="card image-full w-28 max-w-28 sm:min-w-36 sm:max-w-36 md:min-w-38 lg:min-w-48 xl:min-w-56 2xl:min-w-56">

            {
                previewUrl ?
                    <figure>
                        <img className="h-auto w-auto"
                            src={previewUrl} />
                    </figure>
                    : null
            }

            <div className="card-body w-28 max-w-28 sm:min-w-36 sm:max-w-36 md:min-w-38 lg:min-w-48 xl:min-w-56 2xl:min-w-56">
                <h6 className="text-right">
                    {format(post.createdAt, "yyyy-MM-dd")}
                </h6>
                <h3 className="card-title line-clamp-2">
                    <Link href={"/home/post/" + post.id} dangerouslySetInnerHTML={{ __html: titleHtml }}></Link>
                </h3>

                <p className="line-clamp-4" dangerouslySetInnerHTML={{ __html: descriptionHtml }}>

                </p>
                <div className="card-actions justify-end line-clamp-3">

                    {
                        post.tags.map(c => <div key={c} onClick={() => onTagClickCallback([c])} className="badge badge-outline cursor-pointer">{c}</div>)
                    }

                </div>
            </div>



        </div>
    );
}