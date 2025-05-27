import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import RootProviders from "@/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";

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
import { dark } from "@clerk/themes";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  creator: siteConfig.name,
  icons: {
    icon: "/logobig.png",
    shortcut: "/logobig.png",
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        {/* <head>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-9L0JYJ4G7M"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9L0JYJ4G7M');
            `}
          </Script>
        </head> */}
        <body
          className={cn(
            "bg-[#F7F7F8] dark:bg-[#000000] overflow-y-hidden font-sans antialiased geist"
          )}
          style={{ minHeight: "calc(100vh - 2.5rem)" }}
          data-atm-ext-installed="1.29.9"
        >
          <RootProviders>
            {" "}
            <Header />
            <div
              className="md:ml-64 mt-14 pb-40 md:mt-10 px-5 flex flex-col items-center bg-white border dark:bg-[#131316]/30 rounded-[8px] inset-shadow-sm overflow-x-hidden overflow-y-auto"
              style={{ height: "calc(100vh - 2.5rem)" }}
            >
              {children}
            </div>
          </RootProviders>
        </body>
        <GoogleAnalytics gaId="G-9L0JYJ4G7M" />
      </html>
    </ClerkProvider>
  );
}
