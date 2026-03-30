import type { Metadata } from "next";
import { getStoresServer } from "@/services/store";
import DealersPageClient from "@/components/store/DealersPageClient";
import JsonLd from "@/components/seo/JsonLd";
import { getCanonicalUrl, getBaseUrl } from "@/lib/seo";

export const revalidate = 300;

const canonical = getCanonicalUrl("/galeriler");

export const metadata: Metadata = {
  title: "Onaylı Satıcılar & Galericiler - İş Makinesi Galerileri",
  description:
    "Türkiye'nin 81 ilinden güvenilir iş makinesi tedarikçileri. Onaylı satıcılar ve galericiler ile güvenli alışveriş yapın.",
  alternates: { canonical },
  openGraph: {
    title: "Onaylı Satıcılar & Galericiler | Kepçecim",
    description:
      "Türkiye'nin 81 ilinden güvenilir iş makinesi tedarikçileri. Onaylı satıcılar ve galericiler.",
    url: canonical,
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

const galerilerJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "İş Makinesi Galerileri ve Onaylı Satıcılar",
  description: "Kepçecim onaylı iş makinesi satıcıları ve galerileri.",
  url: canonical,
};

export default async function GalerilerPage() {
  const initialDealers = await getStoresServer();
  return (
    <>
      <JsonLd data={galerilerJsonLd} />
      <DealersPageClient initialDealers={initialDealers} />
    </>
  );
}
