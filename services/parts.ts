import { staticClient } from '@/utils/supabase/static-client';
import { SupabaseClient } from '@supabase/supabase-js';

/** UI sortBy → RPC sort_by (mobil spesifikasyonu) */
const SORT_BY_RPC_MAP: Record<string, string> = {
    relevance: 'relevance_desc',
    newest: 'created_at_desc',
    oldest: 'created_at_asc',
    price_low: 'price_asc',
    price_high: 'price_desc',
    year_new: 'year_desc',
    year_old: 'year_asc',
    // Web mevcut değerler
    created_at_desc: 'created_at_desc',
    created_at_asc: 'created_at_asc',
    price_asc: 'price_asc',
    price_desc: 'price_desc',
    year_desc: 'year_desc',
    year_asc: 'year_asc',
};

/**
 * normalizedFilters'tan RPC parametrelerini üretir.
 * 'all', null, undefined, boş dizi gönderilmez (key eklenmez).
 */
function buildSearchPartsRpcParams(
    filters: {
        query?: string | null;
        category?: string | null;
        partSubCategory?: string | null;
        subCategory?: string | null;
        brand?: string | null;
        condition?: string | null;
        compatibleModels?: Array<string | { model_id: string }> | null;
        city?: string | null;
        district?: string | null;
        priceRange?: [number | string | null, number | string | null] | [number | string?, number | string?];
        productionYearRange?: [number | string | null, number | string | null] | [number | string?, number | string?];
        inStockOnly?: boolean;
        sort?: string | null;
    },
    page: number,
    limit: number
): Record<string, unknown> {
    const searchTerm = typeof filters.query === 'string' && filters.query.trim() ? filters.query.trim() : null;
    const category = filters.category && filters.category !== 'all' ? filters.category : null;
    const subCategory = (filters.partSubCategory ?? filters.subCategory) && (filters.partSubCategory ?? filters.subCategory) !== 'all'
        ? (filters.partSubCategory ?? filters.subCategory)
        : null;
    const brand = filters.brand && filters.brand !== 'all' ? filters.brand : null;
    const condition = filters.condition && filters.condition !== 'all' ? filters.condition : null;
    const city = filters.city && filters.city !== 'all' ? filters.city : null;
    const district = filters.district && filters.district !== 'all' ? filters.district : null;

    let in_compatible_model_ids: string[] | null = null;
    const raw = filters.compatibleModels;
    if (Array.isArray(raw) && raw.length > 0) {
        in_compatible_model_ids = raw.map((item) =>
            typeof item === 'string' ? item : (item && typeof item === 'object' && 'model_id' in item ? (item as { model_id: string }).model_id : null)
        ).filter((id): id is string => !!id);
        if (in_compatible_model_ids.length === 0) in_compatible_model_ids = null;
    } else if (raw && typeof raw === 'object' && !Array.isArray(raw) && 'model_id' in raw) {
        const mid = (raw as { model_id: string }).model_id;
        if (mid) in_compatible_model_ids = [mid];
    }

    const priceMin = filters.priceRange?.[0] != null && filters.priceRange[0] !== '' ? Number(filters.priceRange[0]) : null;
    const priceMax = filters.priceRange?.[1] != null && filters.priceRange[1] !== '' ? Number(filters.priceRange[1]) : null;
    const yearMin = filters.productionYearRange?.[0] != null && filters.productionYearRange[0] !== '' ? Number(filters.productionYearRange[0]) : null;
    const yearMax = filters.productionYearRange?.[1] != null && filters.productionYearRange[1] !== '' ? Number(filters.productionYearRange[1]) : null;

    const sortBy = (filters.sort && SORT_BY_RPC_MAP[filters.sort]) || 'relevance_desc';

    const params: Record<string, unknown> = {
        sort_by: sortBy,
        page_limit: limit,
        page_offset: (page - 1) * limit,
    };

    if (searchTerm !== null) params.search_term = searchTerm;
    if (category !== null) params.in_category_id = category;
    if (subCategory !== null) params.in_sub_category_id = subCategory;
    if (brand !== null) params.in_brand_id = brand;
    if (condition !== null) params.in_condition = condition;
    if (in_compatible_model_ids !== null && in_compatible_model_ids.length > 0) params.in_compatible_model_ids = in_compatible_model_ids;
    if (city !== null) params.in_city = city;
    if (district !== null) params.in_district = district;
    if (priceMin != null) params.in_price_min = priceMin;
    if (priceMax != null) params.in_price_max = priceMax;
    if (yearMin != null) params.in_production_year_min = yearMin;
    if (yearMax != null) params.in_production_year_max = yearMax;
    if (filters.inStockOnly === true) params.in_stock_only = true;
    params.in_supplier_id = null;

    return params;
}

export async function searchParts(filters: any, page: number = 1, limit: number = 20, client?: SupabaseClient) {
    const supabase = client || staticClient;
    const rpcParams = buildSearchPartsRpcParams(filters, page, limit);

    const { data, error } = await supabase.rpc('search_parts', rpcParams);

    if (error) {
        console.error("RPC Error (Parts):", error);
        return { data: [], count: 0 };
    }

    const rows = Array.isArray(data) ? data : [];
    const first = rows[0] as Record<string, unknown> | undefined;
    const total =
        first?.full_count != null ? Number(first.full_count)
        : first?.total_count != null ? Number(first.total_count)
        : first?.totalCount != null ? Number(first.totalCount)
        : rows.length;
    return { data: rows, count: total };
}

export async function getPartsCount(filters: { query?: string | null }) {
    const supabase = staticClient;
    let query = supabase.from('parts').select('*', { count: 'exact', head: true });

    if (filters.query) {
        query = query.textSearch('searchable_text', filters.query);
    }

    const { count, error } = await query;
    if (error) {
        console.warn("Error fetching parts count:", error);
        return 0;
    }
    return count || 0;
}

export async function getPartById(id: string) {
    const supabase = staticClient;

    const { data, error } = await supabase
        .from('parts')
        .select(`
            *,
            category:parts_categories(name),
            brand:parts_brands(name),
            parts_sub_categories(name)
        `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error("Supabase Error (Part):", error);
        }
        return null;
    }

    // Manual fetch for user_profiles (parts may use operator_id or supplier_id)
    const ownerId = data?.operator_id || data?.supplier_id;
    if (data && ownerId) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, name, phone, public_phone, city, district, avatar_url, is_store, store_name, store_cover_image_url')
            .eq('id', ownerId)
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
