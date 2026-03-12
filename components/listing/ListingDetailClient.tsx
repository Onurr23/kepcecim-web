"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    CheckCircle2,
    Phone,
    MessageSquare,
    Shield,
    ChevronRight,
    Fuel,
    X,
    ChevronLeft,
    Wrench,
    Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPEC_LABEL_MAP, PARTS_TERMS, TIRE_CONDITION_OPTIONS, SHIPPING_INFO, PARTS_CONDITION_LABELS, WARRANTY_LABELS, TECHNICAL_SPEC_EXCLUDED_KEYS } from "@/constants/listing-specs";
import AppGuard from "@/components/ui/AppGuard";

// --- Types ---
type ListingType = 'sale' | 'rental' | 'part';

interface ListingDetailProps {
    listing: any;
    type: ListingType;
}

// --- Helpers ---

/** Fiyat gizliyse "Sorunuz" döner. Birim: rental /gün, parts / adet (mobil spec). */
const formatPrice = (price: any, type: ListingType, priceHidden?: boolean): string | string[] => {
    if (priceHidden === true) return 'Sorunuz';
    if (!price && price !== 0) return 'Fiyat Belirtilmemiş';

    let pricingData: any = {};

    if (typeof price === 'string') {
        try {
            pricingData = JSON.parse(price);
        } catch {
            return 'Fiyat Belirtilmemiş';
        }
    } else if (typeof price === 'object') {
        pricingData = price;
    } else if (typeof price === 'number') {
        pricingData = { price: price, currency: 'TRY' };
    }

    if (pricingData.priceHidden === true) return 'Sorunuz';

    const currency = pricingData.currency || 'TRY';
    const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    });

    if (type === 'rental') {
        const rates = [];
        if (pricingData.dailyRate) rates.push(`${formatter.format(pricingData.dailyRate)} / gün`);
        if (pricingData.weeklyRate) rates.push(`${formatter.format(pricingData.weeklyRate)} / hafta`);
        if (pricingData.monthlyRate) rates.push(`${formatter.format(pricingData.monthlyRate)} / ay`);

        if (rates.length > 0) return rates;

        if (pricingData.price) return [`${formatter.format(pricingData.price)} / gün`];
        return ['Fiyat Belirtilmemiş'];
    }

    if (type === 'part') {
        const main = pricingData.price ?? pricingData.salePrice;
        return [main != null ? `${formatter.format(main)} / adet` : 'Fiyat Belirtilmemiş'];
    }

    const main = pricingData.salePrice ?? pricingData.price ?? 0;
    return [formatter.format(main)];
};

const getImageUrl = (image: string | { url?: string; uri?: string; localUri?: string } | null) => {
    if (!image) return "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1000&auto=format&fit=crop";
    const url = typeof image === 'string' ? image : (image?.uri || image?.url || (image as any)?.localUri || '');
    if (!url) return "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1000&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/machine-images/${url}`;
};

/** Marka logosu (machine_brands.logo_url): tam URL ise aynen, değilse storage path (önce brand-logos, yoksa machine-images) */
const getBrandLogoUrl = (logoUrl: string | null | undefined): string | null => {
    if (!logoUrl) return null;
    if (logoUrl.startsWith('http')) return logoUrl;
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!base) return null;
    const path = logoUrl.replace(/^\//, '');
    return `${base}/storage/v1/object/public/brand-logos/${path}`;
};

/** Görsel dizisini URL string dizisine çevirir (parts: photos || images; eleman string veya {url,uri,localUri}) */
const normalizeImageUrls = (images: any[] | null | undefined): string[] => {
    if (!images || !Array.isArray(images)) return [];
    return images.map((img) => {
        const s = typeof img === 'string' ? img : (img?.uri || img?.url || (img as any)?.localUri || img);
        return typeof s === 'string' ? s : '';
    }).filter(Boolean);
};

