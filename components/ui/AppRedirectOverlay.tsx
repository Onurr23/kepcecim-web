"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, BellRing, MessageSquare, Phone, LucideIcon } from "lucide-react";
import Image from "next/image"; // For QR code and other images

// Use existing utils or simple fallback
import { cn } from "@/lib/utils";

// --- Types ---
export type TriggerType = 'contact' | 'favorite' | 'header' | 'general';

interface AppRedirectOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    triggerType: TriggerType;
}

// --- Content Configuration ---
interface ContentConfig {
    title: string;
    body: string;
    icon: LucideIcon | string; // LucideIcon or generic string identifier if needed
    buttonText?: string; // Fallback text for buttons if specific logic needed
}

const getContent = (type: TriggerType): ContentConfig => {
    switch (type) {
        case 'contact':
            return {
                title: "Satıcıyla Güvenli İletişim Kur",
                body: "İlan sahibiyle anlık mesajlaşmak, arama yapmak ve pazarlık sürecini yönetmek için uygulamayı kullanın.",
                icon: MessageSquare // or Phone, representing communication
            };
        case 'favorite':
            return {
                title: "İlanı Kaybetme!",
                body: "Bu makineyi favorilerine eklemek, fiyat düştüğünde bildirim almak için uygulamaya geçiş yap.",
                icon: BellRing // Heart would be better but using BellRing as per previous context or Heart if available
            };
        case 'header':
            return {
                title: "Kepçecim Cebine Gelsin",
                body: "Türkiye'nin en büyük iş makinesi pazar yeri her an elinin altında.",
                icon: "logo" // Special handling for logo
            };
        case 'general':
        default:
            return {
                title: "Uygulamayı İndir",
                body: "Daha iyi bir deneyim için Kepçecim mobil uygulamasını indirin.",
                icon: ShieldCheck
            };
    }
};


// --- Component ---

export default function AppRedirectOverlay({ isOpen, onClose, triggerType }: AppRedirectOverlayProps) {
    const content = getContent(triggerType);
    const [mounted, setMounted] = React.useState(false);
    const pathname = usePathname();

    // Auto-close on navigation
    useEffect(() => {
        if (isOpen) onClose();
    }, [pathname]); // Close whenever pathname changes

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    // Prevent scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm transition-opacity"
                    />

                    {/* Desktop Modal (md+) */}
                    <div className="fixed inset-0 z-[9999] hidden items-center justify-center p-4 md:flex pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-2xl border border-orange-500/30 bg-neutral-900/95 shadow-[0_0_50px_rgba(249,115,22,0.15)]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 z-20 rounded-full bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-row p-8 gap-8">
                                {/* Left: QR Code */}
                                <div className="flex w-64 shrink-0 flex-col items-center justify-center rounded-xl bg-white p-6">
                                    <div className="relative aspect-square w-full">
                                        {/* Placeholder for QR Code - typically you'd generate this or use a static image */}
                                        <Image
                                            src="/images/kepcecim-qr.png" // Ensure this image exists, or use a placeholder
                                            alt="QR Code"
                                            width={200}
                                            height={200}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <p className="mt-4 text-center text-sm font-bold text-neutral-900">
                                        TELEFONDAN TARA
                                    </p>
                                </div>

                                {/* Right: Content */}
                                <div className="flex flex-1 flex-col justify-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                        {content.icon === "logo" ? (
                                            <Image src="/logo-icon.png" width={32} height={32} alt="Logo" className="h-8 w-8 object-contain" />
                                        ) : (
                                            (() => {
                                                const Icon = content.icon as LucideIcon;
                                                return <Icon className="h-8 w-8 text-orange-500" />;
                                            })()
                                        )}
                                    </div>

                                    <h2 className="mb-3 text-2xl font-bold text-white">
                                        {content.title}
                                    </h2>
                                    <p className="mb-8 text-neutral-400 leading-relaxed">
                                        {content.body}
                                    </p>

                                    <div className="flex gap-3">
                                        <DesktopStoreButton platform="ios" />
                                        <DesktopStoreButton platform="android" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Mobile Bottom Sheet (< md) */}
                    <div className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col justify-end md:hidden pointer-events-none">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            drag="y"
                            dragConstraints={{ top: 0 }}
                            dragElastic={0.05}
                            onDragEnd={(e, { offset, velocity }) => {
                                if (offset.y > 100 || velocity.y > 100) {
                                    onClose();
                                }
                            }}
                            className="pointer-events-auto relative w-full rounded-t-3xl border-t border-white/10 bg-neutral-900 p-6 pb-safe pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                        >
                            {/* Pull Handle */}
                            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/20" />

                            {/* Close Button (Optional/Accessbility) */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 p-2 text-white/30"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                    {content.icon === "logo" ? (
                                        <Image src="/logo-icon.png" width={32} height={32} alt="Logo" className="h-8 w-8 object-contain" />
                                    ) : (
                                        (() => {
                                            const Icon = content.icon as LucideIcon;
                                            return <Icon className="h-8 w-8 text-orange-500" />;
                                        })()
                                    )}
                                </div>

                                <h2 className="mb-2 text-xl font-bold text-white">
                                    {content.title}
                                </h2>
                                <p className="mb-8 text-neutral-400 text-sm leading-relaxed px-4">
                                    {content.body}
                                </p>

                                <div className="grid w-full grid-cols-1 gap-3">
                                    <MobileStoreButton platform="ios" />
                                    <MobileStoreButton platform="android" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

