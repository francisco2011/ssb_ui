
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

    if (filters) {

        if (typeof filters == typeof initialTags) {
            initialTags = filters as string[]
        }

        if (typeof filters == typeof '') {
            initialTags.push(filters as string)
        }

    }

    const postService = new PostService()
    const tagService = new TagService();
    const tags = await tagService.List(1)

    const initialPosts = await postService.List(6, 0, 1, initialTags, true, [ContentType.descriptionRender, ContentType.preview, ContentType.titleRender]);

    return (

        <div id="parent" className="relative">
            <div className="md:hidden lg:hidden xl:hidden 2xl:hidden x:col-span-1 xs:col-span-1 sm:col-span-1 x:block xs:block sm:block">
                <TagsDisplay rootPath="/home/articles" allTags={tags} />
            </div>
            <div className="grid lg:grid-cols-4 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">

                <div className="lg:col-span-3 xl:col-span-3 md:col-span-2 sm:col-span-1">
                    <ArticlesPreview initialPosts={initialPosts} tags={[]} articleTypeId={1} />
                </div>
                <div className="md:block lg:block 2xl:block md:col-span-1 lg:col-span-1 2xl:col-span-1 x:hidden xs:hidden sm:hidden">
                    <TagsDisplay rootPath="/home/articles" allTags={tags} />
                </div>
            </div>




        </div>



    );

}