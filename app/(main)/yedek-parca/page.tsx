import ListingsClient from "@/components/listing/ListingsClient";
import { getMachineCategories } from "@/services/categories";
import { getAllBrands } from "@/services/brands";

export default async function PartsListingsPage() {
    const [categories, brands] = await Promise.all([
        getMachineCategories(),
        getAllBrands()
    ]);

    return <ListingsClient initialCategories={categories || []} initialBrands={brands || []} tab="part" />;
}
