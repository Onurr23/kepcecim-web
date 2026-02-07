import { Suspense } from "react";
import { getMachineCategories, getCategoryFeatures, getCategoryAttachments } from "@/services/categories";
import { searchSalesMachines, getSalesMachineCount } from "@/services/sales";
import { searchRentalMachines, getRentalMachineCount } from "@/services/rental";
import { searchParts, getPartsCategories, getPartsBrands, getPartsSubCategories } from "@/services/parts";
import { getAllBrands, getModelsByBrand, getBrandsByCategory } from "@/services/brands";
import { staticClient } from "@/utils/supabase/static-client";
import ListingsClient from "@/components/listing/ListingsClient";
import { slugify } from "@/utils/slugify";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/seo";

export const revalidate = 120;

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LISTING_QUERY_WHITELIST = [
    "q", "arama", "page", "kategori", "category", "marka", "brand", "model",
    "sehir", "city", "ilce", "district", "sirala", "sort", "fiyat_min", "price_min",
    "fiyat_max", "price_max", "yil_min", "year_min", "yil_max", "year_max",
    "saat_min", "hours_min", "saat_max", "hours_max", "ozellikler", "features",
    "atasman", "attachments", "durum", "status", "kondisyon", "condition",
    "alt_tip", "sub_type", "sinif", "class", "lastik_durumu", "tireCondition",
    "mast_tipi", "mastType", "vinc_tipi", "craneType", "sasi_tipi", "chassisType",
    "kamyon_markasi", "truckBrand", "lastik_tipi", "tireType", "tekerlek_sayisi", "wheelCount",
    "yana_kaydirma", "sideShifter", "kapasite_min", "lifting_capacity_min", "kapasite_max", "lifting_capacity_max",
];

function buildCanonicalSearchParams(
    resolvedParams: { [key: string]: string | string[] | undefined }
): string {
    const entries = Object.entries(resolvedParams).filter(
        ([key]) => LISTING_QUERY_WHITELIST.includes(key)
    );
    if (entries.length === 0) return "";
    const search = new URLSearchParams();
    for (const [key, value] of entries) {
        const v = Array.isArray(value) ? value[0] : value;
        if (v !== undefined && v !== "") search.set(key, v);
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const { slug } = await params;

    const query = resolvedParams.q ?? resolvedParams.arama;
    const pageNum = resolvedParams.page ?? resolvedParams.page;
    const page = typeof pageNum === "string" ? pageNum : Array.isArray(pageNum) ? pageNum[0] : undefined;
    const pageNumber = page ? parseInt(page, 10) : 1;

    let title = "İş Makineleri İlanları";
    if (slug === "satilik") title = "Satılık İş Makineleri";
    else if (slug === "kiralik") title = "Kiralık İş Makineleri";
    else if (slug === "yedek-parca") title = "Yedek Parça İlanları";

    if (query && typeof query === "string") {
        title = `"${query}" Arama Sonuçları`;
    }
    if (pageNumber > 1) {
        title = `${title} | Sayfa ${pageNumber}`;
    }

    const canonicalPath = `/ilanlar/${slug}${buildCanonicalSearchParams(resolvedParams)}`;
    const canonical = getCanonicalUrl(canonicalPath);

    const description =
        "Satılık ve kiralık iş makineleri, yedek parça ilanları, güncel piyasa fiyatları Kepçecim'de.";

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
        },
    };
}


