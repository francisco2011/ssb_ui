import Link from "next/link";

export default function VerticalMenu(): JSX.Element {

    return (

        <>
        <ul className="menu bg-base-200 rounded-box w-56 sticky top-0 left-0 float-start">
        <img src="https://64.media.tumblr.com/babc8de29c294b0b95adb2842c45df20/79b134f59e9d213e-62/s500x750/e81261d5840d3bcb4d3b6143c0ed8db41d2c5334.jpg" />
            <li>

                <Link href="/admin/posts">Posts</Link>

            </li>

            <li>

                <Link href="/admin/postTypes">Post Types</Link>

            </li>

           
        </ul></>
    );

}