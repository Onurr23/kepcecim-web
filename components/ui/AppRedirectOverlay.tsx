"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, MessageSquare, LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AppStoreQR } from "@/components/AppStoreQR";
import { APP_OUT_UNIFIED_PATH } from "@/constants/appStore";

// --- Types ---
export type TriggerType = 'contact' | 'header' | 'general';

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

                    {/* Desktop Modal (md+) - theme compatible */}
                    <div className="fixed inset-0 z-[9999] hidden items-center justify-center p-4 md:flex pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-xl"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 z-20 rounded-full bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label="Kapat"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-row p-8 gap-8">
                                {/* Left: QR Codes - dark panel, theme consistent */}
                                <div className="flex w-64 shrink-0 flex-col items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 p-6">
                                    <AppStoreQR unified size={100} showLabels={false} variant="card" />
                                    <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Telefondan tara
                                    </p>
                                </div>

                                {/* Right: Content */}
                                <div className="flex flex-1 flex-col justify-center">
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                                        {content.icon === "logo" ? (
                                            <Image src="/icon-512x512.png" width={56} height={56} alt="Kepçecim" className="h-full w-full object-contain" />
                                        ) : (
                                            (() => {
                                                const Icon = content.icon as LucideIcon;
                                                return <Icon className="h-7 w-7 text-orange-500" />;
                                            })()
                                        )}
                                    </div>

                                    <h2 className="mb-3 text-xl font-bold text-white">
                                        {content.title}
                                    </h2>
                                    <p className="mb-6 text-sm text-neutral-400 leading-relaxed">
                                        {content.body}
                                    </p>
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
                            className="pointer-events-auto relative w-full rounded-t-3xl border-t border-white/10 bg-neutral-900 p-6 pb-safe pt-2 shadow-xl"
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
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                                    {content.icon === "logo" ? (
                                        <Image src="/icon-512x512.png" width={56} height={56} alt="Kepçecim" className="h-full w-full object-contain" />
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

                                <a
                                    href={APP_OUT_UNIFIED_PATH}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 font-bold text-white transition-transform active:scale-95 shadow-lg shadow-orange-600/20"
                                >
                                    Uygulamayı İndir
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