export default async function DynamicListingsPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedParams = await searchParams;

    // 1. Fetch Metadata (Categories & Brands) MOVED TO LOGIC BELOW
    // const [categories, brands] = await Promise.all([
    //     getMachineCategories(),
    //     getAllBrands(),
    // ]);
    // We fetch categories early only for redirect usage? 
    // Wait, redirect logic (lines 60-70) needs categories/brands to match slug.
    // If I move fetching down, I break redirects.
    // I should fetch ALL categories/brands initially to check redirects OR rely on explicit routes.
    // The user wants efficient/correct fetching.
    // Legacy redirects check if slug matches a category or brand.
    // Optimization: Only fetch lightweight list or verify against known types properly.
    // The `tab` check is static strings.
    // If `tab` is null, we do the check.
    // I will fetch minimal needed or just keep initial fetch if `tab` is null.
    // Actually, `slug` param is active. 
    // If slug is 'satilik'/'kiralik'/'yedek-parca', we enter main flow.
    // If not, we do redirect check.

    // Strategy: Check if slug is tab FIRST.
    let tab: "sale" | "rent" | "part" | null = null;
    if (slug === "satilik") tab = "sale";
    else if (slug === "kiralik") tab = "rent";
    else if (slug === "yedek-parca") tab = "part";

    if (!tab) {
        // Redirect logic requires data. Fetching all might be heavy but legacy code did it.
        // Let's fetch for redirect support.
        const [categories, brands] = await Promise.all([
            getMachineCategories(),
            getAllBrands(),
        ]);

        // Check Legacy Redirects (Category/Brand slugs)
        const getSlug = (item: any) => item?.slug || slugify(item?.name || "");

        const matchedCategory = categories.find((c: any) => (c.slug === slug) || (getSlug(c) === slug));
        if (matchedCategory) redirect(`/ilanlar/satilik?category=${slug}`);

        const matchedBrand = brands.find((b: any) => (b.slug === slug) || (getSlug(b) === slug));
        if (matchedBrand) redirect(`/ilanlar/satilik?brand=${slug}`);

        return notFound();
    }

    // If tab is set, we proceed to detailed fetching logic.

    // 3. Resolve Filters
    const getSlug = (item: any) => item?.slug || slugify(item?.name || "");

    // Turkish to English Param Mapping
    const paramCategorySlug = (resolvedParams.kategori || resolvedParams.category) as string | undefined;
    const paramBrandSlug = (resolvedParams.marka || resolvedParams.brand) as string | undefined;
    const paramModelId = (resolvedParams.model) as string | undefined; // Model ID remains

    const city = (resolvedParams.sehir || resolvedParams.city) as string;
    const district = (resolvedParams.ilce || resolvedParams.district) as string;

    const priceMin = (resolvedParams.fiyat_min || resolvedParams.price_min) ? Number(resolvedParams.fiyat_min || resolvedParams.price_min) : null;
    const priceMax = (resolvedParams.fiyat_max || resolvedParams.price_max) ? Number(resolvedParams.fiyat_max || resolvedParams.price_max) : null;

    const yearMin = (resolvedParams.yil_min || resolvedParams.year_min) ? Number(resolvedParams.yil_min || resolvedParams.year_min) : null;
    const yearMax = (resolvedParams.yil_max || resolvedParams.year_max) ? Number(resolvedParams.yil_max || resolvedParams.year_max) : null;

    const hoursMin = (resolvedParams.saat_min || resolvedParams.hours_min) ? Number(resolvedParams.saat_min || resolvedParams.hours_min) : null;
    const hoursMax = (resolvedParams.saat_max || resolvedParams.hours_max) ? Number(resolvedParams.saat_max || resolvedParams.hours_max) : null;

    // Dynamic Params Mapping
    const sub_type = (resolvedParams.alt_tip || resolvedParams.sub_type) as string;
    const cls = (resolvedParams.sinif || resolvedParams.class) as string;
    const tireCondition = (resolvedParams.lastik_durumu || resolvedParams.tireCondition) as string;
    const mastType = (resolvedParams.mast_tipi || resolvedParams.mastType) as string;
    const craneType = (resolvedParams.vinc_tipi || resolvedParams.craneType) as string;
    const chassisType = (resolvedParams.sasi_tipi || resolvedParams.chassisType) as string;
    const truckBrand = (resolvedParams.kamyon_markasi || resolvedParams.truckBrand) as string;
    const tireType = (resolvedParams.lastik_tipi || resolvedParams.tireType) as string;
    const wheelCount = (resolvedParams.tekerlek_sayisi || resolvedParams.wheelCount) as string;

    // Fix sideShifter boolean conversion
    const ssParam = resolvedParams.yana_kaydirma !== undefined ? resolvedParams.yana_kaydirma : resolvedParams.sideShifter;
    let sideShifter: boolean | null = null;
    if (ssParam === 'true') sideShifter = true;
    else if (ssParam === 'false') sideShifter = false;

    const sort = (resolvedParams.sirala || resolvedParams.sort || "created_at_desc") as string;

    const machineStatus = (resolvedParams.durum || resolvedParams.status) as string;
    const condition = (resolvedParams.kondisyon || resolvedParams.condition) as string;

    const liftCapMin = resolvedParams.kapasite_min || resolvedParams.lifting_capacity_min;
    const liftCapMax = resolvedParams.kapasite_max || resolvedParams.lifting_capacity_max;

    // FETCH METADATA BASED ON TAB (Part vs Machine)
    let pageCategories: any[] = [];
    let pageBrands: any[] = [];

    if (tab === 'part') {
        [pageCategories, pageBrands] = await Promise.all([
            getPartsCategories(),
            getPartsBrands()
        ]);
    } else {
        // Sales / Rental
        if (paramCategorySlug) {
            pageCategories = await getMachineCategories();
            const resolvedCat = pageCategories.find((c: any) => getSlug(c) === paramCategorySlug);
            if (resolvedCat) {
                pageBrands = await getBrandsByCategory(resolvedCat.id.toString());
            } else {
                pageBrands = await getAllBrands();
            }
        } else {
            [pageCategories, pageBrands] = await Promise.all([
                getMachineCategories(),
                getAllBrands()
            ]);
        }
    }

    const resolvedCategoryId = paramCategorySlug
        ? pageCategories.find((c: any) => getSlug(c) === paramCategorySlug)?.id?.toString()
        : null;

    const resolvedBrandId = paramBrandSlug
        ? pageBrands.find((b: any) => getSlug(b) === paramBrandSlug)?.id?.toString()
        : null;

    // 4. Fetch Dynamic Options (Models, Features, Attachments)
    // We Need these BEFORE search to resolve Slugs to IDs
    let models: any[] = [];
    let catFeatures: any[] = [];
    let catAttachments: any[] = [];

    // Paralell fetch of metadata
    const metadataPromises: Promise<any>[] = [];

    if (tab === 'part') {
        if (resolvedCategoryId) metadataPromises.push(getPartsSubCategories(resolvedCategoryId));
        else metadataPromises.push(Promise.resolve([])); // models placeholder

        metadataPromises.push(Promise.resolve([])); // features placeholder
        metadataPromises.push(Promise.resolve([])); // attachments placeholder
    } else {
        if (resolvedBrandId) metadataPromises.push(getModelsByBrand(resolvedBrandId, resolvedCategoryId));
        else metadataPromises.push(Promise.resolve([]));

        if (resolvedCategoryId) {
            metadataPromises.push(getCategoryFeatures(resolvedCategoryId));
            metadataPromises.push(getCategoryAttachments(resolvedCategoryId));
        } else {
            metadataPromises.push(Promise.resolve([]));
            metadataPromises.push(Promise.resolve([]));
        }
    }

    const [fetchedModels, fetchedFeatures, fetchedAttachments] = await Promise.all(metadataPromises);
    models = fetchedModels;
    catFeatures = fetchedFeatures;
    catAttachments = fetchedAttachments;

    // Resolve Feature/Attachment Slugs to IDs
    // Features
    let featureIds: string[] = [];
    const featParam = resolvedParams.ozellikler || resolvedParams.features;
    if (featParam) {
        // Handle comma separated string or array (legacy)
        const slugs = Array.isArray(featParam) ? featParam : (featParam as string).split(',');
        featureIds = slugs.map(slug => {
            const found = catFeatures.find((f: any) => getSlug(f) === slug || f.slug === slug);
            return found ? found.id.toString() : null;
        }).filter((id): id is string => id !== null);
    }

    // Attachments
    let attachmentIds: string[] = [];
    const attParam = resolvedParams.atasman || resolvedParams.attachments; // 'atasman' key check
    if (attParam) {
        const slugs = Array.isArray(attParam) ? attParam : (attParam as string).split(',');
        attachmentIds = slugs.map(slug => {
            const found = catAttachments.find((a: any) => getSlug(a) === slug || a.slug === slug);
            return found ? found.id.toString() : null;
        }).filter((id): id is string => id !== null);
    }

    const filters = {
        category: resolvedCategoryId,
        brand: resolvedBrandId,
        model: paramModelId,
        city: city,
        district: district,
        priceRange: [priceMin, priceMax] as [number | null, number | null],
        yearRange: [yearMin, yearMax] as [number | null, number | null],
        hoursRange: [hoursMin, hoursMax] as [number | null, number | null],
        query: (resolvedParams.arama || resolvedParams.q) as string,
        sort: sort,
        // Dynamic
        sub_type: sub_type,
        class: cls,
        tireCondition: tireCondition,
        mastType: mastType,
        craneType: craneType,
        chassisType: chassisType,
        truckBrand: truckBrand,
        tireType: tireType,
        wheelCount: wheelCount,
        sideShifter: sideShifter,
        liftingCapacity: [
            liftCapMin ? Number(liftCapMin) : null,
            liftCapMax ? Number(liftCapMax) : null
        ] as [number | null, number | null],
        // New Filter mappings
        machineStatus: machineStatus,
        condition: condition,
        features: featureIds,
        attachments: attachmentIds
    };

    // 5. Fetch Listings & Counts (Using resolved filters)
    const serviceFilters = { ...filters };

    const fetchPromise = (() => {
        if (tab === "sale") return searchSalesMachines(serviceFilters, Number(resolvedParams.page) || 1, 20, staticClient);
        if (tab === "rent") return searchRentalMachines(serviceFilters, Number(resolvedParams.page) || 1, 20, staticClient);
        if (tab === "part") return searchParts(serviceFilters, Number(resolvedParams.page) || 1, 20, staticClient);
        return Promise.resolve({ data: [], count: 0 });
    })();

    const countPromiseSale = getSalesMachineCount({ ...serviceFilters });
    const countPromiseRent = getRentalMachineCount({ ...serviceFilters });
    const countPromisePart = searchParts({ ...serviceFilters }, 1, 1, staticClient);

    const [
        listingsResult,
        saleCountRes,
        rentCountRes,
        partCountRes,
    ] = await Promise.all([
        fetchPromise,
        countPromiseSale,
        countPromiseRent,
        countPromisePart
    ]);

    // 6. Map Data
    const processedListings = (listingsResult.data || []).map((item: any) => {
        // ... (Mapping logic same as before)
        const pricing = typeof item.pricing === 'string' ? JSON.parse(item.pricing) : item.pricing;
        const location = typeof item.location === 'string' ? JSON.parse(item.location) : item.location;

        let priceDisplay = 'Fiyat Sorunuz';
        if (tab === 'sale' && pricing?.price) priceDisplay = `${Number(pricing.price).toLocaleString('tr-TR')} ₺`;
        else if (tab === 'rent') {
            if (pricing?.dailyRate) priceDisplay = `${Number(pricing.dailyRate).toLocaleString('tr-TR')} ₺/Gün`;
            else if (pricing?.monthlyRate) priceDisplay = `${Number(pricing.monthlyRate).toLocaleString('tr-TR')} ₺/Ay`;
        }
        else if (tab === 'part' && pricing?.price) priceDisplay = `${Number(pricing.price).toLocaleString('tr-TR')} ₺`;

        let catName = item.category?.name || item.category_name;
        if (!catName && item.category) {
            const c = pageCategories.find((c: any) => c.id == item.category);
            if (c) catName = c.name;
        }
        let brandName = item.brand?.name || item.brand_name;
        if (!brandName && item.brand) {
            const b = pageBrands.find((b: any) => b.id == item.brand);
            if (b) brandName = b.name;
        }

        const hoursValue = item.hours_meter !== undefined && item.hours_meter !== null ? item.hours_meter : item.hours;
        const isZeroMachine = hoursValue === 0 || hoursValue === "0";

        return {
            id: item.id,
            title: item.title,
            price: priceDisplay,
            location: location ? `${location.district ? location.district + ', ' : ''}${location.city || ''}` : '',
            image: item.images?.[0] || '/assets/placeholder.png',
            type: tab,
            specs: {
                year: item.year || 0,
                hours: isZeroMachine ? "Sıfır Makine" : (hoursValue ? `${hoursValue} Saat` : '-'),
                weight: item.operating_weight ? `${item.operating_weight} Ton` : '-'
            },
            machineInfo: {
                category: catName || '-',
                brand: brandName || '-',
                model: item.model_name || item.model?.name || '-'
            }
        };
    });

    const counts = {
        sale: saleCountRes, // Now returns number directly
        rent: rentCountRes, // Now returns number directly
        part: partCountRes.count // Keeps returning object
    };

    return (
        <ListingsClient
            initialCategories={pageCategories}
            initialBrands={pageBrands}
            initialListings={processedListings}
            initialTotalCount={listingsResult.count}
            initialCounts={counts}
            tab={tab}
            initialFilterState={filters}
            initialModels={models}
            initialFeatures={catFeatures}
            initialAttachments={catAttachments}
        />
    );
}
