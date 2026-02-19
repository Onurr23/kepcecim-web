"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Brand {
    id: string;
    name: string;
}

interface SeoLinksSectionProps {
    brands: Brand[];
}

type ListingTab = "satilik" | "kiralik";

function buildListingsUrl(
    tab: ListingTab,
    params?: {
        kategori?: string;
        marka?: string;
        model?: string;
        sehir?: string;
        alt_tip?: string;
        sinif?: string;
    }
): string {
    const path = `/ilanlar/${tab}`;
    if (!params) return path;
    const search = new URLSearchParams();
    if (params.kategori) search.set("kategori", params.kategori);
    if (params.marka) search.set("marka", params.marka);
    if (params.model) search.set("model", params.model);
    if (params.sehir) search.set("sehir", params.sehir);
    if (params.alt_tip) search.set("alt_tip", params.alt_tip);
    if (params.sinif) search.set("sinif", params.sinif);
    const qs = search.toString();
    return qs ? `${path}?${qs}` : path;
}

const SEO_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
    {
        title: "VİTRİN",
        links: [
            { label: "Sahibinden Kepçe", href: buildListingsUrl("satilik", { kategori: "bekoloder" }) },
            { label: "Satılık Ekskavatör", href: buildListingsUrl("satilik", { kategori: "ekskavator" }) },
            { label: "Kiralık Vinç", href: buildListingsUrl("kiralik", { kategori: "mobil-vinc" }) },
            { label: "Kiralık Forklift", href: buildListingsUrl("kiralik", { kategori: "forklift" }) },
            { label: "Kiralık Vinç", href: buildListingsUrl("kiralik", { kategori: "mobil-vinc" }) },
            { label: "Traktör Kepçe", href: buildListingsUrl("satilik", { kategori: "bekoloder" }) },
            { label: "Mini Ekskavatör", href: buildListingsUrl("satilik", { kategori: "ekskavator", sinif: "Mini" }) },
        ],
    },
    {
        title: "MARKA & MODEL",
        links: [
            { label: "JCB 3CX Satılık", href: buildListingsUrl("satilik", { marka: "jcb", model: "3CX" }) },
            { label: "Cat 444", href: buildListingsUrl("satilik", { marka: "caterpillar", model: "444" }) },
            { label: "Hidromek 102B", href: buildListingsUrl("satilik", { marka: "hidromek", model: "102B" }) },
            { label: "Cat 320D", href: buildListingsUrl("satilik", { marka: "caterpillar", model: "320D" }) },
            { label: "Asimato Forklift", href: buildListingsUrl("satilik", { marka: "asimato", kategori: "forklift" }) },
            { label: "Volvo Lastikli Yükleyici", href: buildListingsUrl("satilik", { kategori: "loder-yukleyici", marka: "volvo", alt_tip: "Lastikli" }) },
            { label: "Sumitomo Ekskavatör", href: buildListingsUrl("satilik", { kategori: "ekskavator", marka: "sumitomo" }) },
        ],
    },
    {
        title: "ŞEHİR & HİZMET",
        links: [
            { label: "İstanbul Kiralık Forklift", href: buildListingsUrl("kiralik", { sehir: "İstanbul", kategori: "forklift" }) },
            { label: "Kocaeli Vinç Kiralama", href: buildListingsUrl("kiralik", { sehir: "Kocaeli", kategori: "mobil-vinc" }) },
            { label: "Hatay Satılık Ekskavatör", href: buildListingsUrl("satilik", { sehir: "Hatay", kategori: "ekskavator" }) },
            { label: "Tekirdağ İş Makineleri", href: buildListingsUrl("satilik", { sehir: "Tekirdağ" }) },
            { label: "Malatya Kiralık Kepçe", href: buildListingsUrl("kiralik", { sehir: "Malatya", kategori: "bekoloder" }) },
            { label: "Bilecik Kiralık Kepçe", href: buildListingsUrl("kiralik", { sehir: "Bilecik", kategori: "bekoloder" }) },
            { label: "Ankara Beko Loder", href: buildListingsUrl("satilik", { sehir: "Ankara", kategori: "bekoloder" }) },
        ],
    },
    {
        title: "FIRSATLAR",
        links: [
            { label: "2. El İş Makinesi", href: buildListingsUrl("satilik") },
            { label: "Cisibi Kepçe Fiyatları", href: buildListingsUrl("satilik", { marka: "jcb", kategori: "bekoloder" }) },
            { label: "Sahibinden JCB", href: buildListingsUrl("satilik", { marka: "jcb" }) },
            { label: "Telehandler (Manitou)", href: buildListingsUrl("satilik", { kategori: "telehandler-teleskobik-yukleyici", marka: "manitou" }) },
            { label: "Elektrikli Forklift", href: buildListingsUrl("satilik", { kategori: "forklift", alt_tip: "Elektrikli" }) },
            { label: "9 Tonluk Ekskavatör", href: buildListingsUrl("satilik", { kategori: "ekskavator" }) },
            { label: "Acil Satılık Makine", href: buildListingsUrl("satilik") },
        ],
    },
];

export default function SeoLinksSection({ brands }: SeoLinksSectionProps) {
    const seoLinks = SEO_LINKS;

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
                                            <div className="flex items-center gap-2">
                                                <ArrowRight className="w-3 h-3 text-white/20" />
                                                <span>{link.label}</span>
                                            </div>
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
