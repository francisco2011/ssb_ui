'use client'
import PostModel from "~/models/PostModel";
import CodeSnippetCard from "../codeSnippetCard/CodeSnippetCard";
import { useEffect, useState } from "react";
import PostServiceCodeSnippetTransformSA from "~/services/PostServiceCodeSnippetTransformSA";
import { useRouter } from 'next/navigation';
import PostModelResponse from "~/models/PostModelResponse";

type Props = {
    tags: string[],
    initialPosts: PostModelResponse
}

export default function CodeSnippetsPreview({ tags, initialPosts }: Props): JSX.Element {

    const [posts, setPosts] = useState<PostModel[]>([])
    const [offset, setOffset] = useState(3);
    const [hasMoreData, setHasMoreData] = useState(initialPosts.posts.length != 0 && initialPosts.totalElements > 3);
    const [selectedTags, setSelectedTags] = useState<string[]>(tags)
    const [totalElements, setTotalElements] = useState(initialPosts.totalElements)
    const router = useRouter()

    useEffect(() => {
        setPosts(initialPosts.posts)
        setSelectedTags(tags)
      }, [initialPosts]);

    const loadMorePosts = async () => {

        const initialPostsCount = posts.length;
        const apiPosts = await PostServiceCodeSnippetTransformSA(3, offset, 5, selectedTags, true)

        setPosts((prevPosts) => [...prevPosts, ...apiPosts.posts]);
        setOffset((prevOffset) => prevOffset + 3);
        setTotalElements(apiPosts.totalElements)

        if (apiPosts.posts.length == 0 || initialPostsCount + apiPosts.posts.length == totalElements) {
            setHasMoreData(false);
        }
    };

    const onTagClicked = async (tag: string) => {
        
        router.push('?tag=' + tag)
        router.refresh()
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-3 place-items-stretch">
                {
                    posts.map(c => <CodeSnippetCard onTagClickCallback={onTagClicked} key={c.id} post={c} />)

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
