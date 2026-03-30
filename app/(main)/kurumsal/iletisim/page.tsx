import type { Metadata } from "next";
import ContactText from "@/components/content/ContactText";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İletişim - Kepçecim Destek ve İletişim Bilgileri",
  description:
    "Kepçecim iletişim bilgileri. Bizimle iletişime geçin, destek alın. İş makinesi alım-satım platformu.",
  alternates: { canonical: getCanonicalUrl("/kurumsal/iletisim") },
  openGraph: {
    title: "İletişim | Kepçecim",
    description: "Kepçecim iletişim ve destek bilgileri.",
    url: getCanonicalUrl("/kurumsal/iletisim"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "İletişim | Kepçecim",
    description: "Kepçecim iletişim ve destek bilgileri.",
  },
};

export default function IletisimPage() {
  return <ContactText />;
}

