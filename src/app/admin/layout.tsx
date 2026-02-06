import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import VerticalMenu from "~/components/admin/verticalMenu/VerticalMenu";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Francisco Contreras Olea",
  description: "My blog",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-theme="lofi" lang="en" className={`${GeistSans.variable}`}>
      <body>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        </head>


        <main className="flex overflow-x-scroll min-h-screen bg-gray-50 sm:text-sm md:text-lg xl:text-xl">
          <div className="w-full grid grid-cols-12 ">

            <div className="col-span-2 border-r0 ">
              <VerticalMenu />

            </div>

            <div className="col-span-10 m-4 text-gray-900 items-center justify-center">
              <Toaster richColors position="top-right" />
              {children}
            </div>
          </div>
        </main>

      </body>
    </html>
  );
}