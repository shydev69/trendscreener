import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import RootProviders from "@/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";

import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import Header from "@/components/header";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: "index, follow",
  manifest: siteConfig.manifest,
  icons: {
    icon: "/logobigt.png",
    shortcut: "/logobigt.png",
    apple: "/logobigt.png",
  },
  openGraph: {
    title: siteConfig.openGraph.title,
    description: siteConfig.openGraph.description,
    url: siteConfig.openGraph.url,
    siteName: siteConfig.openGraph.siteName,
    images: [
      {
        url: siteConfig.openGraph.image,
        width: siteConfig.openGraph.imageWidth,
        height: siteConfig.openGraph.imageHeight,
        alt: siteConfig.openGraph.imageAlt,
      },
    ],
    type: "website",
    locale: siteConfig.openGraph.locale,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter.site,
    title: siteConfig.twitter.title,
    description: siteConfig.twitter.description,
    images: [
      {
        url: siteConfig.twitter.image,
        alt: siteConfig.twitter.imageAlt,
      },
    ],
  },
  alternates: {
    canonical: siteConfig.origin,
  },
  category: "Social Media",
};

export const viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "bg-[#F7F7F8] dark:bg-[#000000] overflow-y-hidden h-screen font-sans antialiased geist-class"
      )}
      style={{ minHeight: "calc(100vh - 2.5rem)" }}
    >
      {" "}
      <Header />
      <div
        className="md:ml-64 mt-14 pb-40 md:mt-10 px-5 flex flex-col items-center bg-white dark:bg-[#131316]/30 rounded-[8px] inset-shadow-sm overflow-x-hidden overflow-y-auto"
        style={{ height: "calc(100vh - 2.5rem)" }}
      >
        {children}
      </div>
    </div>
  );
}
