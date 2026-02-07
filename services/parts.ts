
import { staticClient } from '@/utils/supabase/static-client';
import { SupabaseClient } from '@supabase/supabase-js';

export async function searchParts(filters: any, page: number = 1, limit: number = 20, client?: SupabaseClient) {
    const supabase = client || staticClient;

    // Use RPC if available, based on user request "Yedek Parça rpc fonksiyonu"
    // The user provided logic for a stored procedure. I will assume it is named 'search_parts'.
    // Or 'search_parts_machines' to match pattern? User didn't specify exact name but gave signature.
    // "Yedek Parça rpc fonksiyonu :" implies there is one. 
    // Usually named `search_parts`. Let's try `search_parts` to allow custom sort logic.

    const rpcParams = {
        search_term: filters.query || null,

        in_category_id: filters.category || null,
        // Frontend 'model' filter for parts maps to sub-category
        in_sub_category_id: filters.model || null,

        in_brand_id: filters.brand || null,
        in_condition: filters.condition || null,

        // Compatible Model
        // Hint says in_compatible_model_ids (plural). Should probably be passed as array if frontend supports it, or null.
        in_compatible_model_ids: filters.compatibleModels && filters.compatibleModels.length > 0 ? filters.compatibleModels : null,

        in_city: filters.city || null,
        in_district: filters.district || null,

        in_price_min: filters.priceRange?.[0] || null,
        in_price_max: filters.priceRange?.[1] || null,

        in_supplier_id: null,

        // Sort param
        sort_by: filters.sort || 'created_at_desc',

        page_limit: limit,
        page_offset: (page - 1) * limit
    };

    // Note: The User's SQL snippet mentions `sort_by` logic inside. 
    // It handles `search_term` relevance or sort options.
    // We need to pass `sort_by` to RPC. Standardize param name if user didn't specify.
    // User SQL: `ORDER BY CASE WHEN sort_by = ...` 
    // Yes, `sort_by` is needed.

    // Function name assumption: 'search_parts'
    const { data, error } = await supabase.rpc('search_parts', rpcParams);

    if (error) {
        // Fallback or just log? User expects RPC.
        console.error("RPC Error (Parts):", error);
        return { data: [], count: 0 };
    }

    return { data, count: (data && data[0] && data[0].full_count) || data?.length || 0 };
}

export async function getPartById(id: string) {
    const supabase = staticClient;

    const { data, error } = await supabase
        .from('parts')
        .select(`
            *,
            category:parts_categories(name),
            brand:parts_brands(name)
        `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error("Supabase Error (Part):", error);
        }
        return null;
    }

    // Manual fetch for user_profiles to avoid FK join issues
    if (data && data.operator_id) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, name, phone, public_phone, city, district, avatar_url, is_store, store_name, store_cover_image_url')
            .eq('id', data.operator_id)
            .single();

        if (profile) {
            (data as any).user_profiles = profile;
        }
    }

    return data;
}


export async function getPartsCategories() {
    const supabase = staticClient;
    const { data } = await supabase
        .from('parts_categories')
        .select('id, name')
        .order('sort_order', { ascending: true });
    return data || [];
}

export async function getPartsSubCategories(categoryId: string) {
    const supabase = staticClient;
    const { data } = await supabase
        .from('parts_sub_categories')
        .select('id, name, category_id')
        .eq('category_id', categoryId)
        .order('name');
    return data || [];
}

export async function getPartsBrands() {
    const supabase = staticClient;
    const { data } = await supabase
        .from('parts_brands')
        .select('id, name')
        .order('name');
    return data || [];
}
