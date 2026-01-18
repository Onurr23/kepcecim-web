import type { Metadata } from "next";
import { Manrope, Oswald, Roboto } from "next/font/google";
import "./globals.css";
import SmartAppBanner from "@/components/layout/SmartAppBanner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri",
  description: "Türkiye'nin en büyük iş makinesi pazar yeri. Güvenli, hızlı ve kolay ticaret.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${manrope.variable} ${oswald.variable} ${roboto.variable} font-sans antialiased`} suppressHydrationWarning>
        <SmartAppBanner />
        {children}
      </body>
    </html>
  );
}
