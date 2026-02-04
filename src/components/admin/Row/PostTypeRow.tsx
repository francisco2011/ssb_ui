import { faClone, faPenToSquare, faToggleOn, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostTypeModel from "~/models/PostTypeModel";



export default function PostTypeRow({postType, onEditClickCallback, onDeleteClickCallback}: {postType: PostTypeModel, onEditClickCallback: any, onDeleteClickCallback: any,}) {

    return (

        <tr className="bg-gray-100">
        <td className="content-center border px-2 py-2">{postType.id}</td>  
        <td className="content-center border px-2 py-2">{postType.name}</td>
        <td className="content-center border px-2 py-2">
            <button onClick={() => (onEditClickCallback(postType.id))} className="btn-md">
            <FontAwesomeIcon className="w-5 h-5" icon={faPenToSquare} />
            </button>
            <button className="btn-md" onClick={() => (onDeleteClickCallback(postType.id))}>
            <FontAwesomeIcon className="w-5 h-5" icon={faTrash} />
            </button>
        </td>
      </tr>
     
    );
  }