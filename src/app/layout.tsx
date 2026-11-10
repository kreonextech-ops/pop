import type { Metadata } from "next";
import localFont from "next/font/local";
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
    <html lang="en" className={`${lilita.variable}`}>
      <body className="bg-bitejoy-bg text-bitejoy-text antialiased">
        {children}
      </body>
    </html>
  );
}
