import { faPenToSquare, faToggleOn, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionModel from "~/models/SectionModel";

export default function SectionRow({section, onEditClickCallback, onDeleteClickCallback}: {section: SectionModel, onEditClickCallback: any, onDeleteClickCallback: any}) {

    return (

        <tr className="bg-gray-100">
        <td className="content-center border px-2 py-2">{section.id}</td>  
        <td className="content-center border px-2 py-2" >{section.name}</td>
        <td className="content-center border px-2 py-2">{section.tag}</td>
        <td className="content-center border px-2 py-2">{section.modifiable? 'yes' : 'no'}</td>
        <td className="content-center border px-2 py-2">
            <button onClick={() => (onEditClickCallback(section.id))} className="btn-md">
            <FontAwesomeIcon className="w-5 h-5" icon={faPenToSquare} />
            </button>
            <button className="btn-md" onClick={() => (onDeleteClickCallback(section.id))}>
            <FontAwesomeIcon className="w-5 h-5" icon={faTrash} />
            </button>
        </td>
      </tr>
     
    );
  }