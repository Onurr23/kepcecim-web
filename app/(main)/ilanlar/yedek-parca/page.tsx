import ListingsClient from "@/components/listing/ListingsClient";
import { getAllBrands } from "@/services/brands";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "İş Makinesi Yedek Parça ve Ataşmanları | Kepçecim",
    description: "İş makinesi yedek parça, motor, şanzıman, hidrolik pompa, kova ve kırıcı ataşman ilanları. Orijinal ve yan sanayi yedek parça fiyatları.",
    openGraph: {
        title: "İş Makinesi Yedek Parça ve Ataşmanları | Kepçecim",
        description: "İş makinesi yedek parça, motor, şanzıman, hidrolik pompa, kova ve kırıcı ataşman ilanları. Orijinal ve yan sanayi yedek parça fiyatları.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "İş Makinesi Yedek Parça ve Ataşmanları | Kepçecim",
        description: "İş makinesi yedek parça, motor, şanzıman, hidrolik pompa, kova ve kırıcı ataşman ilanları. Orijinal ve yan sanayi yedek parça fiyatları.",
    },
};

export default async function PartsListingsPage() {
    // For parts, we need parts categories and parts brands?
    // The current implementation in useListingFilters fetches parts data on client side if activeTab is 'part'.
    // But ListingsClient accepts initialCategories/Brands.
    // Let's pass empty arrays or fetch if possible. 
    // Looking at useListingFilters, if initial params are passed, it uses them.
    // But validation logic might expect machine categories?
    // Let's fetch parts categories if we want to be consistent, but useListingFilters handles fetching parts data internally (useEffect line 84).
    // So passing empty arrays is safe, or passing machine logic.
    // However, to avoid flashing or errors, let's keep it simple.

    // Actually, let's just make it consistent with the pattern.
    // app/(main)/ilanlar/satilik uses machine categories.
    // If we are in 'part' tab, ListingsClient will switch to parts data fetching.
    // So passing machine categories initially is ignoring effectively?
    // Let's check useListingFilters:
    // "useEffect ... if activeTab === 'part' ... loadPartsData ... setCategories(partsCategories)"

    // So it's fine to pass null/empty and let client fetch, or pass machine data (it will be ignored/replaced).
    // Better to fetch Machine data just in case to match Props interface if strict.
    // But actually, we can import `getPartsCategories` if it exists.

    // Let's stick to the existing pattern: 
    // The user didn't ask to optimize parts fetching, just routing.
    // app/(main)/ilanlar/satilik fetches machine data.

    const supabase = await createClient();
    const { data: categories } = await supabase.from("machine_categories").select("*").order("sort_order");
    const { data: brands } = await supabase.from("machine_brands").select("id, name").order("name");

    return <ListingsClient initialCategories={categories || []} initialBrands={brands || []} tab="part" />;
}
