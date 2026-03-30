import type { Metadata } from "next";
import TermsText from "@/components/content/TermsText";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "Kepçecim platformu kullanım koşulları ve kullanıcı sözleşmesi.",
  alternates: { canonical: getCanonicalUrl("/kurumsal/kullanim-kosullari") },
  openGraph: {
    title: "Kullanım Koşulları | Kepçecim",
    description: "Kepçecim kullanım koşulları ve kullanıcı sözleşmesi.",
    url: getCanonicalUrl("/kurumsal/kullanim-kosullari"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kullanım Koşulları | Kepçecim",
    description: "Kepçecim kullanım koşulları.",
  },
};

export default function KullanimKosullariPage() {
  return <TermsText />;
}

