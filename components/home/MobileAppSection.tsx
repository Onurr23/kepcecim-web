"use client";

import Image from "next/image";
import { Link2 } from "lucide-react";

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
                            {/* QR Code */}
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <div className="bg-white p-2 rounded-lg shrink-0">
                                    <Image
                                        src="/images/kepcecim-qr.png"
                                        alt="App QR Code"
                                        width={80}
                                        height={80}
                                        className="h-20 w-20 object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-orange-500 font-bold tracking-wider uppercase mb-1">Telefondan Tara</span>
                                    <span className="text-sm text-gray-400 leading-snug max-w-[120px]">
                                        İndirmek için kameranızı kullanın
                                    </span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3">
                                <StoreButton platform="ios" />
                                <StoreButton platform="android" />
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

function StoreButton({ platform }: { platform: 'ios' | 'android' }) {
    const isIOS = platform === 'ios';
    return (
        <a
            href="#"
            className="flex w-44 items-center gap-3 rounded-xl border border-white/10 bg-white/5 py-2 px-3 transition-colors hover:bg-white/10 hover:border-white/20"
        >
            {isIOS ? (
                <svg className="h-6 w-6 fill-current text-white shrink-0" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.5.87 3.29.87.78 0 2.26-1.07 3.93-.91 1.32.09 2.38.57 3.12 1.58-2.73 1.57-2.31 5.34.69 7.07zm-4.61-12.2c.71-1.02 1.23-2.49.92-3.8 1.27.08 2.53.86 3.09 2.14-1.29.98-2.88 1.94-4.01 1.66z" /></svg>
            ) : (
                <svg className="h-6 w-6 fill-current text-white shrink-0" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,4.25L17.41,7.13L15.39,9.15L14.54,11.15L6.05,2.66L20.3,10.88C20.71,11.13 20.71,11.75 20.3,12L17.41,9.15M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
            )}
            <div className="flex flex-col text-left leading-none">
                <span className="text-[10px] uppercase text-neutral-400 font-medium">{isIOS ? 'Download on the' : 'Get it on'}</span>
                <span className="text-sm font-bold text-white">{isIOS ? 'App Store' : 'Google Play'}</span>
            </div>
        </a>
    )
}
