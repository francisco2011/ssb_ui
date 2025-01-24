//Inspired by https://github.com/jgraph/drawio-integration/blob/master/diagram-editor.js
//https://stackoverflow.com/questions/16968945/convert-base64-png-data-to-javascript-file-objects
//https://github.com/jgraph/drawio-integration/blob/master/inline.js

import {useEffect, useRef} from "react"
import { JSX } from "react/jsx-runtime";
import DrawIOResponse from "./DrawIOResponse";


export default function EmbededDrawIOComponent({ src, onData, onClose }: { src: string| null,  onData: ( response: DrawIOResponse | null) => void, onClose: () => void }):  JSX.Element {
  
  const iframeRef = useRef();

  const url = 'https://embed.diagrams.net/?embedInline=1&libraries=1&protocol=json&spin=1&saveAndExit=1&noSaveBtn=0&noExitBtn=1&&highlight=0000ff&edit=_blank&layers=1&nav=1'

  //Usage example:
  //var file = dataURLtoFile('data:image/png;base64,......', 'a.png');
  //console.log(file);
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

const blobToBase64 = blob => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

const createDataUri = async (doc) =>
	{

    var b64Content = await blobToBase64(doc);

    if(!b64Content || typeof b64Content !== typeof '') return '' 

    var cntntArr = (b64Content as string).split(",")

    if(cntntArr.length != 2) return ''

		return 'data:image/svg+png;base64,' + cntntArr[1]
	};



  const handleMessage = async (evt: any) =>
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
              

              if(iframeRef?.current?.contentWindow){

                let strSrc = ''

                if(src){

                  const response = await fetch(src);
                  const content = await response.blob();

                  strSrc = await createDataUri(content)
                }

                iframeRef.current.contentWindow.postMessage(JSON.stringify
                  ({action: 'load', xmlpng: strSrc}), '*');
              }

              

            }
            // Received if the user clicks save
            else if (msg.event == 'save')
            {
              // Sends a request to export the diagram as XML with embedded PNG
              iframeRef.current.contentWindow.postMessage(JSON.stringify(
              //  {action: 'export', format: 'svg', spinKey: 'saving'}), '*');
              {action: 'export', format: 'xmlpng', spinKey: 'saving'}), '*');
            }
            // Received if the user clicks exit or after export
            if (msg.event == 'exit' || msg.event == 'export')
            {
              // Closes the editor
              window.removeEventListener('message', handleMessage);
              
              if(msg.data && msg.event == 'export'){
                
                //msg.data = msg.data.replace("data:image/svg+xml;base64,", '')
                //debugger
                //var blob = new Blob([msg.data], { type: msg.format });
                //var file = new File([blob], "xxxxx.svg", {type: "image/svg+xml"});
                //var file = new File([blob], "xxxxx.png", {type: "image/png"});

                var file = dataURLtoFile(msg.data, 'diagram.png');

                //onData({ Content: msg.data, Format: msg.format})
                //onData({ Content: file, Format: msg.format, ContentType: "image/svg+xml"})
                onData({ Content: file, Format: msg.format, ContentType: "image/png"})
              } 

              onClose()
            }
          }
        }

  useEffect(() => {
    
    window.addEventListener('message', handleMessage);

  }, []);

  return (
    <iframe src={url} ref={iframeRef} frameBorder="0" width="1300" height="1000">
      
    </iframe>
  );

}