import type { Metadata } from "next";
import PrivacyText from "@/components/content/PrivacyText";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Kepçecim gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
  openGraph: {
    title: "Gizlilik Politikası | Kepçecim",
    description: "Kepçecim gizlilik politikası ve kişisel veri koruma.",
    url: "/kurumsal/gizlilik-politikasi",
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

