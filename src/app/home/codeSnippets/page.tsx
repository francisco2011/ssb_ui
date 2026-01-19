import CodeSnippetsPreview from "~/components/home/codeSnippetsPreview/CodeSnippetsPreview";
import TagsDisplay from "~/components/tagCloud/TagsDisplay";
import TagService from "~/services/TagService";
import { ContentType } from "~/models/ContentType";
import PostService from "~/services/PostService";


export default async function CodeSnippets({
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
    const postService = new PostService();
    const tags = await tagService.List(5)

    const initialPosts = await postService.List(3, 0, 5, initialTags, true, [ContentType.render, ContentType.titleRender, ContentType.descriptionRender]);

    return (

        <div id="parent" className="relative">
            <div className="grid grid-cols-3">
                <div  className="col-span-2">
                     <CodeSnippetsPreview initialPosts={initialPosts} tags={initialTags} />
                    
                </div>
                <div className="col-span-1">
                   <TagsDisplay rootPath="/home/codeSnippets" allTags={tags} />
                </div>
            </div>
        </div>



    );

}