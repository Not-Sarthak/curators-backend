import { Special_Elite } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

const LAYOUT_STYLES = {
  html: "scroll-smooth",
  body: "antialiased bg-[url('/blur-background.svg')] bg-cover bg-center bg-fixed p-3 md:p-8",
};

export const metadata: Metadata = {
  title: "Curators - Curate the Best APYs",
  description: "Your SOL money's Lifelong Secret Teammate",
  keywords: ["SOL", "APY", "Curators", "Finance", "Crypto"],
  authors: [{ name: "Curators Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Curators - Curate the Best APYs",
    description: "Your SOL money's Lifelong Secret Teammate",
    url: "https://your-deployed-url.com",
    siteName: "Curators",
    images: [
      {
        url: "https://your-deployed-url.com/og-image.jpg", // Create and add an OG image
        width: 1200,
        height: 630,
        alt: "Curators - Curate the Best APYs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curators - Curate the Best APYs",
    description: "Your SOL money's Lifelong Secret Teammate",
    images: ["https://your-deployed-url.com/twitter-image.jpg"], // Create and add a Twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={LAYOUT_STYLES.html}>
      <body className={`${specialElite.className} ${LAYOUT_STYLES.body}`}>
        {children}
      </body>
    </html>
  );
}
