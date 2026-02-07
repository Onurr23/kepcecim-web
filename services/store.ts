import { createClient } from "@/utils/supabase/client";
import { staticClient } from "@/utils/supabase/static-client";
import { slugify } from "@/utils/slugify";

export type Store = {
    id: string;
    name: string;
    logoUrl: string | null;
    coverUrl: string | null;
    city: string | null;
    district: string | null;
    adCount: number;
    isVerified: boolean;
    year: number;
    description: string | null;
    address: string | null;
    slug?: string | null;
};

type StoreFilters = {
    searchQuery?: string;
    city?: string;
};

type SupabaseLike = ReturnType<typeof createClient>;

async function getStoresWithClient(
    supabase: SupabaseLike,
    filters: StoreFilters = {}
): Promise<Store[]> {
    const { searchQuery, city } = filters;
    let query = supabase
        .from("user_profiles")
        .select(`
      id,
      store_name,
      avatar_url,
      store_cover_image_url,
      city,
      district,
      created_at,
      store_description,
      store_address,
      is_store
    `)
        .eq("is_store", true);

    if (searchQuery) {
        query = query.ilike("store_name", `%${searchQuery}%`);
    }
    if (city && city !== "all") {
        query = query.eq("city", city);
    }

    const { data: stores, error } = await query;
    if (error) {
        console.error("Error fetching stores:", error);
        return [];
    }

    const storesWithCounts = await Promise.all(
        stores.map(async (store) => {
            const [salesCount, rentalCount, partsCount] = await Promise.all([
                supabase.from("sales_machines").select("*", { count: "exact", head: true }).eq("operator_id", store.id),
                supabase.from("rental_machines").select("*", { count: "exact", head: true }).eq("operator_id", store.id),
                supabase.from("parts").select("*", { count: "exact", head: true }).eq("supplier_id", store.id),
            ]);
            const totalAds = (salesCount.count || 0) + (rentalCount.count || 0) + (partsCount.count || 0);
            return {
                id: store.id,
                name: store.store_name || "Mağaza",
                logoUrl: store.avatar_url,
                coverUrl: store.store_cover_image_url,
                city: store.city,
                district: store.district,
                adCount: totalAds,
                isVerified: true,
                year: new Date(store.created_at).getFullYear(),
                description: store.store_description,
                address: store.store_address,
            };
        })
    );
    return storesWithCounts;
}

/** Client-side: use in browser components. */
export async function getStores(filters: StoreFilters = {}): Promise<Store[]> {
    return getStoresWithClient(createClient(), filters);
}

/** Server-side: use in RSC / API. Uses staticClient when no client provided. */
export async function getStoresServer(
    filters: StoreFilters = {},
    supabase?: SupabaseLike
): Promise<Store[]> {
    return getStoresWithClient(supabase ?? staticClient, filters);
}



async function getStoreByIdWithClient(
    supabase: SupabaseLike,
    id: string
): Promise<Store | null> {
    const { data: store, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", id)
        .single();
    if (error || !store) return null;
    return {
        id: store.id,
        name: store.store_name || store.name,
        logoUrl: store.avatar_url,
        coverUrl: store.store_cover_image_url,
        city: store.city,
        district: store.district,
        adCount: 0,
        isVerified: true,
        year: new Date(store.created_at).getFullYear(),
        description: store.store_description,
        address: store.store_address,
    };
}

async function getStoreBySlugWithClient(
    supabase: SupabaseLike,
    slug: string
): Promise<Store | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) return getStoreByIdWithClient(supabase, slug);

    const { data: stores, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("is_store", true);
    if (error || !stores) return null;

    const matchedStore = stores.find((s) => {
        const nameSlug = slugify(s.store_name || s.name || "");
        return nameSlug === slug;
    });
    if (!matchedStore) return null;

    const store = matchedStore;
    const [salesCount, rentalCount, partsCount] = await Promise.all([
        supabase.from("sales_machines").select("*", { count: "exact", head: true }).eq("operator_id", store.id),
        supabase.from("rental_machines").select("*", { count: "exact", head: true }).eq("operator_id", store.id),
        supabase.from("parts").select("*", { count: "exact", head: true }).eq("supplier_id", store.id),
    ]);
    const totalAds = (salesCount.count || 0) + (rentalCount.count || 0) + (partsCount.count || 0);

    return {
        id: store.id,
        name: store.store_name || store.name || "Mağaza",
        logoUrl: store.avatar_url,
        coverUrl: store.store_cover_image_url,
        city: store.city,
        district: store.district,
        adCount: totalAds,
        isVerified: true,
        year: new Date(store.created_at).getFullYear(),
        description: store.store_description,
        address: store.store_address,
    };
}

