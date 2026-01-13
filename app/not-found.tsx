import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden selection:bg-orange-500/30">

            {/* 1. IMAGE PLACEMENT (The Stage) */}
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                <Image
                    src="/excavator.png"
                    alt="Construction Site Excavator"
                    fill
                    className="object-cover object-center"
                    priority
                />

                {/* 2. THE BLENDING TRICK (Gradient Overlay) */}
                {/* Starts transparent, fades to black at bottom to merge with page bg */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
            </div>

            {/* 3. TYPOGRAPHY & LAYOUT (The Overlay) */}
            {/* Negative margin pulls content up into the image area */}
            <div className="relative z-10 flex flex-col items-center justify-start -mt-32 md:-mt-48 px-4 w-full">

                {/* Watermark 404 - Positioned behind main text but over the gradient bottom */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 w-full flex justify-center">
                    <h1 className="text-[12rem] md:text-[20rem] font-oswald font-bold leading-none text-transparent tracking-tighter select-none opacity-20 transform -translate-y-12 md:-translate-y-24"
                        style={{ WebkitTextStroke: '2px rgba(255,255,255,0.05)' }}>
                        404
                    </h1>
                </div>

                {/* Main Content Container - Higher Z-Index */}
                <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 md:space-y-8">

                    {/* Headlines */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-6xl font-bold text-white tracking-tight uppercase drop-shadow-2xl">
                            ARADIĞINIZI KAZDIK <br className="hidden md:block" />
                            <span className="text-orange-500">AMA BULAMADIK</span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-medium drop-shadow-md">
                            Bu sayfa silinmiş veya yanlış bir şantiyedesiniz.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <Link
                            href="/"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all duration-300 bg-orange-500 rounded-full hover:bg-orange-400 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]"
                        >
                            <span className="mr-2">ANA SAYFAYA DÖN</span>
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={3} />
                        </Link>
                    </div>
                </div>

            </div>

            {/* Footer System Message */}
            <div className="absolute bottom-6 left-0 right-0 text-center z-10 mt-auto">
                <p className="text-[10px] md:text-xs text-neutral-600 font-mono tracking-widest uppercase">
                    Hata Kodu: 404_NOT_FOUND // Kepçecim System
                </p>
            </div>

        </div>
    );
}
