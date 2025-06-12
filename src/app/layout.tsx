import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import RootProviders from "@/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import "./globals.css";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RootProviders>{children}</RootProviders>
        </body>
        <GoogleAnalytics gaId="G-9L0JYJ4G7M" />
      </html>
    </ClerkProvider>
  );
}
