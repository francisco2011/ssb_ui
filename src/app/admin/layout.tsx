import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import VerticalMenu from "~/components/admin/verticalMenu/VerticalMenu";
import { Toaster } from "sonner";
import { WebLLMProvider } from "~/components/admin/webLLM/WebLLMProvider";

import { getServerSession } from "next-auth/next";
import SessionProvider from "~/components/admin/auth/SessionProvider";
import { redirect, RedirectType } from "next/navigation";


export const metadata: Metadata = {
  title: "Francisco Contreras Olea",
  description: "My blog",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const session = await getServerSession();

  if(!session || !session.user){
    redirect('/api/auth/signin', RedirectType.replace)
  }

  return (
    <html data-theme="lofi" lang="en" className={`${GeistSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </head>
      <body>



          <main className="flex min-h-screen bg-gray-50 sm:text-sm md:text-lg xl:text-xl">
            <div className="w-full grid grid-cols-12 ">

              <div className="col-span-2 border-r0 ">
                <VerticalMenu />

              </div>

              <div className="col-span-10 m-4 text-gray-900 items-center justify-center">
                <Toaster richColors position="top-right" />
                <WebLLMProvider>
                  {children}
                </WebLLMProvider>
              </div>
            </div>
          </main>
      </body>
    </html>
  );
}