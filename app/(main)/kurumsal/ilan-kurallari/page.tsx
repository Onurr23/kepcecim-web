import type { Metadata } from "next";
import ListingRulesText from "@/components/content/ListingRulesText";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İlan Kuralları",
  description:
    "Kepçecim ilan kuralları. İlan yayınlarken uyulması gereken kurallar ve yasaklar.",
  alternates: { canonical: getCanonicalUrl("/kurumsal/ilan-kurallari") },
  openGraph: {
    title: "İlan Kuralları | Kepçecim",
    description: "Kepçecim ilan kuralları ve yayın ilkeleri.",
    url: getCanonicalUrl("/kurumsal/ilan-kurallari"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "İlan Kuralları | Kepçecim",
    description: "Kepçecim ilan kuralları.",
  },
};

export default function IlanKurallariPage() {
  return <ListingRulesText />;
}
