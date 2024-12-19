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
      <Header  />
      <main className="flex overflow-x-scroll min-h-screen flex-col items-center justify-center bg-gray-50">
      
        {children}
      </main>
      </body>
    </html>
  );
}
