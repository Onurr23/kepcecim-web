"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, BellRing, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming a standard utils file exists, otherwise I'll fallback to inline or simple join
// If cn doesn't exist I will define a small utility or remove usage if not critical. 
// Given the dependencies 'clsx' and 'tailwind-merge' are in package.json, it's highly likely "@/lib/utils" or similar exists with 'cn'.
// I'll check existence of lib/utils lightly or just implement a safe version locally if preferred. 
// Actually, I'll take a safe bet and implement a simple class merger inside or just use template literals if I can't confirm.
// But to be "Senior", I should expect the standard shadcn-like structure which likely has lib/utils.
// Let's assume standard usage but if it fails I'll correct. To be safe I will check for lib/utils first.

type TriggerType = "call" | "message" | "favorite" | "gallery";

interface AppGuardProps {
    children: React.ReactNode;
    trigger: TriggerType;
    productImage?: string;
}

const contentMap = {
    call: {
        icon: ShieldCheck,
        title: "Güvenli İletişim",
        text: "Satıcılarla güvenli görüşmek ve spamden korunmak için uygulamayı kullanın. Numarayı sadece uygulamada gösteriyoruz.",
        buttonText: "Uygulamada Ara / Mesaj At",
    },
    message: {
        icon: ShieldCheck,
        title: "Güvenli İletişim",
        text: "Satıcılarla güvenli görüşmek ve spamden korunmak için uygulamayı kullanın. Numarayı sadece uygulamada gösteriyoruz.",
        buttonText: "Uygulamada Ara / Mesaj At",
    },
    favorite: {
        icon: BellRing,
        title: "Fiyatı Düşünce Haber Verelim",
        text: "Bu ilanı favorilerine ekle, fiyatı düştüğünde veya satıldığında anında cebine bildirim gelsin.",
        buttonText: "Uygulamada Takip Et",
    },
    gallery: {
        icon: ZoomIn,
        title: "En İnce Detayı Gör",
        text: "Yüksek çözünürlüklü fotoğraflar ve 360° inceleme modu sadece uygulamada.",
        buttonText: "Uygulamada İncele",
    },
};

export default function AppGuard({ children, trigger, productImage, className }: AppGuardProps & { className?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const content = contentMap[trigger];
    const Icon = content.icon;

    const handleClick = (e: React.MouseEvent) => {
        // Intercept the click
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
    };

    return (
        <>
            <div onClickCapture={handleClick} className={cn("cursor-pointer", className)} role="button" tabIndex={0}>
                {children}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-2xl md:max-w-2xl"
                        >
                            {/* Optional Background Image Blur */}
                            {productImage && (
                                <div className="absolute inset-0 z-0 h-32 w-full opacity-20 md:h-full">
                                    {/* Using an img tag or Next Image if available. Using simple img for portability in this snippet */}
                                    <img src={productImage} alt="" className="h-full w-full object-cover blur-md" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/0 via-[#121212]/80 to-[#121212] md:bg-gradient-to-r md:from-[#121212]/50 md:to-[#121212]" />
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10 flex flex-col p-6 pt-10 text-center md:flex-row md:gap-8 md:p-8 md:text-left">

                                {/* Left Column (Content) */}
                                <div className="flex flex-col items-center md:items-start md:flex-1">
                                    {/* Visuals: Subtle Orange Glow & Icon */}
                                    <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 ring-1 ring-orange-500/20">
                                        <div className="absolute inset-0 rounded-full bg-orange-600 blur-2xl opacity-20"></div>
                                        <Icon className="h-10 w-10 text-orange-500" strokeWidth={1.5} />
                                    </div>

                                    <h3 className="mb-3 text-xl font-bold text-white md:text-2xl">
                                        {content.title}
                                    </h3>

                                    <p className="mb-8 text-sm leading-relaxed text-gray-400 md:text-base">
                                        {content.text}
                                    </p>

                                    {/* Mobile Only: Main Action Button */}
                                    <button
                                        onClick={() => {
                                            // Mobile generic action
                                        }}
                                        className="w-full rounded-xl bg-orange-600 py-3.5 text-base font-semibold text-white transition-all hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/20 active:scale-95 md:hidden"
                                    >
                                        {content.buttonText}
                                    </button>

                                    {/* Mobile Only: Store Badges */}
                                    <div className="mt-6 flex w-full items-center justify-center gap-3 md:hidden">
                                        <StoreButton platform="ios" />
                                        <StoreButton platform="android" />
                                    </div>
                                </div>

                                {/* Desktop Only: Right Column (QR Code) */}
                                <div className="hidden flex-col items-center justify-center md:flex md:w-64 md:shrink-0">
                                    <div className="flex flex-col items-center gap-3 rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
                                        <div className="bg-white p-2 rounded-lg">
                                            <img
                                                src="/images/kepcecim-qr.png"
                                                alt="Uygulamayı İndirmek için Taratın"
                                                className="w-40 h-40 object-contain"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium text-center">
                                            Telefonunuzun kamerasıyla okutun.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

// Helper Internal Components for Store Buttons
function StoreButton({ platform }: { platform: 'ios' | 'android' }) {
    const isIOS = platform === 'ios';
    return (
        <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10 px-2">
            {isIOS ? (
                // Simple Apple Icon SVG
                <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.5.87 3.29.87.78 0 2.26-1.07 3.93-.91 1.32.09 2.38.57 3.12 1.58-2.73 1.57-2.31 5.34.69 7.07zm-4.61-12.2c.71-1.02 1.23-2.49.92-3.8 1.27.08 2.53.86 3.09 2.14-1.29.98-2.88 1.94-4.01 1.66z" /></svg>
            ) : (
                // Simple Play Store Icon SVG
                <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,4.25L17.41,7.13L15.39,9.15L14.54,11.15L6.05,2.66L20.3,10.88C20.71,11.13 20.71,11.75 20.3,12L17.41,9.15M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
            )}
            <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] text-gray-400 uppercase font-medium">{isIOS ? 'Download on' : 'Get it on'}</span>
                <span className="text-[10px] font-bold text-gray-200">{isIOS ? 'App Store' : 'Google Play'}</span>
            </div>
        </button>
    )
}
