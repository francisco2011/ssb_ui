import { faBroom } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ClearEditorButton({ onClick }) {

    return(
        <button
        className={''}
        onClick={() => {
            onClick()
        }}
      >
        <FontAwesomeIcon
          icon={faBroom}
          className="text-black w-6 h-6"
        />
      </button>
    );

}

export default ClearEditorButton;