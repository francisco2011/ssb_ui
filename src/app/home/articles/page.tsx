
import ArticlesPreview from "~/components/home/articlePreview/articlesPreview";

import TagsDisplay from "~/components/tagCloud/TagsDisplay";
import { ContentType } from "~/models/ContentType";
import PostService from "~/services/PostService";
import TagService from "~/services/TagService";

export default async function Articles({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<JSX.Element> {

    const filters = (await searchParams).tag

    var initialTags: string[] = [];
    
    if(filters){

        if(typeof filters == typeof initialTags){
            initialTags = filters as string[]
        }

        if(typeof filters == typeof ''){
            initialTags.push(filters as string)
        }

    }

    const postService = new PostService()
    const tagService = new TagService();
    const tags = await tagService.List(1)

    console.log("before initial posts ")
    const initialPosts = await postService.List(6, 0, 1, initialTags, true, [ContentType.descriptionRender, ContentType.preview, ContentType.titleRender]);
    console.log(initialPosts)

    return (

        <div id="parent" className="relative h-screen">
            <div className="grid grid-cols-4 gap-4">
            <div  className="col-span-3 ">
                <ArticlesPreview initialPosts={initialPosts} tags={[]} />
            </div>
            <div className="col-span-1">
                <TagsDisplay rootPath="/home/articles" allTags={tags} />
            </div>
            </div>


        </div>



    );

}