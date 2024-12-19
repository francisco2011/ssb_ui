import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import VerticalMenu from "~/components/admin/verticalMenu/VerticalMenu";

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
      
        <main className=" bg-white text-black ">
        <VerticalMenu />
          <div className="flex flex-col items-center justify-center overflow-x-scroll">

            {children}
          </div>
        </main>

      </body>
    </html>
  );
}