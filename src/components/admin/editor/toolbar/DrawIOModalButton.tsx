import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "~/components/useModal";
import EmbededDrawIOComponent from "../plugins/DrawIOPlugin/EmbededDrawIOComponent";
import DrawIOResponse from "../plugins/DrawIOPlugin/DrawIOResponse";
import {useCallback} from 'react'

function DrawIOModalButton({ onContentCallback}:{ onContentCallback: (response: DrawIOResponse) => void}) {

    const [modal, showModal] = useModal();

    const onData =  useCallback((data: DrawIOResponse | null) => {
        if(data){
            onContentCallback(data)
        }
    }, [])

    return(
        <>
        <button
        className={
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"
            
          }
        onClick={() => {
                        showModal('Draw IO', (onClose) => (
                          <EmbededDrawIOComponent imageContext={null} onClose={onClose} onData={onData}/>
                          
                        ));
                      }}
      >
        <FontAwesomeIcon icon={faDiagramProject} className="text-white w-3.5 h-3.5" />
      </button>
      {modal}
      </>
    );

}

export default DrawIOModalButton;