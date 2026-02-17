import { faCancel, faDiagramProject, faHexagonNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "~/components/useModal";

import { useCallback, useContext, useEffect, useState } from 'react'
import LLMChat from "../../webLLM/LLMChat";

import basePrompts from "../../webLLM/BasePrompts.json"
import { ContextVal, WebLLMContext } from "../../webLLM/WebLLMProvider";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";

export interface props {
  onContentCallback: (response: string) => void,

}

function LLMButton({ onContentCallback }: props) {

  const [modal, showModal, onClose] = useModal();
  const [ready, setReady] = useState(false)

  const [editor] = useLexicalComposerContext();
  const llmContext = useContext<ContextVal | null>(WebLLMContext)

  useEffect(() => {

    setReady(!llmContext?.loading)

  }, [llmContext?.loading])

  function show(): JSX.Element {

    let selectedText = ''

    editor.read(() => {
      const selection = $getSelection();

      if (selection) {

        selectedText = selection.getTextContent();

      }
    })

    if (ready) {
      return <LLMChat onMessageSelected={onContent} initialText={selectedText} preBuiltPrompts={basePrompts} />
    }
    return (null)
  }

  function onContent(message: string) {
    onContentCallback(message)
    onClose()
  }

  return (
    <>
      <button data-tip="LLM"
        className={
          "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400 tooltip tooltip-primary"

        }
        onClick={() => {
          showModal('LLM', (onClose) => (
            show()
          ))
        }}
      >
        {
          ready ? <FontAwesomeIcon icon={faHexagonNodes} className="text-white w-3.5 h-3.5" /> :
            <FontAwesomeIcon icon={faCancel} className="text-white w-3.5 h-3.5" />
        }


      </button>
      {modal}
    </>
  );

}

export default LLMButton;