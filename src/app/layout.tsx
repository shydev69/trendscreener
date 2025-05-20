import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import RootProviders from "@/components/providers";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Sidebar from "@/components/sidebar";
import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  creator: siteConfig.name,
  icons: {
    icon: "/goku.svg",
    shortcut: "/goku.svg",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.origin,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.og,
        width: 2880,
        height: 1800,
        alt: siteConfig.name,
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.socials.x,
    title: siteConfig.title,
    description: siteConfig.description,
    images: {
      url: siteConfig.og,
      width: 2880,
      height: 1800,
      alt: siteConfig.name,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        <body
          className={cn(
            "bg-[#F7F7F8] dark:bg-[#000000] font-sans antialiased geist"
          )}
          style={{ minHeight: "calc(100vh - 2.5rem)" }}
        >
          <RootProviders>
            {" "}
            <Sidebar />
            <Header />
            <div
              className="ml-64 mt-10 flex flex-col items-center bg-white border dark:bg-[#131316]/30 rounded-[8px] inset-shadow-sm overflow-x-hidden overflow-y-scroll"
              style={{ height: "calc(100vh - 2.5rem)" }}
            >
              {children}
            </div>
          </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
