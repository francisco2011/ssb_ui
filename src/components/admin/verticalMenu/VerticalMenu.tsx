import Link from "next/link";

export default function VerticalMenu(): JSX.Element {

    return (

        <>
        <ul className="menu bg-base-200 min-h-screen sticky top-0 left-0 float-start w-20 sm:w-28 md:w-32 lg:w-38 xl:w-48 2xl:w-52 m:text-sm md:text-lg xl:text-xl">
        <img src="https://64.media.tumblr.com/babc8de29c294b0b95adb2842c45df20/79b134f59e9d213e-62/s500x750/e81261d5840d3bcb4d3b6143c0ed8db41d2c5334.jpg" />
            <li>

                <Link href="/admin/posts">Posts</Link>

            </li>

            <li>

                <Link href="/admin/postTypes">Post Types</Link>

            </li>

            <li>

                <Link href="/admin/sections">Sections</Link>

            </li>

            <li>

                <Link href="/admin/files">Files</Link>

            </li>

           
        </ul></>
    );

}