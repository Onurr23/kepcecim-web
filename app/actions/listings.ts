"use server";

import { getModelsByBrand } from "@/services/brands";

export async function fetchModelsByBrand(brandId: string): Promise<{ id: string; name: string }[]> {
    if (!brandId?.trim()) return [];
    const models = await getModelsByBrand(brandId, null);
    return models ?? [];
}
