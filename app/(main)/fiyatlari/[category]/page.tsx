import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/seo";

interface FiyatlariPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: FiyatlariPageProps): Promise<Metadata> {
  const category = params.category;
  const categoryLabel = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${categoryLabel} Fiyatları - Satılık ${categoryLabel} İlanları`,
    description: `Türkiye'deki ${categoryLabel} fiyatları, satılık ve kiralık ${categoryLabel} ilanları. Güncel piyasa değerleri Kepçecim'de.`,
    alternates: { canonical: getCanonicalUrl(`/fiyatlari/${category}`) },
    openGraph: {
      title: `${categoryLabel} Fiyatları | Kepçecim`,
      description: `Türkiye'deki ${categoryLabel} fiyatları ve ilanları.`,
      url: getCanonicalUrl(`/fiyatlari/${category}`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryLabel} Fiyatları | Kepçecim`,
      description: `${categoryLabel} fiyatları ve ilanları Kepçecim'de.`,
    },
  };
}

export default function FiyatlariPage({ params }: FiyatlariPageProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Fiyatlar
        </h1>
        <p className="text-white/60 mb-4">
          SEO landing page for category: <span className="text-white">{params.category}</span>
        </p>
        <p className="text-white/60">
          SEO landing page content coming soon...
        </p>
      </div>
    </div>
  );
}

