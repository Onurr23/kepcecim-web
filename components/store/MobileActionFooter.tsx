"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function MobileActionFooter() {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setShow(false); // Hide on scroll down
                } else {
                    setShow(true);  // Show on scroll up
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0A0A0A]/90 backdrop-blur-lg px-4 py-3 transition-transform duration-300 lg:hidden",
            show ? "translate-y-0" : "translate-y-full"
        )}>
            <div className="flex gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 text-base font-bold text-black shadow-lg shadow-orange-900/20 active:scale-[0.98]">
                    <Phone className="h-5 w-5" />
                    <span>ARA</span>
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base font-bold text-white active:scale-[0.98]">
                    <MessageCircle className="h-5 w-5" />
                    <span>MESAJ</span>
                </button>
            </div>
        </div>
    );
}
