import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";
import Header from "@/components/Header";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Kepçecim Mobil Uygulamasını İndir - İş Makinesi Cebinde",
  description:
    "Kepçecim mobil uygulaması ile binlerce iş makinesi ilanı, yedek parça ve ataşman cebinizde. Hemen indirin, ticarete başlayın.",
  openGraph: {
    title: "Kepçecim Mobil Uygulamasını İndir | Kepçecim",
    description:
      "Kepçecim mobil uygulaması ile binlerce iş makinesi ilanı, yedek parça cebinizde. iOS ve Android.",
    url: "/indir",
    images: ["/icon-512x512.png", "/new_logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kepçecim Mobil Uygulamasını İndir | Kepçecim",
    description:
      "Kepçecim mobil uygulaması ile binlerce iş makinesi ilanı cebinizde.",
    images: ["/icon-512x512.png"],
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Kepçecim",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Android, iOS",
  description:
    "Kepçecim mobil uygulaması ile binlerce iş makinesi ilanı, yedek parça ve ataşman cebinizde.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
  },
};

export default function Page() {
  return (
    <div className="pt-24">
      <JsonLd data={softwareApplicationJsonLd} />
      <Header />
      <LandingPage />
    </div>
  );
}
