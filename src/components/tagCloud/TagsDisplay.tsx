'use client'
import { useCallback, useEffect, useState } from "react";
import TagModel from "~/models/TagModel";
import TagPill from "./TagPill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faBroom, faEraser, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';


type Props = {
    allTags: TagModel[],
    rootPath: string
}

export default function TagsDisplay({ allTags, rootPath }: Props): JSX.Element {

    const router = useRouter()
    const selectedTags: string[] = []

    const onTagClicked = useCallback((word: string) => {

        const index = selectedTags.indexOf(word)

        if (index != -1) {
            selectedTags.splice(index, 1);
        } else {
            selectedTags.push(word)
        }
    }, []);

    const onEraseClicked = () => {
        router.push(rootPath)
    }

    const onBackClicked = () => {
        router.back()
    }

    const onSearchSelected = useCallback(() => {

        let url = "?"
        
        console.log(selectedTags)

        selectedTags.forEach(c => {  url+="&tag=" + c })
        
        router.push(url)
    },[]);

    return (

        <><ul className="flex gap-3 my-4 md:my-12 flex-wrap justify-center px-4 md:px-8 ">

            {allTags.map(c => <TagPill onTagClicked={onTagClicked} tag={c} key={c.term}></TagPill>)}

        </ul>
            <div className="">

            <button
                    className={''}
                    onClick={() => {
                        onBackClicked()
                    }}
                >
                    <FontAwesomeIcon
                        icon={faBackward}
                        className="text-slate-700 w-8 h-8 cursor-pointer ml-2"
                    />
                </button>

                <button

                    className={''}
                    onClick={() => {
                        onEraseClicked()
                    }}
                >
                    <FontAwesomeIcon
                        icon={faEraser}
                        className="text-slate-700 w-10 h-10 cursor-pointer"
                    />
                </button>
                
                <button
                    className={''}
                    onClick={() => {
                        onSearchSelected()
                    }}
                >
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-slate-700 w-8 h-8 cursor-pointer ml-2"
                    />
                </button>

            </div>
        </>


    );

}