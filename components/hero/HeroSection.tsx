"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import GlobalSearchInput from "@/components/ui/GlobalSearchInput";

export default function HeroSection() {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background Layer (Z-0) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-neutral-950" />

        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/lp-hero-mockup.png"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero-power.webm" type="video/webm" />
        </video>

        {/* Cinematic Gradient Overlay (The 'Vignette' Effect) */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/40 to-neutral-950/90" />
      </div>

      {/* Content Layer (Z-10) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-extrabold tracking-tighter text-white drop-shadow-2xl text-6xl md:text-7xl max-w-5xl mx-auto leading-[1.1] uppercase">
            İŞİNİN GÜCÜ BURADA.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-6 mb-12 max-w-3xl text-lg font-medium text-gray-100 md:text-xl"
        >
          Binlerce iş makinesi, yedek parça ve ataşman tek platformda. Güvenle al, hızla sat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-10 w-full px-4"
        >
          <GlobalSearchInput />
        </motion.div>
      </div>
    </section>
  );
}
