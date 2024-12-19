import CodeSnippetsPreview from "~/components/home/codeSnippetsPreview/CodeSnippetsPreview";
import TagsDisplay from "~/components/tagCloud/TagsDisplay";
import TagService from "~/services/TagService";
import PostServiceCodeSnippetTransformSA from "~/services/PostServiceCodeSnippetTransformSA";


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
    const tags = await tagService.List(5)

    const initialPosts = await PostServiceCodeSnippetTransformSA(3, 0, 5, initialTags, true)

    return (

        <div id="parent" className="relative h-screen">
            <div id="child-bottom" className="w-[1000] z-40">
                <TagsDisplay rootPath="/home/codeSnippets" allTags={tags} />
            </div>

            <div id="child-top" className="absolute">
                <CodeSnippetsPreview initialPosts={initialPosts} tags={initialTags} />
            </div>
        </div>



    );

}