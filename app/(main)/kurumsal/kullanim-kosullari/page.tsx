import type { Metadata } from "next";
import TermsText from "@/components/content/TermsText";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "Kepçecim platformu kullanım koşulları ve kullanıcı sözleşmesi.",
  openGraph: {
    title: "Kullanım Koşulları | Kepçecim",
    description: "Kepçecim kullanım koşulları ve kullanıcı sözleşmesi.",
    url: "/kurumsal/kullanim-kosullari",
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

