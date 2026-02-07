import type { Metadata } from "next";
import { faqs } from "@/constants/faq";
import FAQText from "@/components/content/FAQText";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Kepçecim hakkında sıkça sorulan sorular ve cevapları. İlan yayınlama, ödeme, güvenlik ve daha fazlası.",
  openGraph: {
    title: "Sıkça Sorulan Sorular | Kepçecim",
    description:
      "Kepçecim SSS. İlan, ödeme, güvenlik ve platform kullanımı hakkında sorularınızın cevapları.",
    url: "/kurumsal/sss",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sıkça Sorulan Sorular | Kepçecim",
    description: "Kepçecim sıkça sorulan sorular.",
  },
};

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function SSSPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd} />
      <FAQText />
    </>
  );
}

