import type { Metadata } from "next";
import { Lato, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartSyncProvider } from "@/providers/CartSyncProvider";
import PopupChat from "@/components/Chat/PopupChat";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MeshebeshaDesign - Creative Design Solutions",
  description: "Professional design services for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${montserrat.variable} font-body antialiased`}>
        <AuthProvider>
          <CartSyncProvider>
            {children}
            {/* Global popup chat - available on all pages */}
            <PopupChat />
          </CartSyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
