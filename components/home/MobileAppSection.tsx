"use client";

import Image from "next/image";
import { Link2 } from "lucide-react";
import { AppStoreQR } from "@/components/AppStoreQR";
import { APP_OUT_UNIFIED_PATH } from "@/constants/appStore";

export default function MobileAppSection() {
    return (
        <section className="relative overflow-hidden border-y border-white/5 bg-black py-24 sm:py-32">
            {/* Background Glows */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-x-16">

                    {/* Content */}
                    <div className="lg:pr-8 lg:pt-4">
                        <div className="flex items-center gap-x-3 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-semibold leading-6 text-orange-500 w-fit mb-6 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                            <span className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                Yayında
                            </span>
                            <div className="h-4 w-px bg-orange-500/20" />
                            <span className="inline-flex items-center gap-1">
                                Şimdi İndir <Link2 className="h-3 w-3" />
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6">
                            İşin Gücü <span className="text-orange-500">Cebinde.</span>
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-400 mb-10">
                            Kepçecim mobil uygulaması ile iş makineleri dünyası artık parmaklarının ucunda.
                            İlanları incele, satıcılarla mesajlaş ve fırsatları anında yakala.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 border-t border-white/10 pt-10">
                            <div className="hidden md:flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <AppStoreQR
                                    unified
                                    size={88}
                                    showLabels={false}
                                    className="shrink-0"
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs text-orange-500 font-bold tracking-wider uppercase mb-1">
                                        Telefondan tara
                                    </span>
                                    <span className="text-sm text-gray-400 leading-snug max-w-[180px]">
                                        Karekod cihazınıza uygun mağazaya yönlendirir
                                    </span>
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:w-auto md:hidden">
                                <a
                                    href={APP_OUT_UNIFIED_PATH}
                                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-orange-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-600/25 transition-colors hover:bg-orange-500 active:scale-[0.98]"
                                >
                                    Uygulamayı İndir
                                </a>
                                <p className="text-xs text-gray-500">
                                    Tek dokunuşla iOS veya Android mağazasına gidersiniz.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Phone Mockup */}
                    <div className="relative mt-8 lg:mt-0 flex justify-center lg:justify-end">
                        {/* Circle Background behind phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-neutral-800/50 rounded-full blur-3xl -z-10"></div>

                        <div className="relative">
                            <div className="relative w-[280px] sm:w-[320px] h-[580px] sm:h-[650px] bg-black border-[8px] border-neutral-800 rounded-[3rem] shadow-2xl overflow-hidden">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-neutral-800 rounded-b-xl z-20"></div>

                                {/* Screen Content Placeholder */}
                                <div className="relative w-full h-full bg-neutral-900 flex flex-col">
                                    {/* Fake Header */}
                                    <div className="h-20 bg-black/50 w-full flex items-end p-4 border-b border-white/5">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
                                    </div>

                                    {/* Fake Content */}
                                    <div className="p-4 space-y-4">
                                        <div className="h-40 bg-white/5 rounded-xl w-full animate-pulse"></div>
                                        <div className="flex gap-4">
                                            <div className="h-32 bg-white/5 rounded-xl w-1/2"></div>
                                            <div className="h-32 bg-white/5 rounded-xl w-1/2"></div>
                                        </div>
                                        <div className="h-24 bg-white/5 rounded-xl w-full"></div>
                                    </div>

                                    {/* Image if available */}
                                    <Image
                                        src="/images/app-screen-mockup.png" // User might need to provide this
                                        alt="App Interface"
                                        fill
                                        className="object-cover opacity-80"
                                        onError={(e) => {
                                            // Fallback handled by CSS placeholders above if image fails/missing
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>

                                    <div className="absolute bottom-10 left-0 right-0 p-6 text-center z-20">
                                        <h3 className="text-xl font-bold text-white mb-2">Tüm İş Makineleri</h3>
                                        <p className="text-sm text-gray-400">Tek uygulamada, en iyi fiyata.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badges */}
                            <div className="absolute top-1/4 -left-12 bg-neutral-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl hidden sm:block animate-bounce duration-[3000ms]">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Ortalama Yanıt</p>
                                        <p className="text-sm font-bold text-white">15 Dakika</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-1/4 -right-12 bg-neutral-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl hidden sm:block animate-bounce duration-[4000ms]">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Hızlı & Güvenli</p>
                                        <p className="text-sm font-bold text-white">Onaylı Satıcılar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
