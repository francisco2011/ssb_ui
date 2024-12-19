import { faA, faAlignLeft, faAlignRight, faBrush, faCode, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Popover from "~/components/popover/Popover";
import ColorPicker from "./ColorPicker";
import { useCallback } from "react";



function BgColorPickerButton({ selectedOption, callback }) {

  const onColorSelected = useCallback(
    (color: string ) => {
      callback({ 'background-color': color, skipHistoryStack: false });
    },
    [callback]
  );

    return(
      <Popover buttonClass={
        "px-1 bg-gray-400 hover:bg-gray-700 transition-colors duration-100 ease-in"} 
        content={<ColorPicker onChange={onColorSelected} initialColor={selectedOption}/>}>
        <FontAwesomeIcon
          icon={faBrush}
          className="text-white w-3.5 h-3.5"
        />
      </Popover>
    );

}

export default BgColorPickerButton;