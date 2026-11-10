import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import "./globals.css";

const lilita = localFont({
  src: [
    {
      path: "../../public/fonts/LilitaOne-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LilitaOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-lilita",
  display: "block",
  preload: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pop Culture — Small Bites, Big Goodness",
  description: "the coolest way to snack better",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lilita.variable} ${manrope.variable} overflow-x-hidden`}>
      <head>
        <link
          rel="preload"
          href="/fonts/LilitaOne-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-bitejoy-bg text-bitejoy-text antialiased overflow-x-hidden w-full max-w-full font-sans">
        {children}
      </body>
    </html>
  );
}
