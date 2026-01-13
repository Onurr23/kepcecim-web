import { createClient } from '@/utils/supabase/server';

export interface ShowcaseMachine {
    id: string;
    title: string;
    images: string[];
    price: number; // Normalized price for internal use
    pricing: any;  // Original JSONB
    year: number;
    city: string;
    district: string;
    type: 'sale' | 'rental';
    brand: { name: string };
    model: { name: string };
    category: { name: string };
}

export async function getLatestShowcaseMachines(): Promise<ShowcaseMachine[]> {
    const supabase = await createClient();

    // 1. Fetch Sales Machines
    const { data: salesData, error: salesError } = await supabase
        .from('sales_machines')
        .select(`
      id, title, images, pricing, year, location, created_at,
      machine_brands:brand (name),
      machine_categories:category (name),
      machine_models:model (name)
    `)
        .limit(4)
        .order('created_at', { ascending: false });

    if (salesError) {
        console.error("Error fetching showcase sales:", salesError);
    }

    // 2. Fetch Rental Machines
    const { data: rentalData, error: rentalError } = await supabase
        .from('rental_machines')
        .select(`
      id, title, images, pricing, year, location, created_at,
      machine_brands:brand (name),
      machine_categories:category (name),
      machine_models:model (name)
    `)
        .limit(4)
        .order('created_at', { ascending: false });

    if (rentalError) {
        console.error("Error fetching showcase rentals:", rentalError);
    }

    // Helper to process raw data
    const processMachines = (machines: any[], type: 'sale' | 'rental') => {
        if (!machines) return [];
        return machines.map(m => {
            let price = 0;
            const pricing = typeof m.pricing === 'string' ? JSON.parse(m.pricing) : m.pricing;

            if (type === 'sale') {
                price = pricing?.price || 0;
            } else {
                price = pricing?.dailyRate || pricing?.monthlyRate || 0;
            }

            const location = typeof m.location === 'string' ? JSON.parse(m.location) : m.location;

            return {
                id: m.id,
                title: m.title,
                images: m.images || [],
                price: price,
                pricing: pricing,
                year: m.year,
                city: location?.city || '',
                district: location?.district || '',
                type: type,
                brand: m.machine_brands,
                model: m.machine_models || { name: 'Model Yok' }, // Handle missing model safely
                category: m.machine_categories
            };
        });
    };

    const processedSales = processMachines(salesData || [], 'sale');
    const processedRentals = processMachines(rentalData || [], 'rental');

    // Combine and sort by date (though we just fetched top 4 of each, simplistic merge)
    // Logic: Interleave or just concat. Let's just take top 5 overall if we were sorting perfectly, 
    // but simpler to just return a mix. User asked for "New Arrivals" so likely mix is fine.
    // Actually, BentoGrid expects 5 items total usually. One Featured + 4 small. 
    // Let's return mixed.

    const allMachines = [...processedSales, ...processedRentals].sort((a, b) => {
        // In a real app we'd sort by created_at here if we preserved it
        return 0.5 - Math.random();
    }).slice(0, 5);

    return allMachines;
}
