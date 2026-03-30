import type { Metadata } from "next";
import SellerAgreementText from "@/components/content/SellerAgreementText";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Satıcı Sözleşmesi",
  description:
    "Kepçecim satıcı sözleşmesi. Platformda ilan yayınlayan satıcıların hak ve yükümlülükleri.",
  alternates: { canonical: getCanonicalUrl("/kurumsal/satici-sozlesmesi") },
  openGraph: {
    title: "Satıcı Sözleşmesi | Kepçecim",
    description: "Kepçecim satıcı sözleşmesi ve satıcı yükümlülükleri.",
    url: getCanonicalUrl("/kurumsal/satici-sozlesmesi"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satıcı Sözleşmesi | Kepçecim",
    description: "Kepçecim satıcı sözleşmesi.",
  },
};

export default function SaticiSozlesmesiPage() {
  return <SellerAgreementText />;
}
