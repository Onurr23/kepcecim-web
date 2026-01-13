"use server";

import { searchSalesMachines } from "@/services/sales";
import { searchRentalMachines } from "@/services/rental";
import { searchParts } from "@/services/parts";

export interface GlobalSearchResults {
    sales: any[];
    rentals: any[];
    parts: any[];
    counts: {
        sales: number;
        rentals: number;
        parts: number;
    };
}

export async function performGlobalSearch(query: string): Promise<GlobalSearchResults> {
    if (!query || query.trim().length === 0) {
        return {
            sales: [],
            rentals: [],
            parts: [],
            counts: { sales: 0, rentals: 0, parts: 0 },
        };
    }

    const searchParams = {
        query: query,
        page: 0, // Fetch first page
    };

    try {
        // Run queries in parallel for efficiency
        const [salesResults, rentalResults, partsResults] = await Promise.all([
            searchSalesMachines(searchParams),
            searchRentalMachines(searchParams),
            searchParts(searchParams),
        ]);

        return {
            sales: salesResults || [],
            rentals: rentalResults || [],
            parts: partsResults || [],
            counts: {
                sales: salesResults?.length || 0,
                rentals: rentalResults?.length || 0,
                parts: partsResults?.length || 0,
            },
        };
    } catch (error) {
        console.error("Global search error:", error);
        // Return empty results on error rather than crashing
        return {
            sales: [],
            rentals: [],
            parts: [],
            counts: { sales: 0, rentals: 0, parts: 0 },
        };
    }
}