/** Client-side. */
export async function getStoreBySlug(slug: string): Promise<Store | null> {
    return getStoreBySlugWithClient(createClient(), slug);
}

/** Server-side: use in RSC. */
export async function getStoreBySlugServer(
    slug: string,
    supabase?: SupabaseLike
): Promise<Store | null> {
    return getStoreBySlugWithClient(supabase ?? staticClient, slug);
}

/** Product card shape used by store profile (galeri) page. */
export type StoreListingItem = {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    location: string;
    image: string;
    type: "SALE" | "RENT" | "PART";
    specs: { year: number; hours: string; weight: string };
    machineInfo: { category: string; brand: string; model: string };
};

function getStorageUrl(path: string | null | undefined): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    return `${base}/storage/v1/object/public/machine-images/${path}`;
}

/** Server-side: fetch all listings for a store (sales, rental, parts). */
export async function getStoreListings(
    storeId: string,
    storeName: string,
    supabase?: SupabaseLike
): Promise<StoreListingItem[]> {
    const client = supabase ?? staticClient;
    const [salesRes, rentalRes, partsRes] = await Promise.all([
        client.from("sales_machines").select("*, machine_brands(name), machine_models(name), machine_categories(name)").eq("operator_id", storeId),
        client.from("rental_machines").select("*, machine_brands(name), machine_models(name), machine_categories(name)").eq("operator_id", storeId),
        client.from("parts").select("*, parts_brands(name), parts_categories(name)").eq("supplier_id", storeId),
    ]);

    const mapItem = (item: any, listingType: "SALE" | "RENT" | "PART") => {
        const pricing = typeof item.pricing === "string" ? JSON.parse(item.pricing) : item.pricing;
        const loc = typeof item.location === "string" ? JSON.parse(item.location) : item.location;
        const brandName = item.machine_brands?.name || item.parts_brands?.name || item.custom_brand_text;
        const modelName = item.machine_models?.name || item.parts_categories?.name || "";

        let priceDisplay = "Fiyat Sorunuz";
        if (pricing) {
            const amount = listingType === "RENT" ? pricing.dailyRate : pricing.price || pricing.salePrice;
            if (amount) {
                priceDisplay = `${Number(amount).toLocaleString("tr-TR")} ${pricing.currency || "₺"}${listingType === "RENT" ? "/gün" : ""}`;
            }
        }

        const locationStr = loc
            ? `${loc.city || ""}${loc.district ? `, ${loc.district}` : ""}`.trim()
            : item.city
                ? `${item.city || ""}${item.district ? `, ${item.district}` : ""}`.trim()
                : "Konum Belirtilmedi";

        return {
            id: item.id,
            title: item.title || `${brandName || ""} ${modelName || ""}`.trim(),
            subtitle: brandName ? `${brandName} ${modelName || ""}`.trim() : storeName,
            price: priceDisplay,
            location: locationStr || "Konum Belirtilmedi",
            image: getStorageUrl(item.images?.[0] || item.image_url),
            type: listingType,
            specs: {
                year: Number(item.year || item.production_year) || 0,
                hours: item.hours_meter ? `${item.hours_meter} Saat` : "-",
                weight: item.operating_weight || "-",
            },
            machineInfo: {
                category: item.machine_categories?.name || item.parts_categories?.name || "kategori",
                brand: brandName || "",
                model: modelName || "",
            },
        };
    };

    const all: StoreListingItem[] = [];
    if (salesRes.data) all.push(...salesRes.data.map((i) => mapItem(i, "SALE")));
    if (rentalRes.data) all.push(...rentalRes.data.map((i) => mapItem(i, "RENT")));
    if (partsRes.data) all.push(...partsRes.data.map((i) => mapItem(i, "PART")));
    return all;
}
