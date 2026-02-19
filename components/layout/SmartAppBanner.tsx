"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_STORE_URL_IOS, APP_STORE_URL_ANDROID } from "@/constants/appStore";

export default function SmartAppBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [storeUrl, setStoreUrl] = useState<string>("");

    useEffect(() => {
        // 1. Check if previously closed
        const isClosed = localStorage.getItem("kepcecim_banner_closed");
        if (isClosed === "true") return;

        // 2. OS Detection
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        const FALLBACK_URL = APP_STORE_URL_ANDROID;

        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            setStoreUrl(APP_STORE_URL_IOS);
        } else if (/android/i.test(userAgent)) {
            setStoreUrl(APP_STORE_URL_ANDROID);
        } else {
            // If detection fails or desktop (though hidden via CSS), set fallback
            setStoreUrl(FALLBACK_URL);
        }

        // 3. Show banner
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem("kepcecim_banner_closed", "true");
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Spacer to push content down - only visible on mobile when banner is active */}
            <div className="h-[72px] w-full md:hidden" aria-hidden="true" />

            {/* Smart Banner */}
            <div
                className={cn(
                    "fixed top-0 left-0 right-0 z-[100] md:hidden",
                    "h-[72px] w-full",
                    "bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-white/5",
                    "flex items-center justify-between px-3 py-2",
                    "animate-in slide-in-from-top duration-500"
                )}
            >
                {/* Left: Close + Icon + Text */}
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Kapat"
                    >
                        <X size={18} />
                    </button>

                    {/* App Icon */}
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm border border-white/10">
                        {/* Use a placeholder image or the logo if available. 
                    Using a generic placeholder gradient for now if no app icon asset exists. 
                    Better: Use the existing brand logo if appropriate, or a colorful generic block.
                */}
                        <Image
                            src="/icon.png"
                            alt="Kepçecim App"
                            width={48}
                            height={48}
                            className="object-cover h-full w-full"
                            onError={(e) => {
                                // Fallback using css if image fails
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.style.backgroundColor = '#f97316'; // Brand orange
                            }}
                        />
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col justify-center min-w-0">
                        <h3 className="text-white font-bold text-sm leading-tight truncate">Kepçecim</h3>
                        <p className="text-white/70 text-xs truncate">İş Makinesi Pazaryeri</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] text-orange-500 font-medium">★★★★★</span>
                            <span className="text-[10px] text-white/50">ÜCRETSİZ</span>
                        </div>
                    </div>
                </div>

                {/* Right: Action Button */}
                <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "flex-shrink-0 ml-2",
                        "bg-orange-600 hover:bg-orange-500 active:bg-orange-700",
                        "text-white text-xs font-bold",
                        "px-4 py-1.5 rounded-full",
                        "transition-all duration-200 shadow-lg shadow-orange-900/20"
                    )}
                >
                    YÜKLE
                </a>
            </div>
        </>
    );
}
