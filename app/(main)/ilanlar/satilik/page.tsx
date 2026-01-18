import ListingsClient from "@/components/listing/ListingsClient";
import { getMachineCategories } from "@/services/categories";
import { getAllBrands } from "@/services/brands";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Satılık İş Makineleri ve İlanları | Kepçecim",
    description: "Satılık iş makineleri, ekskavatör, kepçe, forklift ve tüm iş makinesi ilanları, güncel piyasa fiyatları ile Kepçecim'de.",
    openGraph: {
        title: "Satılık İş Makineleri ve İlanları | Kepçecim",
        description: "Satılık iş makineleri, ekskavatör, kepçe, forklift ve tüm iş makinesi ilanları, güncel piyasa fiyatları ile Kepçecim'de.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Satılık İş Makineleri ve İlanları | Kepçecim",
        description: "Satılık iş makineleri, ekskavatör, kepçe, forklift ve tüm iş makinesi ilanları, güncel piyasa fiyatları ile Kepçecim'de.",
    },
};

export default async function SaleListingsPage() {
    const [categories, brands] = await Promise.all([
        getMachineCategories(),
        getAllBrands()
    ]);

    return <ListingsClient initialCategories={categories || []} initialBrands={brands || []} tab="sale" />;
}
