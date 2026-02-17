import Link from "next/link";

export interface props {
    contentHtml: string,
    imgSrc: string
}

export default async function Header({ contentHtml, imgSrc }: props): Promise<JSX.Element> {



    return (
        <>
            <div >

                <div className="navbar  w-screen bg-base-200 sm:text-sm md:text-md xl:text-xl hidden x:block xs:block sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
                    <a href="http://localhost:3000/home">
                        <button className="btn btn-ghost text-xl">More on</button>
                    </a>
                    <ul className="menu menu-horizontal">
                        <li >
                            <Link href="/home/articles">Articles</Link>
                        </li>

                        <li >

                            <Link href="/home/codeSnippets/">Code Snippets</Link>

                        </li>

                        <li>
                            <Link href="/home/randomStuff/">Random Stuff</Link>

                        </li>

                    </ul>


                </div>


                <ul className="menu bg-base-200 min-h-screen sticky top-0 left-0 float-start 2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[80%]  sm:text-sm md:text-md xl:text-xl hidden md:block lg:block xl:block 2xl:block">
                    <a href="http://localhost:3000/home">
                        <img className="mask mask-circle w-auto" src={imgSrc} />
                    </a>


                    <div className="text-emerald-100 w-auto">

                        <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div>

                    </div>

                    <li >
                        <Link href="/home/articles">Articles</Link>
                    </li>

                    <li >

                        <Link href="/home/codeSnippets/">Code Snippets</Link>

                    </li>

                    <li>
                        <Link href="/home/randomStuff/">Random Stuff</Link>

                    </li>

                </ul>
            </div ></>
    );

}