const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
        case 'excellent': return 'text-green-400 bg-green-400/10 ring-green-400/20';
        case 'good': return 'text-emerald-400 bg-emerald-400/10 ring-emerald-400/20';
        case 'fair': return 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/20';
        case 'poor': return 'text-red-400 bg-red-400/10 ring-red-400/20';
        case 'new': return 'text-blue-400 bg-blue-400/10 ring-blue-400/20'; // Parts
        case 'used': return 'text-orange-400 bg-orange-400/10 ring-orange-400/20'; // Parts
        case 'refurbished': return 'text-purple-400 bg-purple-400/10 ring-purple-400/20'; // Parts
        default: return 'text-neutral-400 bg-neutral-400/10 ring-neutral-400/20';
    }
};

const getConditionLabel = (condition: string) => {
    const map: Record<string, string> = {
        'excellent': 'Mükemmel',
        'good': 'İyi',
        'fair': 'Orta',
        'poor': 'Kötü',
        'new': 'Sıfır',
        'used': 'İkinci El / Çıkma',
        'refurbished': 'Revizyonlu'
    };
    return map[condition?.toLowerCase()] || condition || 'Belirtilmemiş';
};

const getConditionPercentage = (condition: string) => {
    switch (condition?.toLowerCase()) {
        case 'excellent': return 100;
        case 'good': return 80;
        case 'fair': return 60;
        case 'poor': return 40;
        default: return 0;
    }
};
/** Telefon numarasını WhatsApp linki için normalize eder (başında 0 veya 90 olabilir) */
const normalizePhoneForWhatsApp = (phone: string | null | undefined): string => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('90') && digits.length >= 12) return digits;
    if (digits.startsWith('0') && digits.length >= 10) return '9' + digits;
    if (digits.length >= 10) return '90' + digits;
    return digits ? '90' + digits : '';
};

const toSlug = (text: string) => {
    const trMap: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };
    return text
        .split('')
        .map(c => trMap[c] || c)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
};

// --- Components ---

function FullScreenGallery({ images, activeIndex, onClose, onIndexChange }: { images: string[], activeIndex: number, onClose: () => void, onIndexChange: (i: number) => void }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-primary z-50 p-2">
                <X className="h-8 w-8" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); onIndexChange(activeIndex - 1 >= 0 ? activeIndex - 1 : images.length - 1); }}
                className="absolute left-4 text-white hover:text-primary p-2 hidden sm:block"
            >
                <ChevronLeft className="h-10 w-10" />
            </button>

            <div className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center">
                <Image
                    src={getImageUrl(images[activeIndex])}
                    alt="Gallery"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onIndexChange((activeIndex + 1) % images.length); }}
                className="absolute right-4 text-white hover:text-primary p-2 hidden sm:block"
            >
                <ChevronRight className="h-10 w-10 rotate-180 sm:rotate-0" /> {/* Reusing ChevronRight icon properly */}
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); onIndexChange(idx); }}
                        className={cn("w-2 h-2 rounded-full transition-all", activeIndex === idx ? "bg-primary w-4" : "bg-white/50 hover:bg-white")}
                    />
                ))}
                <div className="absolute text-white text-sm bottom-[-20px]">{activeIndex + 1} / {images.length}</div>
            </div>
        </div>
    );
}


