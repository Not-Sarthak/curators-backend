import { Special_Elite } from "next/font/google";
import "./globals.css";

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

const LAYOUT_STYLES = {
  html: "scroll-smooth",
  body: "antialiased bg-[url('/blur-background.svg')] bg-cover bg-center bg-fixed p-3 md:p-8",
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
