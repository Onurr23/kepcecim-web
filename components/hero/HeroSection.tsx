"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const HERO_SCENES = [
  {
    id: 1,
    videoSrc: "/videos/hero-power.webm",
    headline: "GÜCÜ YÖNET.",
    subhead: "Türkiye'nin en büyük iş makinesi pazar yeri.",
  },
  {
    id: 2,
    videoSrc: "/videos/hero-power.webm", // Video dosyası eklendiğinde path buraya eklenecek
    headline: "İŞİN GÜCÜ CEBİNDE.",
    subhead: "Al, sat, kirala. Operasyonun hızı artsın.",
  },
  {
    id: 3,
    videoSrc: "/videos/hero-power.webm", // Video dosyası eklendiğinde path buraya eklenecek
    headline: "TİCARETİN RENGİ.",
    subhead: "Güvenli, şeffaf ve teknolojik altyapı.",
  },
];

const MARQUEE_TEXT = " • KOMİSYONSUZ TİCARET • 81 İLDE GÜVENLİ ALIM SATIM • CEPTEKİ ŞANTİYE • 5000+ İŞ MAKİNESİ ";

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
      
      // Reset video to beginning
      video.currentTime = 0;
      
      // Only play if video is ready
      const handleCanPlay = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Ignore interruption errors (power saving, tab switching, etc.)
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error("Video play failed:", error);
            }
          });
        }
      };

      if (video.readyState >= 3) {
        // Video is already loaded, play immediately
        handleCanPlay();
      } else {
        // Wait for video to be ready
        video.addEventListener('canplay', handleCanPlay, { once: true });
        video.load(); // Force reload
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
        {/* Fallback background */}
        <div className="absolute inset-0 bg-dark" />
        
        {/* Video Container - only render if videoSrc exists */}
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
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch((error) => {
                  // Ignore interruption errors (power saving, tab switching, etc.)
                  if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                    console.error("Video autoplay failed:", error);
                  }
                });
              }
            }}
            onError={(e) => {
              const target = e.target as HTMLVideoElement;
              console.error("Video load error for:", currentSceneData.videoSrc);
              target.style.opacity = "0";
            }}
          >
            <source 
              src={currentSceneData.videoSrc} 
              type={currentSceneData.videoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'} 
            />
          </video>
        )}

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 z-[1] bg-black/60" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/50 to-black/30" />

        {/* Radial vignetting */}
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
            {/* Main Headline */}
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

        {/* Action Layer (CTAs) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-row items-center justify-center gap-4"
        >
          {/* App Store Button */}
          <button
            className={cn(
              "group flex items-center gap-3 rounded-lg border px-6 py-3",
              "bg-white/5 backdrop-blur-sm border-white/10 text-white",
              "transition-all duration-300",
              "hover:border-primary/50 hover:bg-primary/10 hover:scale-105",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
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

          {/* Google Play Button */}
          <button
            className={cn(
              "group flex items-center gap-3 rounded-lg border px-6 py-3",
              "bg-white/5 backdrop-blur-sm border-white/10 text-white",
              "transition-all duration-300",
              "hover:border-primary/50 hover:bg-primary/10 hover:scale-105",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
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
        className="absolute bottom-32 left-1/2 z-10 -translate-x-1/2 md:bottom-24"
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
      <div className="absolute bottom-0 left-0 right-0 z-20 flex h-16 items-center overflow-hidden border-y border-white/10 bg-black/50 backdrop-blur-md">
        <div className="flex w-full">
          <motion.div
            className="flex whitespace-nowrap text-2xl font-bold uppercase tracking-wider md:text-3xl"
            style={{
              WebkitTextStroke: "1px white",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              fontFamily: "monospace, 'Courier New', Courier, monospace",
            }}
            animate={{
              x: ["0%", "-33.333%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate text 3 times for seamless loop */}
            <span className="inline-block px-8">{MARQUEE_TEXT}</span>
            <span className="inline-block px-8">{MARQUEE_TEXT}</span>
            <span className="inline-block px-8">{MARQUEE_TEXT}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