export default function ListingDetailClient({ listing, type }: ListingDetailProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    if (!listing) return <div>İlan bulunamadı.</div>;

    // --- Data Normalization ---
    const rawImages = type === 'part' ? (listing.photos || listing.images) : listing.images;
    const images = normalizeImageUrls(Array.isArray(rawImages) ? rawImages : (rawImages ? [rawImages] : []));

    // Parse JSONB fields safely
    const specs = typeof listing.specifications === 'string'
        ? JSON.parse(listing.specifications || '{}')
        : (listing.specifications || {});

    const pricing = typeof listing.pricing === 'string'
        ? JSON.parse(listing.pricing || '{}')
        : (listing.pricing || {});
    const priceInfo = listing.priceInfo || {};
    const priceHidden = priceInfo.priceHidden === true || pricing.priceHidden === true;

    // Names (with Fallbacks)
    let brandName = 'Marka Belirtilmemiş';
    let modelName = 'Model Belirtilmemiş';
    let categoryName = 'Kategori Belirtilmemiş';

    if (type === 'part') {
        // Handle aliases from services/parts.ts (brand, category, sub_category)
        brandName = listing.brand?.name || listing.parts_brands?.name || listing.custom_brand_text || brandName;
        categoryName = listing.category?.name || listing.parts_categories?.name || listing.custom_category_text || categoryName;

        const subCatName = listing.sub_category?.name || listing.parts_sub_categories?.name;
        if (subCatName) {
            modelName = subCatName; // Store Sub Category in "Model" field for display
        } else {
            modelName = listing.title; // Fallback to title
        }
    } else {
        brandName = listing.machine_brands?.name || listing.custom_brand_text || brandName;
        modelName = listing.machine_models?.name || listing.custom_model_text || modelName;
        categoryName = listing.machine_categories?.name || listing.custom_category_text || categoryName;
    }

    // Seller Info (Smart Logic)
    // user_profiles might be on 'owner_id' (sales) or 'operator_id' (rental/part) - passed as user_profiles from service
    const profile = listing.user_profiles || {};
    const isStore = profile.is_store === true;
    const sellerName = isStore ? (profile.store_name || profile.name) : profile.name || 'Satıcı';
    const sellerImage = isStore ? (profile.store_cover_image_url || profile.avatar_url) : profile.avatar_url;
    const sellerCity = profile.city || listing.location?.city || '';
    const sellerDistrict = profile.district || listing.location?.district || '';
    const phoneVisible = !!(profile.public_phone || profile.phone);
    const publicPhone = profile.public_phone || profile.phone;

    // Location String
    let location: { city?: string; district?: string; coordinates?: { lat?: number; lng?: number } | number[] } = { city: sellerCity, district: sellerDistrict };
    try {
        if (listing.location) {
            location = typeof listing.location === 'string' ? JSON.parse(listing.location) : listing.location;
        }
    } catch (_) { /* ignore */ }
    const locationString = location?.city ? `${location.city}${location.district ? `, ${location.district}` : ''}` : 'Konum Belirtilmemiş';

    // Features
    const resolvedFeatures = listing.resolvedFeatures || [];
    const resolvedAttachments = listing.resolvedAttachments || [];

    return (
        <>
            <div className="min-h-screen bg-black pt-24 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

                        {/* LEFT COLUMN (Content) */}
                        <div className="space-y-8 lg:col-span-2">

                            {/* 1. Header Section */}
                            <div className="space-y-4">
                                {/* Breadcrumbs */}
                                <nav className="flex items-center gap-2 text-sm text-neutral-400">
                                    <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <Link href="/ilanlar" className="hover:text-primary transition-colors pl-1">
                                        {type === 'part' ? 'Yedek Parça' : (type === 'rental' ? 'Kiralık' : 'Satılık')}
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-white truncate max-w-[200px]">{categoryName}</span>
                                </nav>

                                {/* Marka logosu (machine_brands.logo_url) + Başlık; badge yok */}
                                <div className="flex items-start gap-4 mb-1">
                                    {(brandName && brandName !== 'Marka Belirtilmemiş') && (
                                        <Link
                                            href={`/ilanlar/${type === 'part' ? 'yedek-parca' : type === 'rental' ? 'kiralik' : 'satilik'}?q=${encodeURIComponent(brandName)}`}
                                            className="shrink-0 rounded-xl border border-neutral-200 overflow-hidden bg-white hover:border-primary/50 transition-colors flex items-center justify-center w-14 h-14 shadow-sm"
                                        >
                                            {(() => {
                                                const rawLogo = listing.machine_brands?.logo_url || (type === 'part' && listing.brand?.logo_url) || null;
                                                if (rawLogo) {
                                                    return (
                                                        <Image
                                                            src={rawLogo}
                                                            alt={brandName}
                                                            width={56}
                                                            height={56}
                                                            className="object-contain w-full h-full p-1"
                                                            unoptimized={!!rawLogo?.startsWith('http')}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <span className="text-lg font-bold text-white/80 uppercase">
                                                        {brandName.slice(0, 2)}
                                                    </span>
                                                );
                                            })()}
                                        </Link>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-2xl font-bold text-white sm:text-3xl leading-tight">
                                            {listing.title || 'Başlık Yok'}
                                        </h1>
                                        <p className="mt-1.5 text-neutral-400 text-sm flex flex-wrap items-center gap-1">
                                            <Link
                                                href={`/ilanlar/${type === 'part' ? 'yedek-parca' : type === 'rental' ? 'kiralik' : 'satilik'}${brandName && brandName !== 'Marka Belirtilmemiş' ? `?q=${encodeURIComponent(brandName)}` : ''}`}
                                                className="hover:text-primary transition-colors"
                                            >
                                                {brandName}
                                            </Link>
                                            {brandName && modelName && <span className="text-neutral-500">•</span>}
                                            <span>{modelName}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Price & Location Row */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-6">
                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-2">
                                            {(() => {
                                                const prices = formatPrice(pricing, type, priceHidden);
                                                const arr = Array.isArray(prices) ? prices : [prices];
                                                return arr.map((p, idx) => (
                                                    <p key={idx} className={cn(
                                                        "font-bold font-oswald text-primary tracking-tight",
                                                        idx === 0 ? "text-4xl" : "text-xl text-neutral-400"
                                                    )}>
                                                        {p}
                                                    </p>
                                                ));
                                            })()}
                                        </div>
                                        {/* Rental Extras */}
                                        {type === 'rental' && pricing.operatorIncluded && (
                                            <div className="flex gap-3 mt-2">
                                                <span className="text-xs font-semibold text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded">
                                                    <CheckCircle2 className="h-3 w-3" /> Operatör Dahil
                                                </span>
                                                {pricing.fuelIncluded && (
                                                    <span className="text-xs font-semibold text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded">
                                                        <Fuel className="h-3 w-3" /> Yakıt Dahil
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                        <MapPin className="h-4 w-4 text-neutral-500" />
                                        {locationString}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Gallery (Click to Open Lightbox) */}
                            <div className="space-y-4">
                                <div
                                    className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900 cursor-zoom-in group"
                                    onClick={() => setIsGalleryOpen(true)}
                                >
                                    {images.length > 0 ? (
                                        <Image
                                            src={getImageUrl(images[activeImage])}
                                            alt={listing.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            priority
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-neutral-500">
                                            Görsel Yok
                                        </div>
                                    )}

                                    {/* Üst gradient (butonların okunabilirliği için) */}
                                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />

                                    {/* Lokasyon rozeti: ilçe, şehir (sol alt) */}
                                    {locationString && locationString !== 'Konum Belirtilmemiş' && (
                                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1.5 rounded z-20 font-medium uppercase tracking-wide">
                                            {locationString}
                                        </div>
                                    )}

                                    {/* Overlay Icons */}
                                    <div className="absolute right-4 top-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-black/60 backdrop-blur-md rounded-lg px-3 py-1 text-white text-xs font-medium flex items-center gap-2">
                                            <span>Büyütmek için tıkla</span>
                                        </div>
                                    </div>

                                    {/* Image Count Badge (sağ alt, lokasyon solda) */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded z-20 font-medium flex items-center gap-1">
                                            <span>📷</span>
                                            <span>{activeImage + 1} / {images.length}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {images.map((img: string, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImage(index)}
                                                className={cn(
                                                    "relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-white/10 transition-all",
                                                    activeImage === index ? "ring-2 ring-primary ring-offset-2 ring-offset-black opacity-100" : "opacity-60 hover:opacity-100"
                                                )}
                                            >
                                                <Image
                                                    src={getImageUrl(img)}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 3. Condition Section (Sales Specific) - Kontrol edildi/Onay metni yok */}
                            {type === 'sale' && listing.condition && (
                                <div className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
                                    <h3 className="text-base font-semibold text-white mb-4">Durum Değerlendirmesi</h3>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-neutral-400 text-sm">Genel Kondisyon</span>
                                            <span className={cn("text-base font-semibold", getConditionColor(listing.condition).split(' ')[0])}>
                                                {getConditionLabel(listing.condition)}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000"
                                                style={{ width: `${getConditionPercentage(listing.condition)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3.5 Rental Availability (Rental Specific) */}
                            {type === 'rental' && (
                                <div className={cn(
                                    "rounded-xl border p-4 flex items-start gap-3",
                                    listing.is_available === false
                                        ? "bg-red-500/10 border-red-500/20"
                                        : "bg-green-500/10 border-green-500/20"
                                )}>
                                    {listing.is_available === false ? (
                                        <Shield className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    ) : (
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <h4 className={cn("font-bold", listing.is_available === false ? "text-red-400" : "text-green-400")}>
                                            {listing.is_available === false ? 'Makine Şu Anda Müsait Değil' : 'Kiralamaya Uygun'}
                                        </h4>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            {listing.is_available === false
                                                ? 'Bu makine şu anda başka bir projede çalışıyor olabilir. Detaylı bilgi için satıcıyla iletişime geçiniz.'
                                                : 'Bu makine şu anda boşta ve kiralamaya hazırdır.'}
                                        </p>
                                    </div>
                                </div>
                            )}


                            {/* 3.7 Temel Bilgiler (Sadece Satılık ve Kiralık) - düzenli grid */}
                            {(type === 'sale' || type === 'rental') && (
                                <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/5">
                                        <h3 className="text-base font-semibold text-white">Temel Bilgiler</h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 p-5">
                                        <SpecItemCompact label="Model Yılı" value={listing.year || '—'} />
                                        <SpecItemCompact label="Çalışma Saati" value={listing.hours_meter != null ? `${listing.hours_meter} saat` : '—'} />
                                        <SpecItemCompact label="Makine Türü" value={categoryName} />
                                        {listing.usage_type && <SpecItemCompact label="Kullanım Durumu" value={listing.usage_type === 'new' ? 'Sıfır' : 'İkinci El'} />}
                                        {(specs.sub_type_condition != null || specs.tire_condition != null) && (
                                            <SpecItemCompact
                                                label="Alt Tip Durumu"
                                                value={TIRE_CONDITION_OPTIONS[specs.sub_type_condition as number] || TIRE_CONDITION_OPTIONS[specs.tire_condition as number] || String(specs.sub_type_condition ?? specs.tire_condition ?? '—')}
                                            />
                                        )}
                                        {type === 'rental' && <SpecItemCompact label="Lokasyon" value={locationString} />}
                                    </div>
                                </div>
                            )}

                            {/* 4. Teknik Özellikler (specifications; hariç: special_features, sub_type, class, truck_info, chassis_type, crane_type) */}
                            {(() => {
                                const technicalKeys = Object.keys(specs).filter(k => !TECHNICAL_SPEC_EXCLUDED_KEYS.includes(k as any) && k !== 'brand_id' && k !== 'model_id' && k !== 'category_id');
                                if (technicalKeys.length === 0) return null;
                                return (
                            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F]">
                                <div className="px-5 py-4 border-b border-white/5">
                                    <h3 className="text-base font-semibold text-white">Teknik Özellikler</h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 p-5">

                                    {/* Dynamic Specifications (JSON); excluded keys at top level */}
                                    {Object.entries(specs).map(([key, rawValue]) => {
                                        if (key === 'brand_id' || key === 'model_id' || key === 'category_id') return null;
                                        if (TECHNICAL_SPEC_EXCLUDED_KEYS.includes(key as any)) return null;

                                        // 3. Get Label (Türkçe; transmission_type vb. İngilizce anahtarlar çevrilir)
                                        const keyNorm = key.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/\s+/g, '_');
                                        let label = SPEC_LABEL_MAP[key] || SPEC_LABEL_MAP[keyNorm] || PARTS_TERMS[key] || PARTS_TERMS[keyNorm];
                                        if (!label) {
                                            label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                                        }

                                        // 4. Format Value
                                        let displayValue: any = 'Belirtilmedi';

                                        if (rawValue !== null && rawValue !== undefined && rawValue !== '') {
                                            if (typeof rawValue === 'boolean') {
                                                displayValue = rawValue ? 'Var' : 'Yok';
                                            }
                                            else if (typeof rawValue === 'object' && 'value' in rawValue) {
                                                displayValue = `${(rawValue as any).value} ${(rawValue as any).unit || ''}`;
                                            }
                                            else if ((key === 'tire_condition' || key === 'sub_type_condition') && typeof rawValue === 'number') {
                                                displayValue = TIRE_CONDITION_OPTIONS[rawValue] || `${rawValue}%`;
                                            }
                                            else if ((key === 'shipping' || key === 'shipping_info')) {
                                                displayValue = SHIPPING_INFO[String(rawValue)] || String(rawValue);
                                            }
                                            else if (typeof rawValue === 'object') {
                                                return null;
                                            }
                                            else {
                                                // Value Translation
                                                const valueStr = String(rawValue).toLowerCase();
                                                const translations: Record<string, string> = {
                                                    'excellent': 'Mükemmel',
                                                    'good': 'İyi',
                                                    'fair': 'Orta',
                                                    'poor': 'Kötü',
                                                    'new': 'Sıfır',
                                                    'used': 'İkinci El',
                                                    'refurbished': 'Revizyonlu',
                                                    'true': 'Var',
                                                    'false': 'Yok',
                                                    'seller_pays': 'Satıcı Öder',
                                                    'buyer_pays': 'Alıcı Öder',
                                                    'negotiable': 'Pazarlıklı',
                                                    'fixed': 'Sabit'
                                                };
                                                displayValue = translations[valueStr] || String(rawValue);
                                            }
                                        }

                                        return (
                                            <SpecItemCompact key={key} label={label} value={displayValue} />
                                        );
                                    })}

                                </div>
                            </div>
                                );
                            })()}

                            {/* 4.1 Yedek Parça: Teknik Detaylar */}
                            {type === 'part' && (
                                <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/5">
                                        <h3 className="text-base font-semibold text-white">Teknik Detaylar</h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 p-5">
                                        {listing.condition && (
                                            <SpecItem label="Parça Durumu" value={PARTS_CONDITION_LABELS[listing.condition] || getConditionLabel(listing.condition)} />
                                        )}
                                        <SpecItem label="Kategori" value={categoryName} />
                                        {listing.part_number && <SpecItem label="Parça No" value={String(listing.part_number)} />}
                                        {(listing.sub_category?.name || listing.parts_sub_categories?.name) && (
                                            <SpecItem label="Alt Kategori" value={listing.sub_category?.name || listing.parts_sub_categories?.name} />
                                        )}
                                        {(listing.production_year || listing.year) && (
                                            <SpecItem label="Üretim Yılı" value={String(listing.production_year ?? listing.year)} />
                                        )}
                                    </div>
                                    {((listing.compatibility && Array.isArray(listing.compatibility) && listing.compatibility.length > 0) || (typeof listing.compatibility === 'string' && listing.compatibility)) && (
                                        <div className="mt-4">
                                            <span className="text-xs uppercase tracking-wider text-neutral-500 block mb-2">Uyumlu Modeller</span>
                                            <div className="flex flex-wrap gap-2">
                                                {(Array.isArray(listing.compatibility) ? listing.compatibility : [listing.compatibility]).map((c: any, i: number) => (
                                                    <span key={i} className="inline-flex items-center rounded-md bg-white/5 px-2.5 py-1 text-sm text-white ring-1 ring-white/10">
                                                        {typeof c === 'object' ? (c?.name ?? c?.model ?? JSON.stringify(c)) : String(c)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 4.2 Yedek Parça: Teslimat Bilgileri */}
                            {type === 'part' && (
                                <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/5">
                                        <h3 className="text-base font-semibold text-white">Teslimat Bilgileri</h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 p-5">
                                        <SpecItem label="Lokasyon" value={locationString} />
                                        <SpecItem label="Kargo" value={SHIPPING_INFO[(listing.shipping_info || specs.shipping_info) as string] || (listing.shipping_info || specs.shipping_info) || 'Belirtilmedi'} />
                                        {(listing.warranty || specs.warranty) && (
                                            <SpecItem label="Garanti" value={WARRANTY_LABELS[listing.warranty || specs.warranty] || String(listing.warranty || specs.warranty)} />
                                        )}
                                    </div>
                                    {(listing.shipping_fee != null || specs.shipping_fee != null) && (
                                        <p className="text-sm text-neutral-400 mt-2">
                                            Kargo ücreti: {listing.shipping_fee ?? specs.shipping_fee}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* 5. Features & Attachments Lists */}
                            {(resolvedFeatures.length > 0 || resolvedAttachments.length > 0) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {resolvedFeatures.length > 0 && (
                                        <FeatureList title="Özellikler" icon={Wrench} items={resolvedFeatures} />
                                    )}
                                    {resolvedAttachments.length > 0 && (
                                        <FeatureList title="Ataşmanlar" icon={Tag} items={resolvedAttachments} />
                                    )}
                                </div>
                            )}


                            {/* 6. Description */}
                            <div className="rounded-xl border border-white/5 bg-white/5 p-6 sm:p-8">
                                <h3 className="mb-4 text-xl font-bold text-white">Açıklama</h3>
                                <div className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                                    {listing.description || "Açıklama bulunmuyor."}
                                </div>
                            </div>

                            {/* 7. Harita (konum varsa) */}
                            {(locationString && locationString !== 'Konum Belirtilmemiş') || (location?.coordinates || (typeof listing.location === 'object' && listing.location?.coordinates)) ? (
                                <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
                                    <div className="p-4 flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2 text-neutral-300">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            <span className="font-medium text-white">{locationString || 'Konum'}</span>
                                        </div>
                                        <a
                                            href={(() => {
                                                const coords = location?.coordinates || listing.location?.coordinates;
                                                const lat = coords?.lat ?? coords?.[0];
                                                const lng = coords?.lng ?? coords?.[1];
                                                if (lat != null && lng != null) return `https://www.google.com/maps?q=${lat},${lng}`;
                                                return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationString || '')}`;
                                            })()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/30 transition-colors"
                                        >
                                            <MapPin className="h-4 w-4" />
                                            Haritada Aç
                                        </a>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* RIGHT COLUMN (Sticky Sidebar - Desktop Only) */}
                        <div className="relative lg:col-span-1 hidden lg:block">
                            <div className="sticky top-4 h-fit space-y-6">

                                {/* Seller Card */}
                                <div className="rounded-xl border border-white/10 border-t-4 border-t-primary bg-[#0A0A0A] p-6 shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        {/* Avatar */}
                                        <div className="relative h-16 w-16 shrink-0 rounded-full border-2 border-white/10 bg-neutral-800 overflow-hidden">
                                            {sellerImage ? (
                                                <Image src={getImageUrl(sellerImage)} alt={sellerName} fill className="object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-xl font-bold text-white uppercase">
                                                    {sellerName.substring(0, 2)}
                                                </div>
                                            )}
                                            {isStore && (
                                                <div className="absolute bottom-0 right-0 h-4 w-4 bg-primary border-2 border-[#0A0A0A] rounded-full" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-white truncate flex items-center gap-1">
                                                {sellerName}
                                                {isStore && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                                            </h3>
                                            <div className="text-sm text-neutral-400 truncate">
                                                {sellerCity || 'Şehir Belirtilmemiş'}{sellerDistrict ? `, ${sellerDistrict}` : ''}
                                            </div>
                                            {isStore ? (
                                                <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white">
                                                    <Shield className="h-3 w-3" /> Kurumsal Mağaza
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white">
                                                    Bireysel Satıcı
                                                </span>
                                            )}

                                            <div className="mt-3">
                                                <Link
                                                    href={`/galeri/${profile.slug || toSlug(isStore ? (profile.store_name || "") : (profile.name || "")) || profile.id}`}
                                                    className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-primary/90 hover:text-primary transition-colors"
                                                >
                                                    {isStore ? "MAĞAZAYI ZİYARET ET" : "SATICI PROFİLİNİ GÖR"}
                                                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 group-hover/link:bg-primary group-hover/link:text-black transition-all">
                                                        <ChevronRight className="h-2.5 w-2.5" />
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Action Buttons: Mesaj her zaman; telefon görünürse WhatsApp + Hemen Ara */}
                                    <div className="space-y-3">
                                        <AppGuard trigger="message" productImage={images[0] ? getImageUrl(images[0]) : undefined} className="w-full">
                                            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent py-4 font-bold text-white transition-all hover:bg-white/5">
                                                <MessageSquare className="h-5 w-5" />
                                                Mesaj Gönder
                                            </button>
                                        </AppGuard>
                                        {phoneVisible && publicPhone && (
                                            <>
                                                <AppGuard trigger="message" productImage={images[0] ? getImageUrl(images[0]) : undefined} className="w-full">
                                                    <a
                                                        href={`https://wa.me/${normalizePhoneForWhatsApp(publicPhone)}?text=${encodeURIComponent(`Merhaba, ${listing.title || 'ilan'} hakkında bilgi almak istiyorum.`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 py-4 font-bold text-green-400 transition-all hover:bg-green-500/20"
                                                    >
                                                        <MessageSquare className="h-5 w-5" />
                                                        WhatsApp
                                                    </a>
                                                </AppGuard>
                                                <AppGuard trigger="call" productImage={images[0] ? getImageUrl(images[0]) : undefined} className="w-full">
                                                    <a href={`tel:${publicPhone.replace(/\s/g, '')}`} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-lg font-black text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] group">
                                                        <Phone className="h-5 w-5" />
                                                        Hemen Ara
                                                    </a>
                                                </AppGuard>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Safety Tips */}
                                <div className="rounded-lg border border-white/5 bg-white/5 p-4 text-xs text-neutral-400 flex gap-3">
                                    <Shield className="h-5 w-5 shrink-0 text-neutral-500" />
                                    <p>
                                        Güvenli alışveriş için ödeme yapmadan önce makineyi görmenizi tavsiye ederiz. Kapora dolandırıcılığına dikkat ediniz.
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar: Fiyat (veya Sorunuz) + Mesaj + (telefon görünürse) WhatsApp + Ara */}
            <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-neutral-200 p-4 lg:hidden pb-safe">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Fiyat</span>
                        <span className="text-lg font-bold text-orange-600">
                            {(() => {
                                const p = formatPrice(pricing, type, priceHidden);
                                return Array.isArray(p) ? p[0] : p;
                            })()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AppGuard trigger="message" productImage={images[0] ? getImageUrl(images[0]) : undefined}>
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 font-bold text-sm shadow-sm active:scale-95 transition-transform">
                                <MessageSquare className="h-4 w-4" />
                                MESAJ
                            </button>
                        </AppGuard>
                        {phoneVisible && publicPhone && (
                            <>
                                <AppGuard trigger="message" productImage={images[0] ? getImageUrl(images[0]) : undefined}>
                                    <a href={`https://wa.me/${normalizePhoneForWhatsApp(publicPhone)}?text=${encodeURIComponent(`Merhaba, ${listing.title || 'ilan'} hakkında bilgi almak istiyorum.`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-green-600 bg-green-50 px-4 py-3 text-green-700 font-bold text-sm shadow-sm active:scale-95 transition-transform">
                                        <MessageSquare className="h-4 w-4" />
                                        WHATSAPP
                                    </a>
                                </AppGuard>
                                <AppGuard trigger="call" productImage={images[0] ? getImageUrl(images[0]) : undefined}>
                                    <a href={`tel:${publicPhone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform">
                                        <Phone className="h-4 w-4" />
                                        ARA
                                    </a>
                                </AppGuard>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isGalleryOpen && (
                <FullScreenGallery
                    images={images}
                    activeIndex={activeImage}
                    onClose={() => setIsGalleryOpen(false)}
                    onIndexChange={setActiveImage}
                />
            )}
        </>
    );
}


// --- Sub Components ---
function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset capitalize", className)}>
            {children}
        </span>
    );
}

function SpecItem({ label, value }: { label: string; value: string | number | null }) {
    const isMissing = value === 'Belirtilmedi' || value === '-' || !value;
    return (
        <div className="flex flex-col gap-0.5">
            <div className="text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
            <div className={cn("text-sm font-medium truncate", isMissing ? "text-neutral-500" : "text-white")}>
                {value || 'Belirtilmedi'}
            </div>
        </div>
    );
}

function SpecItemCompact({ label, value }: { label: string; value: string | number | null }) {
    const isMissing = value === 'Belirtilmedi' || value === '—' || value === '-' || !value;
    return (
        <div className="flex flex-col gap-0.5">
            <div className="text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
            <div className={cn("text-sm font-medium truncate", isMissing ? "text-neutral-500" : "text-white")}>
                {value || '—'}
            </div>
        </div>
    );
}

function FeatureList({ title, icon: Icon, items }: { title: string; icon: React.ComponentType<{ className?: string }>; items: any[] }): any {
    return (
        <div className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <h3 className="text-base font-semibold text-white">{title}</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-5">
                {items.map((item: any) => (
                    <li key={item.id} className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <span>{item.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

