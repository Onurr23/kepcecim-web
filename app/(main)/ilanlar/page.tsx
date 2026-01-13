import ListingsClient from "@/components/listing/ListingsClient";
import { getMachineCategories } from "@/services/categories";
import { getPopularBrands } from "@/services/brands"; // Or getAllBrands if available, sticking to popular for now as fallback or fetch all

// Assuming we want ALL brands for the filter, not just popular ones.
// But we only have getPopularBrands imported in homepage.
// Let's create a getBrands service call if needed or use getPopularBrands for now.
// Actually, filter usually needs ALL brands.
import { createClient } from "@/utils/supabase/server";

async function getAllBrands() {
  const supabase = await createClient();
  const { data } = await supabase.from('machine_brands').select('id, name').order('name');
  return data || [];
}

export default async function ListingsPage() {
  // Parallel fetch
  const [categories, brands] = await Promise.all([
    getMachineCategories(),
    getAllBrands()
  ]);

  return <ListingsClient initialCategories={categories || []} initialBrands={brands || []} />;
}
