import { createClient } from '@/utils/supabase/server';
import { slugify } from '@/utils/slugify';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kepcecim.com';
    const supabase = await createClient();

    // 1. Static Routes
    const staticRoutes = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/ilanlar/satilik`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ilanlar/kiralik`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ilanlar/yedek-parca`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    // 2. Fetch Data (Parallel)
    const [salesResult, rentalResult, partsResult, storesResult] = await Promise.all([
        supabase
            .from('sales_machines')
            .select('id, updated_at, title, brand:brand(name), model:model(name)'),
        supabase
            .from('rental_machines')
            .select('id, updated_at, title, brand:brand(name), model:model(name)'),
        supabase
            .from('parts')
            .select('id, updated_at, title, brand:parts_brands(name), category:parts_categories(name)'),
        supabase
            .from('user_profiles')
            .select('id, updated_at, created_at, store_name, name')
            .eq('is_store', true)
    ]);

    const sales = salesResult.data || [];
    const rentals = rentalResult.data || [];
    const parts = partsResult.data || [];
    const stores = storesResult.data || [];

    // 3. Process Sales (Priority 0.6)
    const salesUrls = sales.map((item) => {
        const brand = item.brand?.name || '';
        const model = item.model?.name || '';
        const title = item.title || '';
        const slug = `${slugify(brand)}-${slugify(model)}-${slugify(title)}-${item.id}`;

        return {
            url: `${baseUrl}/ilan/${slug}`,
            lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        };
    });

    // 4. Process Rentals (Priority 0.6)
    const rentalUrls = rentals.map((item) => {
        const brand = item.brand?.name || '';
        const model = item.model?.name || '';
        const title = item.title || '';
        const slug = `${slugify(brand)}-${slugify(model)}-${slugify(title)}-${item.id}`;

        return {
            url: `${baseUrl}/ilan/${slug}`,
            lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        };
    });

    // 5. Process Parts (Priority 0.6)
    const partsUrls = parts.map((item) => {
        const brand = item.brand?.name || '';
        const categoryName = item.category?.name || '';
        const title = item.title || '';
        // Format: Brand-Category-Title-ID
        const slug = `${slugify(brand)}-${slugify(categoryName)}-${slugify(title)}-${item.id}`;

        return {
            url: `${baseUrl}/ilan/${slug}`,
            lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        };
    });

    // 6. Process Stores (Priority 0.7)
    const storeUrls = stores.map((store) => {
        const name = store.store_name || store.name || 'magaza';
        const slug = slugify(name);

        return {
            url: `${baseUrl}/galeri/${slug}`,
            lastModified: store.updated_at ? new Date(store.updated_at) : (store.created_at ? new Date(store.created_at) : new Date()),
            changeFrequency: 'weekly',
            priority: 0.7,
        };
    });

    // Combine All
    return [...staticRoutes, ...salesUrls, ...rentalUrls, ...partsUrls, ...storeUrls];
}
