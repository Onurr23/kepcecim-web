"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Calendar,
    Clock,
    Weight,
    Tag,
    CheckCircle2,
    Phone,
    MessageSquare,
    Shield,
    ChevronRight,
    Share2,
    Heart,
    Truck,
    Wrench,
    Fuel,
    X,
    ChevronLeft,
    Info,
    Ruler
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPEC_LABEL_MAP, PARTS_TERMS, TIRE_CONDITION_OPTIONS, SHIPPING_INFO } from "@/constants/listing-specs";

// --- Types ---
type ListingType = 'sale' | 'rental' | 'part';

interface ListingDetailProps {
    listing: any;
    type: ListingType;
}

// --- Helpers ---

const formatPrice = (price: any, type: ListingType) => {
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

    const currency = pricingData.currency || 'TRY';
    const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    });

    if (type === 'rental') {
        const rates = [];
        if (pricingData.dailyRate) rates.push(`${formatter.format(pricingData.dailyRate)} / GÜN`);
        if (pricingData.weeklyRate) rates.push(`${formatter.format(pricingData.weeklyRate)} / HAFTA`);
        if (pricingData.monthlyRate) rates.push(`${formatter.format(pricingData.monthlyRate)} / AY`);

        if (rates.length > 0) return rates;

        // Fallback to generic price if no rates
        if (pricingData.price) return [`${formatter.format(pricingData.price)} / GÜN`];
        return ['Fiyat Belirtilmemiş'];
    }

    return [formatter.format(pricingData.price || 0)];
};

