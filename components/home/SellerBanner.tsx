"use client";

import { useState } from "react";
import { ArrowRight, CalendarClock, Settings, Store, Tractor, Wrench } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AppRedirectOverlay from "@/components/ui/AppRedirectOverlay";

export default function SellerBanner() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    return (
        <section className="w-full bg-neutral-900 border-t border-white/10">

            {/* 1. TOP BANNER: SELLER FOCUSED (B2B) */}
            <div className="relative w-full overflow-hidden py-16 md:py-24">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                        backgroundSize: '10px 10px'
                    }}
                />

                {/* Left Machinery Image (Desktop Only) */}
                <div className="absolute left-0 bottom-0 h-[120%] w-[600px] z-10 hidden lg:block pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-20" />
                    <img
                        src="/excavator_transparent.png"
                        alt="Excavator"
                        className="w-full h-full object-contain object-bottom transform -scale-x-100 translate-y-20 -translate-x-10 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                    />
                </div>

                {/* Right Machinery Image (Desktop Only) */}
                <div className="absolute right-0 bottom-0 h-[120%] w-[600px] z-10 hidden lg:block pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-20" />
                    <img
                        src="/loader.png"
                        alt="Construction Machine"
                        className="w-full h-full object-contain object-bottom translate-y-10 translate-x-10 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                    />
                </div>

                <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center mx-auto max-w-4xl">
                        <div className="mb-6 flex items-center justify-center gap-2 text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20 backdrop-blur-sm">
                            <Store className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Kurumsal ve Bireysel Satış</span>
                        </div>

                        <h2 className="text-4xl font-extrabold uppercase tracking-tighter text-white md:text-6xl mb-8">
                            MAKİNENİ <span className="text-orange-500">DEĞERİNDE</span> SAT.
                        </h2>

                        <p className="max-w-2xl text-lg md:text-xl text-gray-300 mb-12 leading-relaxed">
                            Türkiye'nin en aktif pazar yerinde ücretsiz ilanını ver, binlerce potansiyel alıcıya anında ulaş.
                        </p>

                        <button
                            onClick={() => setIsOverlayOpen(true)}
                            className={cn(
                                "group flex items-center gap-4 rounded-xl px-10 py-5",
                                "bg-white text-black text-lg font-black tracking-wide",
                                "transition-all duration-300 transform",
                                "hover:scale-105 hover:bg-white",
                                "hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] shadow-xl shadow-white/5"
                            )}
                        >
                            <span>ÜCRETSİZ İLAN VER</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. BOTTOM GRID: BUYER FOCUSED */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 pt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: SATILIK */}
                    <Link href="/ilanlar/satilik" className="group">
                        <div className="h-full bg-neutral-900/50 border border-white/10 hover:border-orange-500/50 rounded-2xl p-8 transition-all duration-300 hover:bg-white/5 hover:shadow-2xl hover:shadow-orange-900/10 flex flex-col items-start gap-4">
                            <div className="p-3 bg-neutral-800 rounded-xl group-hover:bg-orange-500/10 transition-colors">
                                <Tractor className="h-12 w-12 text-gray-400 group-hover:text-orange-500 transition-colors stroke-1.5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">SATILIK İŞ MAKİNELERİ</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                                    Ekskavatörden forkliftlere, binlerce satılık makineyi inceleyin.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                                    İlanlara Git <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 2: KİRALIK */}
                    <Link href="/ilanlar/kiralik" className="group">
                        <div className="h-full bg-neutral-900/50 border border-white/10 hover:border-orange-500/50 rounded-2xl p-8 transition-all duration-300 hover:bg-white/5 hover:shadow-2xl hover:shadow-orange-900/10 flex flex-col items-start gap-4">
                            <div className="p-3 bg-neutral-800 rounded-xl group-hover:bg-orange-500/10 transition-colors">
                                <CalendarClock className="h-12 w-12 text-gray-400 group-hover:text-orange-500 transition-colors stroke-1.5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">KİRALIK ÇÖZÜMLER</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                                    Dönemsel ihtiyaçlarınız için en uygun kiralık makineleri bulun.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                                    Kiralık Ara <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3: YEDEK PARÇA */}
                    <Link href="/ilanlar/yedek-parca" className="group">
                        <div className="h-full bg-neutral-900/50 border border-white/10 hover:border-orange-500/50 rounded-2xl p-8 transition-all duration-300 hover:bg-white/5 hover:shadow-2xl hover:shadow-orange-900/10 flex flex-col items-start gap-4">
                            <div className="p-3 bg-neutral-800 rounded-xl group-hover:bg-orange-500/10 transition-colors">
                                <Wrench className="h-12 w-12 text-gray-400 group-hover:text-orange-500 transition-colors stroke-1.5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">YEDEK PARÇA & ATAŞMAN</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                                    Makineniz durmasın. Orijinal ve yan sanayi yedek parçalara ulaşın.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                                    Parça Bul <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <AppRedirectOverlay
                isOpen={isOverlayOpen}
                onClose={() => setIsOverlayOpen(false)}
                triggerType="general"
            />
        </section>
    );
}
