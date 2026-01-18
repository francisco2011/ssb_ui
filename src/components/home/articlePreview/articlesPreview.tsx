'use client'
import { useCallback, useEffect, useState } from "react";
import PostModel from "~/models/PostModel";
import ArticleCard from "../articleCard.tsx/ArticleCard";
import { useRouter } from "next/navigation";
import PostServiceArticleTransformSA from "~/services/PostServiceArticleTransformSA";
import PostModelResponse from "~/models/PostModelResponse";
import PostService from "~/services/PostService";
import { ContentType } from "~/models/ContentType";

type Props = {
    tags: string[],
    initialPosts: PostModelResponse
}

export default function ArticlesPreview({ tags, initialPosts }: Props): JSX.Element {

    const [posts, setPosts] = useState<PostModel[]>(initialPosts.posts)
    const [offset, setOffset] = useState(3);
    const [hasMoreData, setHasMoreData] = useState(initialPosts.posts.length != 0 && initialPosts.pagination.totalCount > 6);
    const [selectedTags, setSelectedTags] = useState<string[]>(tags)
    const [totalElements, setTotalElements] = useState(initialPosts.pagination.totalCount)
    const router = useRouter()

    const postService = new PostService()

    //useEffect(() => {
    //    setPosts(initialPosts.posts)
    //    setSelectedTags(tags)
    //  }, [initialPosts]);

    const loadMorePosts = async () => {

        const initialPostsCount = posts.length;

        var nextPosts = await postService.List(6, offset, 1, selectedTags, false, [ContentType.descriptionRender, ContentType.preview, ContentType.titleRender]);

        setPosts((prevPosts) => [...prevPosts, ...nextPosts.posts]);
        setOffset((prevOffset) => prevOffset + 6);
        setTotalElements(nextPosts.pagination.totalCount)

        if (nextPosts.posts.length == 0 || initialPostsCount + nextPosts.posts.length == totalElements) {
            setHasMoreData(false);
        }
    };

    const onTagClicked = async (tag: string) => {
        
        router.push('?tag=' + tag)
        router.refresh()
    }

    return (
        <>
        <div className="grid gap-5 place-items-stretch grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols4 2xl:grid-cols4">
        {
            posts.map( c => <ArticleCard key={c.id} onTagClickCallback={onTagClicked} post={c} />)
        }
        </div>

        <div className="text-black flex flex-col items-end">
                {hasMoreData ? (
                    <button className="btn btn-neutral"
                        onClick={() => loadMorePosts()}
                    >
                        Load More
                    </button>
                ) : (
                    <p >No more to load ... &#128517;</p>
                )}
            </div>
        
        </>
    );

}