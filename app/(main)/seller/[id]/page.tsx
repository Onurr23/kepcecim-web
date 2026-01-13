"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import ListingCard from "@/components/listing/ListingCard";
import FilterTabs from "@/components/store/FilterTabs";
import StoreSidebar from "@/components/store/StoreSidebar";
import MobileActionFooter from "@/components/store/MobileActionFooter";
import SellerHero from "@/components/seller/SellerHero";
import UpsellCard from "@/components/seller/UpsellCard";
import SellerProfileSkeleton from "@/components/seller/SellerProfileSkeleton";
import { createClient } from "@/utils/supabase/client";

// Types
type SellerType = "corporate" | "individual";

interface SellerProfile {
    id: string;
    type: SellerType;
    name: string;
    logo: string;
    coverImage?: string;
    memberSince: string;
    slogan?: string;
    phone: string;
    authorizedPerson?: string;
    taxNumber?: string;
    address?: string;
    location?: string;
}

const TABS = [
    { id: "all", label: "Tümü", count: 0 },
    { id: "SALE", label: "Satılık", count: 0 },
    { id: "RENT", label: "Kiralık", count: 0 },
    { id: "SPARE_PART", label: "Yedek Parça", count: 0 },
];

export default function SellerProfilePage() {
    const params = useParams();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
            const supabase = createClient();

            try {
                // 1. Fetch Profile
                const { data: profile, error: profileError } = await supabase
                    .from("user_profiles")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (profileError || !profile) {
                    console.error("Profile fetch error:", profileError);
                    setLoading(false);
                    return;
                }

                // Helper for storage URLs
                const getStorageUrl = (path: string) => {
                    if (!path) return "";
                    if (path.startsWith('http')) return path;
                    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvritvbtpntvwyispsid.supabase.co";
                    return `${baseUrl}/storage/v1/object/public/machine-images/${path}`;
                };

                // Parse Address & Coordinates
                let fullAddress = "";
                let coordinates = null;
                if (profile.store_address) {
                    try {
                        const addr = typeof profile.store_address === 'string'
                            ? JSON.parse(profile.store_address)
                            : profile.store_address;
                        fullAddress = addr?.fullAddress || profile.store_address;
                        coordinates = addr?.coordinates || null;
                    } catch (e) {
                        fullAddress = profile.store_address;
                    }
                }

                // Map Profile
                const isStore = profile.is_store;
                const mappedSeller: SellerProfile = {
                    id: profile.id,
                    type: isStore ? "corporate" : "individual",
                    name: isStore ? (profile.store_name || profile.name) : profile.name,
                    logo: profile.avatar_url ? getStorageUrl(profile.avatar_url) : (isStore ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200"),
                    coverImage: profile.store_cover_image_url ? getStorageUrl(profile.store_cover_image_url) : undefined,
                    memberSince: profile.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) + " tarihinden beri" : "Yeni",
                    slogan: profile.store_description || (isStore ? "İş makineleri hakkında her şey" : ""),
                    phone: profile.public_phone || profile.phone,
                    authorizedPerson: profile.name,
                    taxNumber: "",
                    address: fullAddress,
                    location: [profile.city, profile.district].filter(Boolean).map(s => s.trim()).join(", ") || "Türkiye",
                };
                setSeller(mappedSeller);
                (mappedSeller as any).coordinates = coordinates;

                // 2. Fetch Listings from 3 different tables
                const [salesRes, rentalRes, partsRes] = await Promise.all([
                    supabase.from("sales_machines").select("*, machine_brands(name), machine_models(name)").eq("operator_id", id),
                    supabase.from("rental_machines").select("*, machine_brands(name), machine_models(name)").eq("operator_id", id),
                    supabase.from("parts").select("*, parts_brands(name), parts_categories(name)").eq("supplier_id", id)
                ]);

                const allProducts: any[] = [];

                // Helper to map different listing types
                const mapItem = (item: any, listingType: "SALE" | "RENT" | "PART") => {
                    const pricing = typeof item.pricing === 'string' ? JSON.parse(item.pricing) : item.pricing;
                    const loc = typeof item.location === 'string' ? JSON.parse(item.location) : item.location;
                    const brandName = item.machine_brands?.name || item.parts_brands?.name || item.custom_brand_text;
                    const modelName = item.machine_models?.name || item.parts_categories?.name || "";

                    let priceDisplay = "Fiyat Sorunuz";
                    if (pricing) {
                        const amount = listingType === "RENT" ? pricing.dailyRate : (pricing.price || pricing.salePrice);
                        if (amount) {
                            priceDisplay = `${Number(amount).toLocaleString('tr-TR')} ${pricing.currency || '₺'}${listingType === "RENT" ? "/gün" : ""}`;
                        }
                    }

                    return {
                        id: item.id,
                        title: item.title || `${brandName || ''} ${modelName || ''}`.trim(),
                        subtitle: brandName ? `${brandName} ${modelName || ""}`.trim() : mappedSeller.name,
                        price: priceDisplay,
                        location: loc ? `${loc.city || ''}${loc.district ? `, ${loc.district}` : ''}` : (item.city ? `${item.city}${item.district ? `, ${item.district}` : ''}` : "Konum Belirtilmedi"),
                        image: getStorageUrl(item.images?.[0] || item.image_url),
                        type: listingType,
                        specs: {
                            year: Number(item.year || item.production_year) || 0,
                            hours: item.hours_meter ? `${item.hours_meter} Saat` : "-",
                            weight: item.operating_weight || "-"
                        }
                    };
                };

                if (salesRes.data) allProducts.push(...salesRes.data.map(i => mapItem(i, "SALE")));
                if (rentalRes.data) allProducts.push(...rentalRes.data.map(i => mapItem(i, "RENT")));
                if (partsRes.data) allProducts.push(...partsRes.data.map(i => mapItem(i, "PART")));

                setProducts(allProducts);

            } catch (err) {
                console.error("Error fetching seller data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) return <SellerProfileSkeleton />;
    if (!seller) return <div className="flex h-screen items-center justify-center bg-[#050505] text-white">Satıcı bulunamadı.</div>;

    // Filter Logic
    const filteredProducts = activeTab === "all"
        ? products
        : products.filter(p => {
            if (activeTab === "SPARE_PART") return p.type === "PART";
            return p.type === activeTab;
        });

    // Calculate counts
    const currentTabs = TABS.map(t => {
        let count = 0;
        if (t.id === "all") {
            count = products.length;
        } else if (t.id === "SPARE_PART") {
            count = products.filter(p => p.type === "PART").length;
        } else {
            count = products.filter(p => p.type === t.id).length;
        }
        return { ...t, count };
    });

    return (
        <main className="min-h-screen bg-[#050505] pb-24 md:pb-12">
            {/* Hero Section */}
            <SellerHero
                type={seller.type}
                name={seller.name}
                logo={seller.logo}
                coverImage={seller.coverImage}
                memberSince={seller.memberSince}
                slogan={seller.slogan}
                location={seller.location}
            />

            <div className="mx-auto mt-8 max-w-7xl px-4 md:px-8">

                {/* Layout Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

                    {/* LEFT COLUMN (Inventory & Filters) */}
                    <div className={seller.type === "corporate" ? "lg:col-span-3" : "lg:col-span-4"}>

                        <div className="mb-6">
                            <FilterTabs
                                tabs={currentTabs}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        </div>

                        {seller.type === "individual" && (
                            <div className="mb-8 max-w-2xl mx-auto lg:mx-0">
                                <UpsellCard />
                            </div>
                        )}

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="h-full">
                                    <ListingCard
                                        {...product}
                                        type={product.type === "SALE" ? "sale" : product.type === "RENT" ? "rent" : "part"}
                                    />
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-12 text-center text-neutral-500">
                                    Bu kategoride ilan bulunamadı.
                                </div>
                            )}
                        </div>

                        {/* Corporate Mobile Map Section */}
                        {seller.type === "corporate" && seller.address && (
                            <div className="mt-8 overflow-hidden rounded-2xl bg-[#121212] border border-white/5 lg:hidden">
                                <div className="relative h-48 w-full bg-neutral-800">
                                    {(seller as any).coordinates ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            src={`https://maps.google.com/maps?q=${(seller as any).coordinates.lat},${(seller as any).coordinates.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                            className="grayscale contrast-125 opacity-70"
                                        />
                                    ) : (
                                        <>
                                            <Image
                                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600&h=400"
                                                alt="Map Location"
                                                fill
                                                className="object-cover opacity-60 grayscale"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative rounded-full bg-orange-600 p-2 shadow-lg shadow-orange-900/30">
                                                    <MapPin className="h-6 w-6 text-black" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="container p-4">
                                    <h3 className="mb-2 text-lg font-bold text-white">Konum</h3>
                                    <p className="text-sm text-neutral-400">{seller.address}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN (Sidebar - Corporate Only) */}
                    {seller.type === "corporate" && (
                        <div className="hidden lg:block lg:col-span-1">
                            <StoreSidebar
                                phone={seller.phone}
                                authorizedPerson={seller.authorizedPerson || ""}
                                taxNumber={seller.taxNumber}
                                address={seller.address || ""}
                                coordinates={(seller as any).coordinates}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <MobileActionFooter />
        </main>
    );
}
