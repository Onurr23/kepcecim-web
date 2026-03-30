import type { Metadata } from "next";
import PrivacyText from "@/components/content/PrivacyText";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Kepçecim gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
  alternates: { canonical: getCanonicalUrl("/kurumsal/gizlilik-politikasi") },
  openGraph: {
    title: "Gizlilik Politikası | Kepçecim",
    description: "Kepçecim gizlilik politikası ve kişisel veri koruma.",
    url: getCanonicalUrl("/kurumsal/gizlilik-politikasi"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gizlilik Politikası | Kepçecim",
    description: "Kepçecim gizlilik politikası.",
  },
};

export default function GizlilikPolitikasiPage() {
  return <PrivacyText />;
}

