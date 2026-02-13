import { faCopy, faFaceSmile, faGift, faPaintBrush, faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createRef, useRef } from "react";
import { InsertImagePayload } from "~/components/admin/editor/plugins/imagePlugin/ImagesPlugin";
import Popover from "~/components/popover/Popover";
import GiphyPicker, { Gif } from "./GiphyPicker";
import { SearchContextManager } from "@giphy/react-components";

function GifPickerButton({ onClickCallback }: { onClickCallback: (data: InsertImagePayload) => void }) {

    const popoverRef = useRef(null);

    const onSelected = (data: Gif) => {
        onClickCallback({ altText: data.description, src: data.url, captionsEnabled: false, showCaption: false })

        if (popoverRef?.current) {
            popoverRef.current.close();
        }
    }

    return (
        <>
            <div className="tooltip tooltip-primary" data-tip="GIF">

                <Popover  ref={popoverRef} buttonClass={"px-1 bg-gray-400 hover:bg-gray-700 transition-colors duration-100 ease-in"}
                    content={<>
                        <SearchContextManager shouldDefaultToTrending={false} apiKey={""}>
                            <GiphyPicker OnGifSelected={onSelected} />
                        </SearchContextManager></>}>
                    <FontAwesomeIcon
                        icon={faGift}
                        className="text-white w-3.5 h-3.5" />
                </Popover>
            </div>

        </>
    );

}

export default GifPickerButton;