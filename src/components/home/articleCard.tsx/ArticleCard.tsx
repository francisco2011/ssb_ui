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
        if (post.contents && post.contents.length > 0) {
            const titleUrl = post.contents.find(c => c.type == ContentType.titleRender)
            const descriptionUrl = post.contents.find(c => c.type == ContentType.descriptionRender)
            var previewContent = post.contents.find(c => c.type == ContentType.preview);

            if (titleUrl && titleUrl.url) {

                const getTitle = async () => {

                    var titleHtml = await service.GetExternalContentAsStr(titleUrl.url)
                    setTitleHtml(titleHtml)
                }

                getTitle()
            }

            if (descriptionUrl && descriptionUrl.url) {
                const getDescription = async () => {

                    var descriptionHtml = await service.GetExternalContentAsStr(descriptionUrl.url)
                    setDescriptionHtml(descriptionHtml)
                }

                getDescription()
            }

            if (previewContent && previewContent.url) setPreviewUrl(previewContent.url)

        }

    }, [])




    return (
        <div key={post.id} className="card card-side m-4 sm:h-24 md:h-32 lg:h-44 xl:h-56">

            {
                previewUrl ?
                    <>
                        <figure className="h-full w-[0%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                            <a href={"/home/post/" + post.id}>
                                <img
                                    className=" object-cover hidden lg:block xl:block 2xl:block"
                                    src={previewUrl} />
                            </a>
                        </figure>
                    </>
                    : null
            }

            <div className="card-body h-full w-[70%]">
                <h6 className="text-right text-sm">
                    {format(post.createdAt, "yyyy-MM-dd")}
                </h6>
                <div className="card-title">
                    <Link className="line-clamp-2 break-all" href={"/home/post/" + post.id} dangerouslySetInnerHTML={{ __html: titleHtml }}></Link>
                </div>

                <div className="line-clamp-2 text-sm" dangerouslySetInnerHTML={{ __html: descriptionHtml }}></div>
                <div className="card-actions mt-0 justify-end hidden lg:block xl:block 2xl:block">

                    {
                        post.tags.map(c => <div key={c} onClick={() => onTagClickCallback([c])} className="badge text-sm badge-outline cursor-pointer">{c}</div>)
                    }

                </div>
            </div>



        </div>
    );
}