const getImageUrl = (image: string) => {
    if (!image) return "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1000&auto=format&fit=crop";
    if (image.startsWith('http')) return image;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/machine-images/${image}`;
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
    const images = listing.images || [];

    // Parse JSONB fields safely
    const specs = typeof listing.specifications === 'string'
        ? JSON.parse(listing.specifications || '{}')
        : (listing.specifications || {});

    const pricing = typeof listing.pricing === 'string'
        ? JSON.parse(listing.pricing || '{}')
        : (listing.pricing || {});

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

    // Location String
    const location = listing.location
        ? (typeof listing.location === 'string' ? JSON.parse(listing.location) : listing.location)
        : { city: sellerCity, district: sellerDistrict };
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

                                {/* Title & Top Badges */}
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {/* Type Badge */}
                                        {type === 'rental' && <Badge className="bg-primary/10 text-primary ring-primary/20">Kiralık</Badge>}
                                        {type === 'part' && <Badge className="bg-blue-500/10 text-blue-400 ring-blue-500/20">Yedek Parça</Badge>}
                                        {type === 'sale' && <Badge className="bg-emerald-500/10 text-emerald-400 ring-emerald-500/20">Satılık</Badge>}

                                        {/* Year Badge (Machines) */}
                                        {listing.year && <Badge className="bg-white/10 text-white ring-white/20">{listing.year}</Badge>}

                                        {/* Condition Badge (Sales/Parts High Level) */}
                                        {listing.condition && (
                                            <Badge className={getConditionColor(listing.condition)}>
                                                {getConditionLabel(listing.condition)}
                                            </Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                                        {listing.title}
                                    </h1>
                                </div>

                                {/* Price & Location Row */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-6">
                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-2">
                                            {(() => {
                                                const prices = formatPrice(pricing, type);
                                                if (Array.isArray(prices)) {
                                                    return prices.map((p, idx) => (
                                                        <p key={idx} className={cn(
                                                            "font-bold font-oswald text-primary tracking-tight",
                                                            idx === 0 ? "text-4xl" : "text-xl text-neutral-400"
                                                        )}>
                                                            {p}
                                                        </p>
                                                    ));
                                                }
                                                return <p className="text-4xl font-bold font-oswald text-primary tracking-tight">{prices}</p>;
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

                                    {/* Overlay Icons */}
                                    <div className="absolute right-4 top-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-black/60 backdrop-blur-md rounded-lg px-3 py-1 text-white text-xs font-medium flex items-center gap-2">
                                            <span>Büyütmek için tıkla</span>
                                        </div>
                                    </div>

                                    {/* Image Count Badge */}
                                    <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded z-20 font-medium flex items-center gap-1">
                                        <span>📷</span>
                                        <span>{activeImage + 1} / {images.length}</span>
                                    </div>
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

                            {/* 3. Condition Section (Sales Specific) */}
                            {type === 'sale' && listing.condition && (
                                <div className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        Durum Değerlendirmesi
                                    </h3>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-neutral-400 text-sm">Genel Kondisyon</span>
                                            <span className={cn("text-lg font-bold", getConditionColor(listing.condition).split(' ')[0])}>
                                                {getConditionLabel(listing.condition)}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000"
                                                style={{ width: `${getConditionPercentage(listing.condition)}%` }}
                                            />
                                        </div>

                                        {/* Usage Type */}
                                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-neutral-500 uppercase tracking-wider">Kullanım Tipi</span>
                                                <span className="text-white font-medium">{listing.usage_type === 'new' ? 'Sıfır' : 'İkinci El'}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-neutral-500 uppercase tracking-wider">Onay</span>
                                                <span className="text-green-500 font-medium flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> Kontrol Edildi
                                                </span>
                                            </div>
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
                                            {listing.is_available === false ? 'Şu An Müsait Değil' : 'Kiralamaya Uygun'}
                                        </h4>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            {listing.is_available === false
                                                ? 'Bu makine şu anda başka bir projede çalışıyor olabilir. Detaylı bilgi için satıcıyla iletişime geçiniz.'
                                                : 'Bu makine şu anda boşta ve kiralamaya hazırdır.'}
                                        </p>
                                    </div>
                                </div>
                            )}


                            {/* 4. Specs Grid */}
                            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F]">
                                <div className="grid grid-cols-2 divide-x divide-y divide-white/5 md:grid-cols-3">

                                    {/* Core Specs (Top Level Columns) */}
                                    <SpecItem icon={Tag} label="Marka" value={brandName} />
                                    <SpecItem icon={Construction} label={type === 'part' ? 'Parça Adı' : 'Model'} value={modelName} />
                                    <SpecItem icon={Tag} label="Kategori" value={categoryName} />
                                    {type !== 'part' && <SpecItem icon={Calendar} label="Yıl" value={listing.year || 'Belirtilmedi'} />}
                                    {type !== 'part' && <SpecItem icon={Clock} label="Saat" value={listing.hours_meter ? `${listing.hours_meter} saat` : 'Belirtilmedi'} />}

                                    {/* Dynamic Specifications (JSON) */}
                                    {Object.entries(specs).map(([key, rawValue]) => {
                                        // 1. Skip brand_id and other internals
                                        if (key === 'brand_id' || key === 'model_id' || key === 'category_id') return null;

                                        // 2. Handle nested truck_info
                                        if (key === 'truck_info' && typeof rawValue === 'object' && rawValue !== null) {
                                            return Object.entries(rawValue).map(([tKey, tValue]) => {
                                                if (tKey === 'brand_id') return null;

                                                let tLabel = SPEC_LABEL_MAP[tKey] || tKey;
                                                // Specific overrides for truck context if needed
                                                if (tKey === 'brand_name') tLabel = 'Kamyon Markası';

                                                return (
                                                    <SpecItem
                                                        key={`${key}-${tKey}`}
                                                        icon={Truck}
                                                        label={tLabel}
                                                        value={String(tValue || 'Belirtilmedi')}
                                                    />
                                                );
                                            });
                                        }

                                        // 3. Get Label
                                        let label = SPEC_LABEL_MAP[key] || PARTS_TERMS[key];
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
                                            else if (key === 'tire_condition' && typeof rawValue === 'number') {
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

                                        // 5. Choose Icon
                                        let Icon = Construction;
                                        if (key === 'operating_weight' || key === 'weight' || key.includes('capacity')) Icon = Weight;
                                        if (key.includes('height') || key.includes('depth') || key.includes('reach') || key.includes('width') || key.includes('dimensions')) Icon = Ruler;
                                        if (key.includes('engine') || key.includes('fuel')) Icon = Fuel;

                                        return (
                                            <SpecItem key={key} icon={Icon} label={label} value={displayValue} />
                                        );
                                    })}

                                    {/* Extra Parts Fields (Top Level) */}
                                    {type === 'part' && listing.warranty !== undefined && (
                                        <SpecItem icon={Shield} label="Garanti" value={listing.warranty ? 'Mevcut' : 'Yok'} />
                                    )}
                                    {type === 'part' && listing.shipping_info && !specs.shipping_info && (
                                        <SpecItem icon={Truck} label="Kargo" value={SHIPPING_INFO[listing.shipping_info] || listing.shipping_info} />
                                    )}

                                </div>
                            </div>

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

                                            {/* View Profile Link */}
                                            <Link
                                                href={`/seller/${profile.id}`}
                                                className="mt-2 inline-flex items-center text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors"
                                            >
                                                {isStore ? "Mağazayı Gör" : "Satıcı Profilini Gör"} <ChevronRight className="h-3 w-3 ml-0.5" />
                                            </Link>
                                        </div>
                                    </div>


                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-lg font-black text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] group">
                                            <Phone className="h-5 w-5 transition-transform group-hover:shake" />
                                            NUMARAYI GÖSTER
                                        </button>
                                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent py-4 font-bold text-white transition-all hover:bg-white/5">
                                            <MessageSquare className="h-5 w-5" />
                                            Mesaj Gönder
                                        </button>
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

            {/* Mobile Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-neutral-200 p-4 lg:hidden pb-safe">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Fiyat</span>
                        <span className="text-lg font-bold text-orange-600">
                            {(() => {
                                const p = formatPrice(pricing, type);
                                // p might be string (error) or array.
                                return Array.isArray(p) ? p[0] : p;
                            })()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform">
                            <Phone className="h-4 w-4" />
                            ARA
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 font-bold text-sm shadow-sm active:scale-95 transition-transform">
                            <MessageSquare className="h-4 w-4" />
                            MESAJ
                        </button>
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

function SpecItem({ icon: Icon, label, value }: { icon: any, label: string, value: string | number | null }) {
    const isMissing = value === 'Belirtilmedi' || value === '-' || !value;

    return (
        <div className="p-4 flex flex-col justify-center">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                <Icon className="h-3 w-3" />
                {label}
            </div>
            <div className={cn("text-lg font-bold truncate", isMissing ? "text-neutral-600 text-sm font-normal italic" : "text-white")}>
                {value || 'Belirtilmedi'}
            </div>
        </div>
    );
}

function FeatureList({ title, icon: Icon, items }: { title: string, icon: any, items: any[] }): any {
    return (
        <div className="rounded-xl border border-white/5 bg-white/5 p-6">
            <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {title}
            </h3>
            <ul className="grid grid-cols-1 gap-2">
                {items.map((item: any) => (
                    <li key={item.id} className="flex items-center gap-2 text-neutral-300">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="text-sm">{item.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Construction(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="8" rx="1" />
            <path d="M17 14v7" />
            <path d="M7 14v7" />
            <path d="M17 3v3" />
            <path d="M7 3v3" />
            <path d="M10 14 2.3 6.3" />
            <path d="m14 6 7.7 7.7" />
            <path d="m8 6 8 8" />
        </svg>
    )
}
