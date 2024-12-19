import { useEffect, useState } from "react";
import { ContentType } from "~/models/ContentType";
import PostModel from "~/models/PostModel";
import Link from 'next/link'
import {format} from 'date-fns'

type Props = {
    post: PostModel;
    onTagClickCallback: any
}


export default function ArticleCard({ post, onTagClickCallback }: Props) {

    const [url, setUrl] = useState<string | null>(null)///TODO REPLACE BY .... BLANK IMG .... 

    useEffect(() => {

        if (post.contents && post.contents.length > 0)


            var cntn = post.contents.find(c => c.type == "preview");

        if (cntn && cntn.url) setUrl(cntn.url)

    }, []);


    return (
        <div key={post.id} className="card  image-full max-w-80 max-h-80  shadow-xl">
            <figure>
                <img
                    src={url}
                    alt="Test" />
            </figure>
            <div className="card-body">
                <h6 className="text-right text-xs">
                    {format(post.createdAt, "yyyy-MM-dd")}
                </h6>
                <h3 className="card-title line-clamp-2">
                    <Link href={"/home/post/" + post.id}>{post.title}</Link>
                </h3>
                
                <p className="line-clamp-4">{post.description}</p>
                <div className="card-actions justify-end line-clamp-3">

                    {
                        post.tags.map(c => <div key={c} onClick={() => onTagClickCallback([c])} className="badge badge-outline cursor-pointer">{c}</div>)
                    }

                </div>
            </div>
        </div>
    );
}