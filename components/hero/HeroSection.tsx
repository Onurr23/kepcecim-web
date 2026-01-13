"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import GlobalSearchInput from "@/components/ui/GlobalSearchInput";

const HERO_SCENES = [
  {
    id: 1,
    videoSrc: "/videos/hero-power.webm",
    headline: "GÜCÜ YÖNET.",
    subhead: "Türkiye'nin en büyük iş makinesi pazar yeri.",
  },
  {
    id: 2,
    videoSrc: "/videos/hero-power.webm",
    headline: "İŞİN GÜCÜ CEBİNDE.",
    subhead: "Al, sat, kirala. Operasyonun hızı artsın.",
  },
  {
    id: 3,
    videoSrc: "/videos/hero-power.webm",
    headline: "TİCARETİN RENGİ.",
    subhead: "Güvenli, şeffaf ve teknolojik altyapı.",
  },
];

const MARQUEE_ITEMS = [
  "KOMİSYONSUZ TİCARET",
  "ONAYLI SATICI SİSTEMİ",
  "5.000+ GÜNCEL İLAN",
  "81 İLDE GÜVENLİ ALIM SATIM",
  "DİREKT SATICIYA ULAŞ",
];

export default function HeroSection() {
  const [currentScene, setCurrentScene] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSceneData = HERO_SCENES[currentScene];

  // Auto-cycle through scenes every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % HERO_SCENES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Handle video play when scene changes
  useEffect(() => {
    if (videoRef.current && currentSceneData.videoSrc) {
      const video = videoRef.current;
      video.currentTime = 0;

      const handleCanPlay = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error("Video play failed:", error);
            }
          });
        }
      };

      if (video.readyState >= 3) {
        handleCanPlay();
      } else {
        video.addEventListener('canplay', handleCanPlay, { once: true });
        video.load();
      }

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [currentScene, currentSceneData.videoSrc]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Layer (Z-0) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-dark" />

        {currentSceneData.videoSrc && (
          <video
            ref={videoRef}
            key={currentSceneData.videoSrc}
            className="absolute inset-0 z-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Background video"
          >
            <source
              src={currentSceneData.videoSrc}
              type={currentSceneData.videoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
            />
          </video>
        )}

        <div className="absolute inset-0 z-[1] bg-black/60" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/50 to-black/30" />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Content Layer (Z-10) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneData.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <h1 className="font-extrabold tracking-tighter text-white drop-shadow-2xl text-6xl md:text-8xl">
              {currentSceneData.headline}
            </h1>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`subhead-${currentSceneData.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg font-medium text-gray-300 md:text-xl"
          >
            {currentSceneData.subhead}
          </motion.p>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-8 w-full px-4"
        >
          <GlobalSearchInput />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-10 flex flex-row items-center justify-center gap-4"
        >
          <button
            className={cn(
              "group flex items-center gap-3 rounded-lg border px-6 py-3",
              "bg-white/5 backdrop-blur-sm border-white/10 text-white",
              "transition-all duration-300",
              "hover:border-primary/50 hover:bg-primary/10 hover:scale-105",
            )}
            aria-label="Download on App Store"
          >
            <Image
              src="/apple.png"
              alt="App Store"
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
              unoptimized
            />
            <span className="font-medium">App Store</span>
          </button>

          <button
            className={cn(
              "group flex items-center gap-3 rounded-lg border px-6 py-3",
              "bg-white/5 backdrop-blur-sm border-white/10 text-white",
              "transition-all duration-300",
              "hover:border-primary/50 hover:bg-primary/10 hover:scale-105",
            )}
            aria-label="Get it on Google Play"
          >
            <Image
              src="/play_store.png"
              alt="Google Play"
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
              unoptimized
            />
            <span className="font-medium">Google Play</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-32 left-1/2 z-10 -translate-x-1/2 md:bottom-36"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-6 w-6 text-white/50" aria-hidden="true" />
        </motion.div>
      </motion.div>

      {/* Industrial Marquee (Z-20) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex h-16 items-center overflow-hidden border-y border-white/10 bg-black/50 backdrop-blur-md">
        <div className="flex w-full">
          <motion.div
            className="flex items-center whitespace-nowrap text-xl md:text-2xl font-bold uppercase tracking-wider text-white font-oswald"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate items for seamless loop */}
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center">
                <span className="px-12 md:px-32">{item}</span>
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
