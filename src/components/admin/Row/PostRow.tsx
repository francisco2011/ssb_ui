import { faPenToSquare, faToggleOn, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostModel from "~/models/PostModel";
import {  format } from "date-fns";



export default function PostRow({post, onEditClickCallback}: {post: PostModel, onEditClickCallback: any}) {

    return (

        <tr className="bg-gray-100">
        <td className="content-center border px-4 py-4">{post.title}</td>
        <td className="content-center border px-4 py-4 line-clamp-2">{post.description}</td>
        <td className="content-center border px-4 py-4">{post.type?.name?? ''}</td>
        <td className="content-center border px-4 py-4">{format(post.createdAt, "yyyy-MM-dd")}</td>
        <td className="content-center border px-4 py-4">
        {
            post.tags.map(c => <div key={c} className="badge badge-outline ">{c}</div>)
        }
        </td>
        <td className="content-center border px-4 py-4">{post.isPublished ? 'yes' : 'no'}</td>
        <td className="content-center border px-4 py-4">
            <button onClick={() => (onEditClickCallback(post.id))} className="btn-md">
            <FontAwesomeIcon className="w-5 h-5" icon={faPenToSquare} />
            </button>
            <button className="btn-md">
            <FontAwesomeIcon className="w-5 h-5" icon={faTrash} />
            </button>
        </td>
      </tr>
     
    );
  }