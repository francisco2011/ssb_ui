import { faAlignCenter, faAlignLeft, faItalic, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PublishButton({ onClick }) {

    return(
        <button
        className={''}
        onClick={() => {
            onClick()
        }}
      >
        <FontAwesomeIcon
          icon={faShare}
          className="text-black w-6 h-6"
        />
      </button>
    );

}

export default PublishButton;