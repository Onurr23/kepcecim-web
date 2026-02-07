"use client";

import { ShieldCheck, MapPin, Users } from "lucide-react";

const TRUST_ITEMS = [
    {
        icon: ShieldCheck,
        text: "Güvenli Alışveriş",
    },
    {
        icon: MapPin,
        text: "81 İlde Hizmet",
    },
    {
        icon: Users,
        text: "5.000+ Kurumsal Üye",
    },
];

export default function TrustStrip() {
    return (
        <div className="w-full border-t border-white/10 bg-neutral-950/80 backdrop-blur-md py-4 md:py-6">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    {TRUST_ITEMS.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <span className="text-base md:text-lg font-medium text-white tracking-tight">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
