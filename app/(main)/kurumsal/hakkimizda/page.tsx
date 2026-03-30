import type { Metadata } from "next";
import AboutText from "@/components/content/AboutText";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kepçecim Hakkında - Türkiye'nin İş Makinesi Pazaryeri",
  description:
    "Kepçecim, Türkiye'nin iş makinesi alım-satım pazar yeridir. Misyonumuz ve vizyonumuz hakkında bilgi edinin.",
  alternates: { canonical: getCanonicalUrl("/kurumsal/hakkimizda") },
  openGraph: {
    title: "Kepçecim Hakkında | Kepçecim",
    description:
      "Kepçecim, Türkiye'nin iş makinesi alım-satım pazar yeridir. Misyonumuz ve vizyonumuz.",
    url: getCanonicalUrl("/kurumsal/hakkimizda"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kepçecim Hakkında | Kepçecim",
    description: "Kepçecim hakkında bilgi edinin.",
  },
};

export default function HakkimizdaPage() {
  return <AboutText />;
}

