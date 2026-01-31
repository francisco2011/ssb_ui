import { faDiagramProject, faFolderTree } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "~/components/useModal";
import {useCallback} from 'react'
import StorageExplorer, { FileFromStorage } from "./storageExplorer";

function StorageExplorerModal({ onContentCallback}:{ onContentCallback: (response: FileFromStorage) => void}) {

    const [modal, showModal, onClose] = useModal();

    const onFile =  useCallback((file: FileFromStorage ) => {
        if(file){
            onContentCallback(file)
            onClose()
        }
    }, [])

    return(
        <>
        <button
        className={
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"
            
          }
        onClick={() => {
                        showModal('Storage Explorer', (onClose) => (
                            <div className="z-50 w-[70rem] h-[30rem] overflow-auto">
                                <StorageExplorer allowUpload={false} onFileSelected={onFile}/>
                                </div>
                          
                          
                        ));
                      }}
      >
        <FontAwesomeIcon icon={faFolderTree} className="text-white w-3.5 h-3.5" />
      </button>
      {modal}
      </>
    );

}

export default StorageExplorerModal;