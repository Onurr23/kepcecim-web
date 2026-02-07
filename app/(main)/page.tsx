import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/hero/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import BentoGrid from "@/components/home/BentoGrid";
import BrandStrip from "@/components/layout/BrandStrip";
import CategoryStrip from "@/components/home/CategoryStrip";
import SellerBanner from "@/components/home/SellerBanner";
import SeoLinksSection from "@/components/home/SeoLinksSection";
import JsonLd from "@/components/seo/JsonLd";
import { getMachineCategories } from "@/services/categories";
import { getLatestShowcaseMachines } from "@/services/showcase";
import { getPopularBrands } from "@/services/brands";
import { getBaseUrl } from "@/lib/seo";

import { CategoryStripSkeleton, BentoGridSkeleton, BrandStripSkeleton } from "@/components/home/HomeSkeleton";

export const revalidate = 600; // 10 dakika ISR

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri",
  description:
    "Türkiye'nin en büyük iş makinesi pazar yeri. Satılık ve kiralık iş makineleri, yedek parça ilanları. Güvenli, hızlı ve kolay ticaret.",
  openGraph: {
    title: "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri",
    description:
      "Türkiye'nin en büyük iş makinesi pazar yeri. Satılık ve kiralık iş makineleri, yedek parça. Güvenli, hızlı ve kolay ticaret.",
    url: baseUrl,
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri",
    description:
      "Türkiye'nin en büyük iş makinesi pazar yeri. Satılık ve kiralık iş makineleri, yedek parça.",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kepçecim",
  url: baseUrl,
  description:
    "Türkiye'nin en büyük iş makinesi pazar yeri. Güvenli, hızlı ve kolay ticaret.",
  inLanguage: "tr",
  publisher: {
    "@type": "Organization",
    name: "Kepçecim",
    url: baseUrl,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/ilanlar/satilik?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};



async function CategoryStripWrapper() {
  const categories = await getMachineCategories();
  return <CategoryStrip categories={categories} />;
}

async function BentoGridWrapper() {
  const machines = await getLatestShowcaseMachines();
  return <BentoGrid machines={machines} />;
}

async function BrandStripWrapper() {
  const brands = await getPopularBrands();
  return (
    <>
      <BrandStrip brands={brands} />
      <SeoLinksSection brands={brands} />
    </>
  );
}

export default function Home() {
  return (
    <div className="bg-neutral-950">
      <JsonLd data={websiteJsonLd} />
      <HeroSection />
      <TrustStrip />

      <Suspense fallback={<CategoryStripSkeleton />}>
        <CategoryStripWrapper />
      </Suspense>

      <Suspense fallback={<BentoGridSkeleton />}>
        <BentoGridWrapper />
      </Suspense>

      <SellerBanner />

      <Suspense fallback={<BrandStripSkeleton />}>
        <BrandStripWrapper />
      </Suspense>
    </div>
  );
}



