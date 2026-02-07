import type { Metadata } from "next";
import AboutText from "@/components/content/AboutText";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Kepçecim, Türkiye'nin iş makinesi alım-satım pazar yeridir. Misyonumuz ve vizyonumuz hakkında bilgi edinin.",
  openGraph: {
    title: "Hakkımızda | Kepçecim",
    description:
      "Kepçecim, Türkiye'nin iş makinesi alım-satım pazar yeridir. Misyonumuz ve vizyonumuz.",
    url: "/kurumsal/hakkimizda",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda | Kepçecim",
    description: "Kepçecim hakkında bilgi edinin.",
  },
};

export default function HakkimizdaPage() {
  return <AboutText />;
}

