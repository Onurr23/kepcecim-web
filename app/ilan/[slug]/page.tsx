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
  Star,
  Share2,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Mock Data
const MOCK_LISTING = {
  id: "cat-320-gc",
  title: "2022 Model CAT 320 GC - Az Saatte, Servis Bakımlı",
  price: "4.250.000 ₺",
  location: "İstanbul, Pendik",
  images: [
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200", // Excavator 1
    "https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?q=80&w=800", // Detail 1
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800", // Site
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800", // Action
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800", // Side
  ],
  specs: {
    Brand: "Caterpillar",
    Model: "320 GC",
    Year: 2022,
    Hours: "1.250 Saat",
    Weight: "21 Ton",
    Status: "Satılık",
  },
  badges: ["Krediye Uygun", "Garantili", "İlk Sahibinden"],
  description: `
    Makine 2022 model olup, sadece 1.250 saatte ve tamamen yetkili servis bakımlıdır. 
    Ağır işlerde çalışmamış, peyzaj ve hafif hafriyat işlerinde kullanılmıştır. 
    Yürüyüş takımları %90 seviyesindedir. Kova ve tırnaklar yeni değişmiştir.
    
    Tüm periyodik bakımları Borusan Makina tarafından zamanında yapılmıştır. 
    Fatura kesilecektir (+KDV). Kredi kullanımına uygundur.
    İstenilen ustaya veya servise gösterilebilir.
    
    Özellikler:
    - 21 Ton Çalışma Ağırlığı
    - 0.9 m³ Kova Kapasitesi
    - Klima, Kamera Sistemi
    - Kırıcı Hattı Mevcut
  `,
  seller: {
    name: "Makine Parkı A.Ş.",
    rating: 4.8,
    verified: true,
    phone: "+90 532 123 45 67",
    memberSince: "2018",
  },
};

const SIMILAR_LISTINGS = [
  {
    id: 1,
    title: "2020 Volvo EC220",
    price: "3.850.000 ₺",
    location: "Ankara",
    image: "https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?q=80&w=500",
  },
  {
    id: 2,
    title: "2019 Komatsu PC200",
    price: "3.200.000 ₺",
    location: "İzmir",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500",
  },
  {
    id: 3,
    title: "2021 Hidromek HMK 230",
    price: "4.100.000 ₺",
    location: "Bursa",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500",
  },
  {
    id: 4,
    title: "2018 JCB JS220",
    price: "2.950.000 ₺",
    location: "Antalya",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=500",
  },
];

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          
          {/* LEFT COLUMN (Content) */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* 1. Header Section (Moved to Top) */}
            <div className="space-y-4">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm text-neutral-400">
                <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/ilanlar" className="hover:text-primary transition-colors">Ekskavatör</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/ilanlar" className="hover:text-primary transition-colors">Paletli</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">CAT 320</span>
              </nav>

              {/* Title & Badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {MOCK_LISTING.badges.map((badge) => (
                    <span key={badge} className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                      {badge}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {MOCK_LISTING.title}
                </h1>
              </div>

              {/* Price & Location */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-6">
                <p className="text-4xl font-black text-primary tracking-tight">
                  {MOCK_LISTING.price}
                </p>
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin className="h-5 w-5 text-neutral-500" />
                  {MOCK_LISTING.location}
                  <span className="mx-2 text-neutral-600">•</span>
                  <span className="text-sm">İlan No: #82910</span>
                </div>
              </div>
            </div>

            {/* 2. Gallery (Polished) */}
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                <Image
                  src={MOCK_LISTING.images[activeImage]}
                  alt={MOCK_LISTING.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                
                <div className="absolute right-4 top-4 flex gap-2 z-10">
                  <button className="rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-primary hover:text-white">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-primary hover:text-white">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {MOCK_LISTING.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-white/10 transition-all",
                      activeImage === index ? "ring-2 ring-primary ring-offset-2 ring-offset-black opacity-100" : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Tech Specs Grid (Redesigned) */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F]">
              <div className="grid grid-cols-2 divide-x divide-y divide-white/5 md:grid-cols-3">
                <div className="p-4 flex flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                    <Tag className="h-3 w-3" />
                    Marka
                  </div>
                  <div className="text-lg font-bold text-white">{MOCK_LISTING.specs.Brand}</div>
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                    <Construction className="h-3 w-3" />
                    Model
                  </div>
                  <div className="text-lg font-bold text-white">{MOCK_LISTING.specs.Model}</div>
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                    <Calendar className="h-3 w-3" />
                    Yıl
                  </div>
                  <div className="text-lg font-bold text-white">{MOCK_LISTING.specs.Year}</div>
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                    <Clock className="h-3 w-3" />
                    Saat
                  </div>
                  <div className="text-lg font-bold text-white">{MOCK_LISTING.specs.Hours}</div>
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                    <Weight className="h-3 w-3" />
                    Ağırlık
                  </div>
                  <div className="text-lg font-bold text-white">{MOCK_LISTING.specs.Weight}</div>
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                    <CheckCircle2 className="h-3 w-3" />
                    Durum
                  </div>
                  <div className="text-lg font-bold text-white">{MOCK_LISTING.specs.Status}</div>
                </div>
              </div>
            </div>

            {/* 4. Description (Enhanced) */}
            <div className="rounded-xl border border-white/5 bg-white/5 p-6 sm:p-8">
              <h3 className="mb-4 text-xl font-bold text-white">Açıklama</h3>
              <div className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
                {MOCK_LISTING.description}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <div className="relative lg:col-span-1">
            <div className="sticky top-24 space-y-6 rounded-xl border-x border-b border-white/10 border-t-4 border-t-primary bg-[#0A0A0A] p-6 shadow-2xl">
              
              {/* Seller Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-xl font-bold text-white border border-white/5">
                  MP
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {MOCK_LISTING.seller.name}
                    {MOCK_LISTING.seller.verified && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </h3>
                  <div className="flex items-center text-sm text-yellow-500 mt-1">
                    <Star className="mr-1 h-4 w-4 fill-current" />
                    <span className="font-bold">{MOCK_LISTING.seller.rating}</span>
                    <span className="mx-1 text-neutral-600">•</span>
                    <span className="text-neutral-400">Üyelik: {MOCK_LISTING.seller.memberSince}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-lg font-black text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  <Phone className="h-5 w-5" />
                  NUMARAYI GÖSTER
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent py-4 font-bold text-white transition-all hover:bg-white/5">
                  <MessageSquare className="h-5 w-5" />
                  Mesaj Gönder
                </button>
              </div>

              {/* Safety Note */}
              <div className="flex gap-3 rounded-lg border border-white/5 bg-white/5 p-4 text-xs text-neutral-400">
                <Shield className="h-5 w-5 shrink-0 text-neutral-500" />
                <p>
                  Güvenli alışveriş için ödeme yapmadan önce makineyi yerinde görmenizi tavsiye ederiz.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Similar Listings Section */}
        <div className="mt-20 border-t border-white/5 pt-10">
          <h2 className="mb-6 text-2xl font-bold text-white">Bunlar da İlginizi Çekebilir</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SIMILAR_LISTINGS.map((item) => (
              <Link key={item.id} href={`/ilan/${item.id}`} className="group block">
                <div className="overflow-hidden rounded-xl border border-white/5 bg-[#0F0F0F] transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl">
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="mb-1 truncate text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mb-2 text-xl font-extrabold text-primary">
                      {item.price}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for icon
function Construction(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
