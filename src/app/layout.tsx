import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import LenisProvider from "@/components/LenisProvider";

const lilita = localFont({
  src: [
    {
      path: "../../public/fonts/LilitaOne-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-lilita",
  display: "swap",
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
    <html lang="en" className={`${lilita.variable} ${manrope.variable} overflow-x-clip`}>
      <body className="bg-bitejoy-bg text-bitejoy-text antialiased overflow-x-clip w-full max-w-full font-sans">
        <LenisProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Footer />
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
