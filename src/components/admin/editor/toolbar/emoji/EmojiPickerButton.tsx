import { faCopy, faFaceSmile, faPaintBrush, faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';

function EmojiPickerButton({ onClickCallback }: { onClickCallback: (emoji: string) => void }) {

    const [isOpen, setIsOpen] = useState(false)

    const onEmojiSelected = (emojiData: EmojiClickData) => {

        setIsOpen(!isOpen)
        onClickCallback(emojiData.emoji)
    }

    return (
        <>
            <div>
                <button
                    className={
                        "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"

                    }
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FontAwesomeIcon
                        icon={faFaceSmile}
                        className="text-white w-3.5 h-3.5" />
                </button>
                <EmojiPicker onEmojiClick={onEmojiSelected} open={isOpen} emojiStyle={EmojiStyle.NATIVE} style={{ zIndex: 1001, position: "fixed", right: '30%', bottom: '38%' }} />
            </div>

        </>
    );

}

export default EmojiPickerButton;