"use client";

import { useState } from "react";
import ListingCard from "@/components/listing/ListingCard";
import StoreHero from "@/components/store/StoreHero";
import FilterTabs from "@/components/store/FilterTabs";
import StoreSidebar from "@/components/store/StoreSidebar";
import MobileActionFooter from "@/components/store/MobileActionFooter";
import { MapPin } from "lucide-react";
import Image from "next/image";

// Mock Data (Replace with API fetch in future)
const STORE_DATA = {
    name: "Ostim Makine",
    logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=2000&h=600",
    memberSince: "13 Eylül 2025",
    slogan: "İş makineleri hakkında her şey",
    phone: "+90 555 123 45 67",
    authorizedPerson: "Ahmet Yılmaz",
    taxNumber: "1234567890",
    address: "2112. Cd., 7A, Batıkent, Yenimahalle, 06370, Türkiye",
};

const PRODUCTS = [
    {
        id: 1,
        title: "Motor Parçası",
        subtitle: "KOLBENSCHMIDT",
        price: "₺55.000",
        location: "Karacabey, Bursa",
        image: "https://images.unsplash.com/photo-1635338600889-80860072b226?auto=format&fit=crop&q=80&w=800&h=600",
        type: "part" as const,
        specs: { year: 2024, hours: "0", weight: "12kg" }
    },
    {
        id: 2,
        title: "Motor Filtresi",
        subtitle: "HIDROMEK",
        price: "₺2.500",
        location: "Efeler, Aydın",
        image: "https://images.unsplash.com/photo-1549646270-d9dd4703a4cf?auto=format&fit=crop&q=80&w=800&h=600",
        type: "part" as const,
        specs: { year: 2024, hours: "0", weight: "2kg" }
    },
    {
        id: 3,
        title: "Hidrolik Pompa Cat",
        subtitle: "CATERPILLAR",
        price: "₺35.000",
        location: "Ostim, Ankara",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800&h=600",
        type: "part" as const,
        specs: { year: 2023, hours: "0", weight: "45kg" }
    },
    {
        id: 4,
        title: "Temiz Bekoloder",
        subtitle: "HIDROMEK • HMK 102 B",
        price: "₺4.750.000",
        location: "Devrekani, Kastamonu",
        image: "https://images.unsplash.com/photo-1519003300449-424adfae0521?auto=format&fit=crop&q=80&w=800&h=600",
        type: "sale" as const,
        specs: { year: 2025, hours: "120", weight: "9 ton" }
    },
    {
        id: 5,
        title: "Cat 320D Satılık",
        subtitle: "CATERPILLAR • 320D",
        price: "₺5.500.000",
        location: "Didim, Aydın",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800&h=600",
        type: "sale" as const,
        specs: { year: 2025, hours: "500", weight: "22 ton" }
    },
    {
        id: 6,
        title: "Kiralık Mini Yükleyici",
        subtitle: "BOBCAT • S550",
        price: "₺150.000/Ay",
        location: "İstanbul",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800&h=600",
        type: "rent" as const,
        specs: { year: 2022, hours: "1500", weight: "3 ton" }
    },
];

const TABS = [
    { id: "all", label: "Tümü", count: 11 },
    { id: "sale", label: "Satılık", count: 5 },
    { id: "rent", label: "Kiralık", count: 3 },
    { id: "part", label: "Yedek Parça", count: 2 },
];

import { useParams } from "next/navigation";

export default function StoreProfilePage() {
    const params = useParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const id = params?.id as string;

    const [activeTab, setActiveTab] = useState("all");

    const filteredProducts = activeTab === "all"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.type === activeTab);

    return (
        <main className="min-h-screen bg-[#050505] pb-24 md:pb-12">
            {/* Hero Section */}
            <StoreHero
                name={STORE_DATA.name}
                logo={STORE_DATA.logo}
                coverImage={STORE_DATA.coverImage}
                memberSince={STORE_DATA.memberSince}
                slogan={STORE_DATA.slogan}
            />

            <div className="mx-auto mt-8 max-w-7xl px-4 md:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Left Column (Inventory) */}
                    <div className="lg:col-span-3">
                        {/* Filter Tabs */}
                        <div className="mb-6">
                            <FilterTabs
                                tabs={TABS}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="h-full">
                                    <ListingCard {...product} />
                                </div>
                            ))}
                        </div>

                        {/* Mobile Map Section (Bottom of content) */}
                        <div className="mt-8 overflow-hidden rounded-2xl bg-[#121212] border border-white/5 lg:hidden">
                            <div className="relative h-48 w-full bg-neutral-800">
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
                            </div>
                            <div className="container p-4">
                                <h3 className="mb-2 text-lg font-bold text-white">Konum</h3>
                                <p className="text-sm text-neutral-400">{STORE_DATA.address}</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <StoreSidebar
                            phone={STORE_DATA.phone}
                            authorizedPerson={STORE_DATA.authorizedPerson}
                            taxNumber={STORE_DATA.taxNumber}
                            address={STORE_DATA.address}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <MobileActionFooter />
        </main>
    );
}
