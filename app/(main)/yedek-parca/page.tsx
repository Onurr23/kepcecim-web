import type { Metadata } from "next";
import ListingsClient from "@/components/listing/ListingsClient";
import { getMachineCategories } from "@/services/categories";
import { getAllBrands } from "@/services/brands";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Yedek Parça İlanları - İş Makinesi Yedek Parça",
    description:
        "Satılık iş makinesi yedek parçaları. Ekskavatör, kepçe, beko loader ve daha fazlası için orijinal ve muadil yedek parça ilanları Kepçecim'de.",
    alternates: { canonical: getCanonicalUrl("/yedek-parca") },
    openGraph: {
        title: "Yedek Parça İlanları | Kepçecim",
        description:
            "İş makinesi yedek parçaları. Ekskavatör, kepçe, beko loader için orijinal ve muadil parçalar.",
        url: getCanonicalUrl("/yedek-parca"),
        locale: "tr_TR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Yedek Parça İlanları | Kepçecim",
        description: "İş makinesi yedek parçaları Kepçecim'de.",
    },
};

export default async function PartsListingsPage() {
    const [categories, brands] = await Promise.all([
        getMachineCategories(),
        getAllBrands()
    ]);

    return <ListingsClient initialCategories={categories || []} initialBrands={brands || []} tab="part" />;
}
