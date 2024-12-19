
import ArticlesPreview from "~/components/home/articlePreview/articlesPreview";

import TagsDisplay from "~/components/tagCloud/TagsDisplay";
import PostServiceArticleTransformSA from "~/services/PostServiceArticleTransformSA";
import PostServiceCodeSnippetTransformSA from "~/services/PostServiceCodeSnippetTransformSA";
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

    const tagService = new TagService();
    const tags = await tagService.List(1)

    const initialPosts = await PostServiceArticleTransformSA(6, 0, 1, initialTags, true)

    return (

        <div id="parent" className="relative h-screen">
            <div id="child-bottom" className="w-[1000]">
                <TagsDisplay rootPath="/home/articles" allTags={tags} />
            </div>

            <div id="child-top" className="absolute h-30% ">
                <ArticlesPreview initialPosts={initialPosts} tags={[]} />
            </div>
        </div>



    );

}