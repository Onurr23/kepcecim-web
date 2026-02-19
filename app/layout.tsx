import type { Metadata } from "next";
import { Manrope, Oswald, Roboto } from "next/font/google";
import "./globals.css";
import SmartAppBanner from "@/components/layout/SmartAppBanner";
import { AppModalProvider } from "@/contexts/AppModalContext";

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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kepcecim.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri",
    template: "%s | Kepçecim",
  },
  description:
    "Türkiye'nin en büyük iş makinesi pazar yeri. Güvenli, hızlı ve kolay ticaret.",
  openGraph: {
    locale: "tr_TR",
    type: "website",
    siteName: "Kepçecim",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Kepçecim - İş Makinesi Pazaryeri",
      },
      { url: "/excavator.png", width: 1200, height: 630, alt: "Kepçecim" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri",
    description:
      "Türkiye'nin en büyük iş makinesi pazar yeri. Güvenli, hızlı ve kolay ticaret.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${manrope.variable} ${oswald.variable} ${roboto.variable} font-sans antialiased`} suppressHydrationWarning>
        <AppModalProvider>
          <SmartAppBanner />
          {children}
        </AppModalProvider>
      </body>
    </html>
  );
}
