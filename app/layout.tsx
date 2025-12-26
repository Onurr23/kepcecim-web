import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri",
  description: "Türkiye'nin en büyük iş makinesi pazar yeri. Güvenli, hızlı ve kolay ticaret.",
  icons: {
    icon: "/new_logo.png",
    apple: "/new_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${manrope.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
