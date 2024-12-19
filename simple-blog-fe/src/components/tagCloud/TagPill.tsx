import { useCallback, useEffect, useState } from "react";
import TagModel from "~/models/TagModel";

type Props = {
    tag: TagModel;
    onTagClicked: (tag: string) => void
}

export default function TagsDisplay({ tag, onTagClicked }: Props): JSX.Element {

    const [isClicked, setIsClicked] = useState<boolean>(false)

    const onClick = (val) => {
        onTagClicked(val)
        setIsClicked(!isClicked)
    }

    return (
        <>
            {isClicked ?
                <li onClick={(e) => onClick(tag.term) }
                    className="cursor-pointer px-2 py-1 md:text-lg relative text-gray-500 bg-gray-100 rounded-badge hover:shadow shadow-teal-700 outline outline-teal-600 border border-gray-800">

                    <a>
                        {tag.term}
                    </a >
                    <span className="absolute bg-gray-200 text-gray-900 px-2 py-1 text-xs font-bold rounded-full -top-3 -right-3">{tag.ocurrences > 99 ? '99+' : tag.ocurrences}</span>

                </li > :
                <li onClick={(e) => onClick(tag.term)}
                    className="cursor-pointer px-2 py-1 md:text-lg relative text-gray-500 bg-gray-100 rounded-badge select-none hover:shadow hover:shadow-teal-700 hover:outline hover:outline-teal-600 border border-gray-800">

                    <a>
                        {tag.term}
                    </a >
                    <span className="absolute bg-gray-200 text-gray-900 px-2 py-1 text-xs font-bold rounded-full -top-3 -right-3">{tag.ocurrences > 99 ? '99+' : tag.ocurrences}</span>

                </li >
            }




        </>

    );

}