// --- Helper Components ---

function DesktopStoreButton({ platform }: { platform: 'ios' | 'android' }) {
    const isIOS = platform === 'ios';
    return (
        <a
            href="#"
            className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 transition-colors hover:bg-white/10 hover:border-white/20"
        >
            {isIOS ? (
                <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.5.87 3.29.87.78 0 2.26-1.07 3.93-.91 1.32.09 2.38.57 3.12 1.58-2.73 1.57-2.31 5.34.69 7.07zm-4.61-12.2c.71-1.02 1.23-2.49.92-3.8 1.27.08 2.53.86 3.09 2.14-1.29.98-2.88 1.94-4.01 1.66z" /></svg>
            ) : (
                <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,4.25L17.41,7.13L15.39,9.15L14.54,11.15L6.05,2.66L20.3,10.88C20.71,11.13 20.71,11.75 20.3,12L17.41,9.15M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
            )}
            <div className="flex flex-col text-left leading-none">
                <span className="text-[10px] uppercase text-neutral-400 font-medium">{isIOS ? 'Download on the' : 'Get it on'}</span>
                <span className="text-sm font-bold text-white">{isIOS ? 'App Store' : 'Google Play'}</span>
            </div>
        </a>
    )
}

function MobileStoreButton({ platform }: { platform: 'ios' | 'android' }) {
    const isIOS = platform === 'ios';
    return (
        <a
            href="#"
            className="flex items-center justify-center gap-3 rounded-xl bg-orange-600 py-4 font-bold text-white transition-transform active:scale-95 shadow-lg shadow-orange-600/20"
        >
            {isIOS ? (
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.5.87 3.29.87.78 0 2.26-1.07 3.93-.91 1.32.09 2.38.57 3.12 1.58-2.73 1.57-2.31 5.34.69 7.07zm-4.61-12.2c.71-1.02 1.23-2.49.92-3.8 1.27.08 2.53.86 3.09 2.14-1.29.98-2.88 1.94-4.01 1.66z" /></svg>
            ) : (
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,4.25L17.41,7.13L15.39,9.15L14.54,11.15L6.05,2.66L20.3,10.88C20.71,11.13 20.71,11.75 20.3,12L17.41,9.15M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
            )}
            <span>{isIOS ? 'App Store’dan İndir' : 'Google Play’den İndir'}</span>
        </a>
    )
}
