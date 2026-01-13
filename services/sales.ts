import { createClient } from '@/utils/supabase/server';

export async function searchSalesMachines(searchParams: any) {
    const supabase = await createClient();

    // Filtre parametrelerini RPC formatına hazırlama
    const rpcParams = {
        search_term: searchParams.query || null,
        sort_by: searchParams.sort || 'created_at_desc',
        in_category_id: searchParams.category || null,
        in_brand_id: searchParams.brand || null,
        in_price_min: searchParams.minPrice || null,
        in_price_max: searchParams.maxPrice || null,
        in_year_min: searchParams.minYear || null,
        in_year_max: searchParams.maxYear || null,
        in_city: searchParams.city || null,
        page_limit: 20,
        page_offset: (searchParams.page || 0) * 20
    };

    const { data, error } = await supabase.rpc('search_sales_machines', rpcParams);

    if (error) throw error;
    return data;
}

export async function getSalesMachineById(id: string) {
    const supabase = await createClient();

    // 1. Fetch Machine Data (without user_profiles join)
    const { data: machine, error } = await supabase
        .from('sales_machines')
        .select(`
      *,
      machine_categories:category (id, name),
      machine_brands:brand (id, name, logo_url),
      machine_models:model (id, name)
    `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error("Supabase Error (Sales):", error);
        }
        return null;
    }

    // 2. Fetch User Profile Manually (Bypass broken FK)
    if (machine && machine.operator_id) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, name, phone, public_phone, city, district, avatar_url, is_store, store_name, store_cover_image_url')
            .eq('id', machine.operator_id)
            .single();

        // Merge profile as 'user_profiles' property to match expected interface
        return {
            ...machine,
            user_profiles: profile
        };
    }

    return machine;
}
