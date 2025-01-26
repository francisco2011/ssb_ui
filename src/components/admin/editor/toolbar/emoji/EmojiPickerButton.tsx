import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { useRef } from "react";
import Popover from "~/components/popover/Popover";

function EmojiPickerButton({ onClickCallback }: { onClickCallback: (emoji: string) => void }) {

    const popoverRef = useRef(null);

    const onEmojiSelected = (emojiData: EmojiClickData) => {
        onClickCallback(emojiData.emoji)
        if(popoverRef?.current){
            popoverRef.current.close();
        }
    }

    return (
        <>
            <div>
                    <Popover ref={popoverRef} buttonClass={"px-1 bg-gray-400 hover:bg-gray-700 transition-colors duration-100 ease-in"}
                        content={<EmojiPicker
                            onEmojiClick={onEmojiSelected}
                            emojiStyle={EmojiStyle.NATIVE} />}>
                        <FontAwesomeIcon
                            icon={faFaceSmile}
                            className="text-white w-3.5 h-3.5" />
                    </Popover>
                
            </div>

        </>
    );

}

export default EmojiPickerButton;



