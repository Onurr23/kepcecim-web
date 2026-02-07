import type { Metadata } from "next";
import { getStoresServer } from "@/services/store";
import DealersPageClient from "@/components/store/DealersPageClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Onaylı Satıcılar & Galericiler",
  description:
    "Türkiye'nin 81 ilinden güvenilir iş makinesi tedarikçileri. Onaylı satıcılar ve galericiler ile güvenli alışveriş.",
  openGraph: {
    title: "Onaylı Satıcılar & Galericiler | Kepçecim",
    description:
      "Türkiye'nin 81 ilinden güvenilir iş makinesi tedarikçileri. Onaylı satıcılar ve galericiler.",
    url: "/galeriler",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onaylı Satıcılar & Galericiler | Kepçecim",
    description:
      "Türkiye'nin 81 ilinden güvenilir iş makinesi tedarikçileri.",
  },
};

export default async function GalerilerPage() {
  const initialDealers = await getStoresServer();
  return <DealersPageClient initialDealers={initialDealers} />;
}
