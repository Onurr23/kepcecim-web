
import { staticClient } from '@/utils/supabase/static-client';

export async function getMachineCategories() {
    const supabase = staticClient;

    const { data, error } = await supabase
        .from('machine_categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching machine categories:', error);
        return [];
    }

    return data;
}

export async function getFeaturesByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    const supabase = staticClient;
    const { data } = await supabase
        .from('category_features')
        .select('id, name')
        .in('id', ids);

    return data || [];
}

export async function getAttachmentsByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    const supabase = staticClient;
    const { data } = await supabase
        .from('category_attachments')
        .select('id, name')
        .in('id', ids);

    return data || [];
}

export async function getCategoryFeatures(categoryId: string) {
    const supabase = staticClient;
    const { data } = await supabase.from('category_features').select('*').eq('category_id', categoryId);
    return data || [];
}

export async function getCategoryAttachments(categoryId: string) {
    const supabase = staticClient;
    // The user specified the column name is 'category', not 'category_id'
    const { data } = await supabase.from('category_attachments').select('*').eq('category', categoryId);
    return data || [];
}
