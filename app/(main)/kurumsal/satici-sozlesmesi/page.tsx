import type { Metadata } from "next";
import SellerAgreementText from "@/components/content/SellerAgreementText";

export const metadata: Metadata = {
  title: "Satıcı Sözleşmesi",
  description:
    "Kepçecim satıcı sözleşmesi. Platformda ilan yayınlayan satıcıların hak ve yükümlülükleri.",
  openGraph: {
    title: "Satıcı Sözleşmesi | Kepçecim",
    description: "Kepçecim satıcı sözleşmesi ve satıcı yükümlülükleri.",
    url: "/kurumsal/satici-sozlesmesi",
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
