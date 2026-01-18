import Link from "next/link";
import PostService from "~/services/PostService";
import { ContentType } from "~/models/ContentType";
import ContentService from "~/services/ContentService";

export default async function Header(): Promise<JSX.Element> {


    let html = ''

    const service = new PostService()
    const contentService = new ContentService()
    const pt = await service.List(1, 0, 4, [], true, [ContentType.render])

    if(pt.posts.length > 0 && pt.posts[0]?.contents.some(c => c.type == ContentType.render && c.url)){

        var content = pt.posts[0]?.contents.find(c => c.type == ContentType.render && c.url)
        html = await contentService.GetExternalContentAsStr(content?.url?? '')
    }

   
    return (
        <>
            <ul className="menu bg-base-200 h-full sticky top-0 left-0 float-start w-20 sm:w-28 md:w-32 lg:w-38 xl:w-48 2xl:w-52">
                <img className="mask mask-circle w-auto" src="https://64.media.tumblr.com/babc8de29c294b0b95adb2842c45df20/79b134f59e9d213e-62/s500x750/e81261d5840d3bcb4d3b6143c0ed8db41d2c5334.jpg" />

                <div className="text-emerald-100 sm:w-auto md:w-auto lg:w-auto xl:w-auto 2xl::w-auto">
                    {html ?
                        <div dangerouslySetInnerHTML={{ __html: html }}></div> : null
                    }
                </div>

                <li className="w-auto">

                    <Link href="/home/articles">Articles</Link>

                </li>

                <li className="w-auto">

                    <Link href="/home/codeSnippets/">Code Snippets</Link>

                </li>

                <li className="w-auto">

                    <Link href="/home/randomStuff/">Random Stuff</Link>

                </li>

                <li className="w-auto">

                    <Link href="/home/proyects/">Proyects</Link>

                </li>


            </ul></>
    );

}