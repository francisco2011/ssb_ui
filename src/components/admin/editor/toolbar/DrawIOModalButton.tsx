import { faDiagramProject, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "~/components/useModal";
import EmbededDrawIOComponent from "../plugins/DrawIOPlugin/EmbededDrawIOComponent";
import DrawIOResponse from "../plugins/DrawIOPlugin/DrawIOResponse";
import { LexicalEditor } from "lexical";
import {useCallback} from 'react'
import { INSERT_DRAW_IO_IMAGE_COMMAND } from "../plugins/DrawIOPlugin";

function DrawIOModalButton({activeEditor}:{ activeEditor: LexicalEditor}) {

    const [modal, showModal] = useModal();

    const onData =  useCallback((data: DrawIOResponse | null) => {
        if(data){
            activeEditor.dispatchCommand(INSERT_DRAW_IO_IMAGE_COMMAND, {src: data.Content, position: 'full'});
            
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
                          <EmbededDrawIOComponent src={null} onClose={onClose} onData={onData}/>
                          
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