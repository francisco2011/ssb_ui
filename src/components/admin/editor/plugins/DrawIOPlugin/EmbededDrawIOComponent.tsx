//Inspired by https://github.com/jgraph/drawio-integration/blob/master/diagram-editor.js

import {useEffect, useRef} from "react"
import { JSX } from "react/jsx-runtime";
import DrawIOResponse from "./DrawIOResponse";


export default function EmbededDrawIOComponent({ onData, onClose }: {onData: ( response: DrawIOResponse | null) => void, onClose: () => void }):  JSX.Element {
  
  const iframeRef = useRef();

  const url = 'https://embed.diagrams.net/?embedInline=1&libraries=1&protocol=json&spin=1&edit=_blank&saveAndExit=1&noSaveBtn=0&noExitBtn=1'

  const handleMessage = (evt: any) =>
        {

          //if (evt.data.length > 0 && evt.source == source.drawIoWindow)
          if(evt.data.length > 0)
          {
            var msg = JSON.parse(evt.data);

            // Received if the editor is ready
            if (msg.event == 'init')
            {
              // Sends the data URI with embedded XML to editor
              //source.drawIoWindow.postMessage(JSON.stringify
              //  {action: 'load', xmlpng: source.getAttribute('src')}), '*');
              
              iframeRef.current.contentWindow.postMessage(JSON.stringify
                  ({action: 'load', xml: ''}), '*');

            }
            // Received if the user clicks save
            else if (msg.event == 'save')
            {
              // Sends a request to export the diagram as XML with embedded PNG
              iframeRef.current.contentWindow.postMessage(JSON.stringify(
                {action: 'export', format: 'svg', spinKey: 'saving'}), '*');
            }
            // Received if the user clicks exit or after export
            if (msg.event == 'exit' || msg.event == 'export')
            {
              // Closes the editor
              window.removeEventListener('message', handleMessage);
              
              if(msg.data && msg.event == 'export'){
                onData({ Content: msg.data, Format: msg.format})
              } 

              onClose()
            }
          }
        }

  useEffect(() => {
    
    window.addEventListener('message', handleMessage);

  }, []);

  return (
    <iframe src={url} ref={iframeRef} width="1000" height="1000">
      
    </iframe>
  );

}