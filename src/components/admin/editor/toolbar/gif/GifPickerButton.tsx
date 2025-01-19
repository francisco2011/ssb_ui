import { faCopy, faFaceSmile, faGift, faPaintBrush, faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useCallback, useEffect } from "react";
import GifPicker, { TenorImage } from 'gif-picker-react';
import { InsertImagePayload } from "~/components/admin/editor/plugins/imagePlugin/ImagesPlugin";
import Popover from "~/components/popover/Popover";

function GifPickerButton({ onClickCallback }: { onClickCallback: (data: InsertImagePayload) => void }) {

    const onSelected = (data: TenorImage) => {
        onClickCallback({ altText: data.description, src: data.url, captionsEnabled: false, showCaption: false})
    }



    return (
        <>
            <div>

            <Popover buttonClass={"px-1 bg-gray-400 hover:bg-gray-700 transition-colors duration-100 ease-in"}
                        content={ <GifPicker  
                                    onGifClick={onSelected} 
                                    tenorApiKey={"AIzaSyBck_LbIlITJQTkQ9EDoYE2TJJ2gZ-nmXg"}   />}>
                        <FontAwesomeIcon
                            icon={faGift}
                            className="text-white w-3.5 h-3.5" />
                    </Popover>



                
            </div>

        </>
    );

}

export default GifPickerButton;