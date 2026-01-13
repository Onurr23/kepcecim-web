import { Suspense } from "react";
import HeroSection from "@/components/hero/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import BrandStrip from "@/components/layout/BrandStrip";
import CategoryStrip from "@/components/home/CategoryStrip";
import SellerBanner from "@/components/home/SellerBanner";
import SeoLinksSection from "@/components/home/SeoLinksSection";
import { getMachineCategories } from "@/services/categories";
import { getLatestShowcaseMachines } from "@/services/showcase";
import { getPopularBrands } from "@/services/brands";
import { CategoryStripSkeleton, BentoGridSkeleton, BrandStripSkeleton } from "@/components/home/HomeSkeleton";


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
      <HeroSection />

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



