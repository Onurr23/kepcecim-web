"use client";

import Link from "next/link";

interface Brand {
    id: string;
    name: string;
}

interface SeoLinksSectionProps {
    brands: Brand[];
}

const SEO_LINKS_BASE = [
    {
        title: "Popüler",
        links: [
            { label: "Satılık Ekskavatör", href: "/ilanlar/satilik-ekskavator" },
            { label: "Beko Loder Fiyatları", href: "/ilanlar/beko-loder" },
            { label: "Kiralık Vinç", href: "/ilanlar/kiralik-vinc" },
            { label: "Sahibinden Forklift", href: "/ilanlar/forklift" },
            { label: "Mini Yükleyici", href: "/ilanlar/mini-yukleyici" },
        ],
    },
    {
        title: "Şehirler",
        links: [
            { label: "Ankara İş Makinesi", href: "/sehir/ankara" },
            { label: "İstanbul Satılık Kepçe", href: "/sehir/istanbul" },
            { label: "İzmir Kiralık Vinç", href: "/sehir/izmir" },
            { label: "Bursa İş Makineleri", href: "/sehir/bursa" },
            { label: "Konya Galericiler", href: "/sehir/konya" },
        ],
    },
    {
        title: "Özel Aramalar",
        links: [
            { label: "2. El Makine Fiyatları", href: "/kategori/2-el-makine" },
            { label: "Acil Satılık Kepçeler", href: "/etiket/acil-satilik" },
            { label: "İş Makinesi Yedek Parça", href: "/kategori/yedek-parca" },
            { label: "Hidrolik Kırıcılar", href: "/kategori/hidrolik-kirici" },
        ],
    },
];

export default function SeoLinksSection({ brands }: SeoLinksSectionProps) {
    const brandLinks = {
        title: "Markalar",
        links: brands.map(brand => ({
            label: brand.name,
            href: `/ilanlar?brand=${brand.id}`
        }))
    };

    // Markaları 2. sıraya ekleyelim (özgün tasarımdaki gibi)
    const seoLinks = [
        SEO_LINKS_BASE[0],
        brandLinks,
        ...SEO_LINKS_BASE.slice(1)
    ];

    return (
        <section className="bg-[#0a0a0a] py-12 px-4 md:px-8 border-t border-white/5">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {seoLinks.map((column, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-4">
                            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
                                {column.title}
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors duration-200 block py-0.5"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

