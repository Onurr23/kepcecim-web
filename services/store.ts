import { createClient } from '@/utils/supabase/client';
import { slugify } from '@/utils/slugify';

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

export async function getStores({
    searchQuery,
    city,
}: {
    searchQuery?: string;
    city?: string;
} = {}): Promise<Store[]> {
    const supabase = createClient();

    let query = supabase
        .from('user_profiles')
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
        .eq('is_store', true);

    if (searchQuery) {
        query = query.ilike('store_name', `%${searchQuery}%`);
    }

    if (city && city !== 'all') {
        query = query.eq('city', city);
    }

    const { data: stores, error } = await query;

    if (error) {
        console.error('Error fetching stores:', error);
        return [];
    }

    // Concurrent fetching of ad counts from 3 tables for each store
    const storesWithCounts = await Promise.all(
        stores.map(async (store) => {
            const [salesCount, rentalCount, partsCount] = await Promise.all([
                supabase.from('sales_machines').select('*', { count: 'exact', head: true }).eq('operator_id', store.id),
                supabase.from('rental_machines').select('*', { count: 'exact', head: true }).eq('operator_id', store.id),
                supabase.from('parts').select('*', { count: 'exact', head: true }).eq('supplier_id', store.id),
            ]);

            const totalAds = (salesCount.count || 0) + (rentalCount.count || 0) + (partsCount.count || 0);

            return {
                id: store.id,
                name: store.store_name || 'Mağaza',
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



// ...

export async function getStoreBySlug(slug: string): Promise<Store | null> {
    const supabase = createClient();

    // 1. Fallback: Check if the slug is actually an ID (legacy support during migration)
    if (slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        return getStoreById(slug);
    }

    // 2. Fetch all active stores to find matching slug
    // Note: Since 'slug' column is missing, we match by slugifying the name
    const { data: stores, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_store', true);

    if (error || !stores) return null;

    const matchedStore = stores.find(s => {
        const nameSlug = slugify(s.store_name || s.name || '');
        return nameSlug === slug;
    });

    if (!matchedStore) return null;

    const store = matchedStore;

    // 3. Get counts
    const [salesCount, rentalCount, partsCount] = await Promise.all([
        supabase.from('sales_machines').select('*', { count: 'exact', head: true }).eq('operator_id', store.id),
        supabase.from('rental_machines').select('*', { count: 'exact', head: true }).eq('operator_id', store.id),
        supabase.from('parts').select('*', { count: 'exact', head: true }).eq('supplier_id', store.id),
    ]);

    const totalAds = (salesCount.count || 0) + (rentalCount.count || 0) + (partsCount.count || 0);

    return {
        id: store.id,
        name: store.store_name || store.name || 'Mağaza',
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

async function getStoreById(id: string): Promise<Store | null> {
    const supabase = createClient();
    const { data: store, error } = await supabase.from('user_profiles').select('*').eq('id', id).single();

    if (error || !store) return null;

    // Basic mapping for fallback
    return {
        id: store.id,
        name: store.store_name || store.name,
        logoUrl: store.avatar_url,
        coverUrl: store.store_cover_image_url,
        city: store.city,
        district: store.district,
        adCount: 0, // Simplified for fallback
        isVerified: true,
        year: new Date(store.created_at).getFullYear(),
        description: store.store_description,
        address: store.store_address,
    }
}
