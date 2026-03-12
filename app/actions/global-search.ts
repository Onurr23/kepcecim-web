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
        page: 0,
    };

    try {
        const [salesResults, rentalResults, partsResults] = await Promise.all([
            searchSalesMachines(searchParams),
            searchRentalMachines(searchParams),
            searchParts({ query: query.trim() || null }, 1, 20),
        ]);

        const salesData = Array.isArray(salesResults?.data) ? salesResults.data : [];
        const rentalsData = Array.isArray(rentalResults?.data) ? rentalResults.data : [];
        const partsData = Array.isArray(partsResults?.data) ? partsResults.data : [];

        return {
            sales: salesData,
            rentals: rentalsData,
            parts: partsData,
            counts: {
                sales: salesResults?.count ?? salesData.length,
                rentals: rentalResults?.count ?? rentalsData.length,
                parts: partsResults?.count ?? partsData.length,
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
