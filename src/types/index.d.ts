export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  origin: string;
  og: string;
  keywords: string[];
  twitter: {
    card: string;
    site: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  openGraph: {
    type: string;
    locale: string;
    url: string;
    siteName: string;
    title: string;
    description: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    imageAlt: string;
  };
  socials: {
    x: string;
  };
  manifest: string;
  themeColor: string;
  backgroundColor: string;
};
