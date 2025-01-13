import { faCopy, faFaceSmile, faGift, faPaintBrush, faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import GifPicker, { TenorImage } from 'gif-picker-react';

function GifPickerButton({ onClickCallback }: { onClickCallback: (data: string) => void }) {

    const [isOpen, setIsOpen] = useState(false)

    const onSelected = (data: TenorImage) => {

        setIsOpen(!isOpen)
        onClickCallback(data.url)
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
                        icon={faGift}
                        className="text-white w-3.5 h-3.5" />
                </button>

                    {
                        isOpen ? <div style={{ zIndex: 1002, position: "fixed", right: '30%', bottom: '38%' }}>
                            <GifPicker  onGifClick={onSelected} tenorApiKey={"AIzaSyBck_LbIlITJQTkQ9EDoYE2TJJ2gZ-nmXg"}   />
                        </div> : null
                    }

                    

                
            </div>

        </>
    );

}

export default GifPickerButton;