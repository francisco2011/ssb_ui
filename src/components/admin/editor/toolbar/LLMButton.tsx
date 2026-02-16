import { faDiagramProject, faHexagonNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "~/components/useModal";

import {useCallback} from 'react'
import LLMChat from "../../webLLM/LLMChat";

export interface props{
  onContentCallback: (response: string) => void
  src: string | undefined,
  id: string | undefined
}

function LLMButton({ onContentCallback, src, id}:props) {

    const [modal, showModal] = useModal();

    const onData =  useCallback((data: string) => {
    }, [])

    return(
        <>
        <button data-tip="LLM"
        className={
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400 tooltip tooltip-primary"
            
          }
        onClick={() => {
                        showModal('LLM', (onClose) => (
                          <LLMChat/>
                        ));
                      }}
      >
        <FontAwesomeIcon icon={faHexagonNodes} className="text-white w-3.5 h-3.5" />
      </button>
      {modal}
      </>
    );

}

export default LLMButton;