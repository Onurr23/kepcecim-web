import { notFound } from "next/navigation";
import ListingsClient from "@/components/listing/ListingsClient";
import { getMachineCategories } from "@/services/categories";
import { getAllBrands } from "@/services/brands";
import { slugify } from "@/utils/slugify";

interface Props {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DynamicListingPage({ params, searchParams }: Props) {
    const { slug } = await params;

    const [categories, brands] = await Promise.all([
        getMachineCategories(),
        getAllBrands()
    ]);

    // Check if slug matches a category (by slug property or slugified name)
    const matchedCategory = categories.find(c => (c.slug === slug) || (slugify(c.name) === slug));

    if (matchedCategory) {
        return (
            <ListingsClient
                initialCategories={categories}
                initialBrands={brands}
                preselectedCategory={matchedCategory.id.toString()}
            />
        );
    }

    // Check if slug matches a brand
    const matchedBrand = brands.find((b: any) => (b.slug === slug) || (slugify(b.name) === slug));

    if (matchedBrand) {
        return (
            <ListingsClient
                initialCategories={categories}
                initialBrands={brands}
                preselectedBrand={matchedBrand.id.toString()}
            />
        );
    }

    // If mostly matching neither, strictly 404 as per requirement "Ensure these do not conflict"
    return notFound();
}
