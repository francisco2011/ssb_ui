import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

type LinkButtonProps = {
    onClickCallback: any,
    isActive: boolean
}

function InsertLinkButton({ onClickCallback, isActive }: LinkButtonProps) {

    return(
        <button
        className={clsx(
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
            isActive ? "bg-gray-600" : "bg-gray-400"
          )}
        onClick={() => onClickCallback()}
      >
        <FontAwesomeIcon icon={faLink} className="text-white w-3.5 h-3.5" />
      </button>
    );

}

export default InsertLinkButton;