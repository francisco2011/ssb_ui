import "~/styles/public_global.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Header from "~/components/home/sidebar/sidebar";
import Sidebar from "~/components/home/sidebar/sidebar";
import PostService from "~/services/PostService";
import ContentService from "~/services/ContentService";
import { ContentType } from "~/models/ContentType";

export const metadata: Metadata = {
  title: "Francisco Contreras Olea",
  description: "My blog",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  let html = ''
  let mainImgSrc = ''

  const service = new PostService()
  const contentService = new ContentService()
  const pt = await service.List(1, 0, 4, [], true, [ContentType.render, ContentType.preview])

  if (pt.posts.length > 0 && pt.posts[0]?.contents.some(c => c.type == ContentType.render && c.url)) {

    var content = pt.posts[0]?.contents.find(c => c.type == ContentType.render && c.url)
    mainImgSrc = pt.posts[0]?.contents.find(c => c.type == ContentType.preview)?.url;
    html = await contentService.GetExternalContentAsStr(content?.url ?? '')
  }

  return (
    <html data-theme="dracula" lang="en" className={`${GeistSans.variable}`}>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        </head>
      <body>

        <main className="flex bg-gray-50 xs:text-xs sm:text-sm md:text-lg xl:text-xl 2xl:text-2xl">
          <div className="w-full grid grid-cols-12 ">

            <div className="border-r0 col-span-2">
              <Sidebar contentHtml={html} imgSrc={mainImgSrc} />

            </div>
            <div className="m-4  text-gray-900 items-center justify-center x:col-span-12 xs:col-span-12 sm:col-span-12 md:col-span-10 lg:col-span-10 xl:col-span-10 2xl:col-span-10">

              {children}
            </div>
          </div>
        </main>


      </body>
    </html>
  );
}
