"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AppStoreQR } from "@/components/AppStoreQR";
import OpenAppModalTrigger from "@/components/OpenAppModalTrigger";
import { APP_OUT_UNIFIED_PATH } from "@/constants/appStore";

export default function LandingPage() {
    return (
        <main className="bg-neutral-950 min-h-screen text-white overflow-x-hidden selection:bg-orange-600 selection:text-white">

            {/* 1. HERO SECTION (The Hook) */}
            <section className="relative w-full pt-12 pb-20 md:pt-32 md:pb-32 overflow-hidden">

                {/* Background Mesh/Grid */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="md:w-1/2 flex flex-col items-start text-left"
                        >
                            {/* Headline */}
                            <h1 className="font-oswald font-extrabold text-5xl md:text-7xl lg:text-8xl leading-none text-white tracking-tight mb-4">
                                TİCARETİN <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                                    RENGİ DEĞİŞİYOR.
                                </span>
                            </h1>

                            {/* Subtext */}
                            <p className="text-lg md:text-xl text-neutral-400 max-w-lg leading-relaxed font-roboto">
                                Binlerce iş makinesi, yedek parça ve ataşman cebinizde. Komisyon yok, aracı yok, hız var.
                            </p>

                            {/* CTA Buttons & Social Proof */}
                            <div className="mt-6 w-full">
                                {/* Mobil: tek CTA → /out/app (platforma göre mağaza) */}
                                <div className="flex w-full md:hidden">
                                    <a
                                        href={APP_OUT_UNIFIED_PATH}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:bg-orange-500 active:scale-[0.98]"
                                    >
                                        Uygulamayı İndir
                                    </a>
                                </div>
                                {/* Masaüstü: birleşik QR */}
                                <div className="hidden md:flex flex-col items-start gap-4">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                                        <AppStoreQR
                                            unified
                                            size={140}
                                            showLabels
                                            labelClassName="text-neutral-400"
                                            variant="card"
                                        />
                                    </div>
                                   
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content (Phone Mockup) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="md:w-1/2 relative flex justify-center md:justify-end"
                        >
                            <div className="relative w-[300px] h-[600px] md:w-[380px] md:h-[760px] flex justify-center items-center">
                                {/* Crucial: Orange Blob Behind Phone */}
                                <div className="absolute w-[150%] h-[150%] bg-orange-600 blur-[120px] rounded-full pointer-events-none opacity-15" />

                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                    className="relative w-full h-full z-10"
                                >
                                    <Image
                                        src="/images/lp-hero-mockup.png"
                                        alt="Kepçecim Home Screen"
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. SOCIAL PROOF STRIP */}
            <div className="w-full bg-neutral-900/50 border-y border-white/10 backdrop-blur-sm py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center md:justify-around items-center gap-8 md:gap-12">
                        {[
                            { label: "İl", value: "81" },
                            { label: "Komisyon", value: "Sıfır" },
                            { label: "Ticaret", value: "Milyonlarca TL" }
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center text-center">
                                <span className="text-3xl md:text-4xl font-oswald font-bold text-white mb-1">
                                    {stat.value}
                                </span>
                                <span className="text-neutral-500 text-sm font-medium tracking-wider uppercase">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. FEATURE SHOWCASE (Zig-Zag) */}
            <section className="container mx-auto px-4 py-24 md:py-32 space-y-24 md:space-y-36">

                {/* Feature 1: Expert Filtering */}
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                    {/* Image (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="md:w-1/2 relative flex justify-center order-2 md:order-1"
                    >
                        <div className="relative w-[300px] h-[600px] md:w-[380px] md:h-[760px] flex justify-center items-center">
                            {/* Ambient Glow */}
                            <div className="absolute w-[150%] h-[150%] bg-orange-600 blur-[120px] rounded-full pointer-events-none opacity-15" />
                            <Image
                                src="/images/lp-filter-mockup.png"
                                alt="Expert Filtering"
                                fill
                                className="object-contain drop-shadow-2xl z-10"
                            />
                        </div>
                    </motion.div>

                    {/* Text (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="md:w-1/2 space-y-6 order-1 md:order-2"
                    >
                        <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                            Samanlıkta <br />
                            <span className="text-orange-500">İğne Aramayın.</span>
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-md leading-relaxed">
                            Marka, model, tonaj, bom tipi... İhtiyacınız olan makineyi teknik özelliklerine göre saniyeler içinde bulun.
                        </p>
                    </motion.div>
                </div>

                {/* Feature 2: Map & Logistics */}
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                    {/* Text (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="md:w-1/2 space-y-6 order-1"
                    >
                        <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                            Yakınında Bul, <br />
                            <span className="text-orange-500">Nakliyeden Kazan.</span>
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-md leading-relaxed">
                            Harita üzerinden ilanları görüntüleyin. Size en yakın makineyi bulun, lojistik maliyetlerini yarıya indirin.
                        </p>
                    </motion.div>

                    {/* Image (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="md:w-1/2 relative flex justify-center order-2"
                    >
                        <div className="relative w-[300px] h-[600px] md:w-[380px] md:h-[760px] flex justify-center items-center">
                            {/* Ambient Glow */}
                            <div className="absolute w-[150%] h-[150%] bg-orange-600 blur-[120px] rounded-full pointer-events-none opacity-15" />
                            <Image
                                src="/images/lp-map-mockup.png"
                                alt="Map Search"
                                fill
                                className="object-contain drop-shadow-2xl z-10"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Feature 3: Spare Parts Universe */}
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                    {/* Image (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="md:w-1/2 relative flex justify-center order-2 md:order-1"
                    >
                        <div className="relative w-[300px] h-[600px] md:w-[380px] md:h-[760px] flex justify-center items-center">
                            {/* Ambient Glow */}
                            <div className="absolute w-[150%] h-[150%] bg-orange-600 blur-[120px] rounded-full pointer-events-none opacity-15" />
                            <Image
                                src="/images/lp-category-mockup.png"
                                alt="Spare Parts Categories"
                                fill
                                className="object-contain drop-shadow-2xl z-10"
                            />
                        </div>
                    </motion.div>

                    {/* Text (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="md:w-1/2 space-y-6 order-1 md:order-2"
                    >
                        <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                            Parça Ararken <br />
                            <span className="text-orange-500">Kaybolmak Yok.</span>
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-md leading-relaxed">
                            Motor, hidrolik, yürüyüş takımı... Binlerce yedek parça, organize kategorilerle elinizin altında.
                        </p>
                    </motion.div>
                </div>

            </section>

            {/* 4. STORE/B2B CALL TO ACTION */}
            <section className="container mx-auto px-4 mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full rounded-2xl overflow-hidden py-24 px-4 md:py-32 md:px-20 text-center border border-white/5"
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="font-oswald font-bold text-3xl md:text-5xl text-white">
                            Galerici misiniz? Mağazanızı Dijitale Taşıyın.
                        </h2>
                        <p className="text-lg text-neutral-400">
                            Kurumsal üyelik ile sınırsız ilan, detaylı istatistikler ve marka bilinirliği.
                        </p>
                        <OpenAppModalTrigger triggerType="general">
                            <span className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-300 font-bold uppercase tracking-wider shadow-lg hover:shadow-orange-600/20">
                                Kurumsal Başvuru Yap
                                <ArrowRight size={20} />
                            </span>
                        </OpenAppModalTrigger>
                    </div>
                </motion.div>
            </section>

            {/* 5. FOOTER CTA - İndir */}
            <footer className="container mx-auto px-4 pb-24 text-center">
                <div className="max-w-2xl mx-auto space-y-14">

                    <div className="space-y-3">
                        <h2 className="font-oswald font-bold text-4xl md:text-6xl text-white leading-tight">
                            HEMEN İNDİRİN, <br />
                            <span className="text-orange-500">TİCARETE BAŞLAYIN.</span>
                        </h2>
                        <p className="text-neutral-400 text-base md:text-lg">
                            Aşağıdaki karekodu telefonunuzla tarayın; mobilde tek dokunuşla mağazaya gidin
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-10">

                        {/* QR + Store buttons (Desktop) */}
                        <div className="hidden md:block w-full">
                            <div className="inline-flex flex-col items-center gap-6 p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent shadow-2xl shadow-black/30">
                                <AppStoreQR
                                    unified
                                    size={180}
                                    showLabels
                                    labelClassName="text-neutral-500"
                                    variant="card"
                                />
                            
                            </div>
                        </div>

                        <div className="flex md:hidden flex-col items-center gap-4">
                            <a
                                href={APP_OUT_UNIFIED_PATH}
                                className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:bg-orange-500 active:scale-[0.98]"
                            >
                                Uygulamayı İndir
                            </a>
                            <span className="text-neutral-500 text-sm">iOS ve Android</span>
                        </div>
                    </div>
                </div>
            </footer>

        </main >
    );
}
