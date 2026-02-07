import Link from "next/link";
import PostService from "~/services/PostService";
import { ContentType } from "~/models/ContentType";
import ContentService from "~/services/ContentService";

export default async function Header(): Promise<JSX.Element> {


    let html = ''
    let mainImgSrc = ''

    const service = new PostService()
    const contentService = new ContentService()
    const pt = await service.List(1, 0, 4, [], true, [ContentType.render, ContentType.preview])

    if(pt.posts.length > 0 && pt.posts[0]?.contents.some(c => c.type == ContentType.render && c.url)){

        var content = pt.posts[0]?.contents.find(c => c.type == ContentType.render && c.url)
        mainImgSrc = pt.posts[0]?.contents.find(c => c.type == ContentType.preview)?.url;
        html = await contentService.GetExternalContentAsStr(content?.url?? '')
    }

   
    return (
        <>
            <ul className="menu bg-base-200 min-h-screen sticky top-0 left-0 float-start w-20 sm:w-28 md:w-32 lg:w-38 xl:w-48 2xl:w-52 m:text-sm md:text-lg xl:text-xl">
                <img className="mask mask-circle w-auto" src={mainImgSrc} />

                <div className="text-emerald-100 sm:w-auto md:w-auto lg:w-auto xl:w-auto 2xl::w-auto">
                    {html ?
                        <div dangerouslySetInnerHTML={{ __html: html }}></div> : null
                    }
                </div>

                <li >
                    <Link href="/home/articles">Articles</Link>
                </li>

                <li >

                    <Link href="/home/codeSnippets/">Code Snippets</Link>

                </li>

                <li>
                     <Link href="/home/randomStuff/">Random Stuff</Link>

                </li>

            </ul></>
    );

}