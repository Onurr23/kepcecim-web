import type { Metadata } from "next";
import ListingRulesText from "@/components/content/ListingRulesText";

export const metadata: Metadata = {
  title: "İlan Kuralları",
  description:
    "Kepçecim ilan kuralları. İlan yayınlarken uyulması gereken kurallar ve yasaklar.",
  openGraph: {
    title: "İlan Kuralları | Kepçecim",
    description: "Kepçecim ilan kuralları ve yayın ilkeleri.",
    url: "/kurumsal/ilan-kurallari",
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
