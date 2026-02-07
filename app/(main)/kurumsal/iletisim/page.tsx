import type { Metadata } from "next";
import ContactText from "@/components/content/ContactText";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Kepçecim iletişim bilgileri. Bizimle iletişime geçin, destek alın.",
  openGraph: {
    title: "İletişim | Kepçecim",
    description: "Kepçecim iletişim ve destek bilgileri.",
    url: "/kurumsal/iletisim",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "İletişim | Kepçecim",
    description: "Kepçecim iletişim.",
  },
};

export default function IletisimPage() {
  return <ContactText />;
}

