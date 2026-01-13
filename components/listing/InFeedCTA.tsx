"use client";

import { Bell, ArrowRight } from "lucide-react";

export default function InFeedCTA() {
    return (
        <div className="col-span-1 lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-8 sm:px-12 sm:py-10">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Abstract Shapes */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                    <div className="max-w-2xl">
                        <h2 className="mb-2 text-2xl font-bold font-oswald text-white sm:text-3xl">
                            Aradığın makine yok mu?
                        </h2>
                        <p className="text-orange-50 font-medium">
                            Kriterini kaydet, gelince bildirim atalım. İstediğin makineyi ilk sen gör.
                        </p>
                    </div>

                    <button className="whitespace-nowrap rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-orange-600 transition-all hover:bg-orange-50 hover:shadow-lg active:scale-95 flex items-center gap-2">
                        <Bell className="w-5 h-5 fill-current" />
                        Bildirim Oluştur (App)
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
