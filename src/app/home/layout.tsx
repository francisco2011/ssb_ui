import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Header from "~/components/home/header/Header";

export const metadata: Metadata = {
  title: "Francisco Contreras Olea",
  description: "My blog",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-theme="dracula" lang="en" className={`${GeistSans.variable}`}>
      <body>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        </head>

        <main className="flex overflow-x-scroll   bg-gray-50">
          <div className="grid grid-cols-4 gap-4">

          <div className="col-span-1  h-full border-r0">
          <Header />

          </div>
          <div className="col-span-3 w-[50rem]">
          <div className="items-center justify-center flex-col text-gray-900">
            {children}
          </div>
          </div>

          </div>

         


        </main>


      </body>
    </html>
  );
}
