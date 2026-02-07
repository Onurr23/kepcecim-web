"use client";

import { slugify } from "@/utils/slugify";
import Link from "next/link";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
}

interface BrandStripProps {
  brands: Brand[];
}

export default function BrandStrip({ brands }: BrandStripProps) {
  // If no brands or very few, just show static to avoid weird animation issues, 
  // or duplicate effectively. For now, we duplicate the list to ensure smooth scrolling.
  // We'll duplicate it enough times to cover the screen width if needed, 
  // but a simple x2 or x3 usually works for a marquee.
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <div className="relative border-y border-white/5 bg-[#050505] py-10 overflow-hidden">
      {/* Gradient Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-48 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent" />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        /* Only pause when a specific brand group is being hovered */
        .animate-marquee:has(.group:hover) {
          animation-play-state: paused;
        }
      `}</style>
      <div className="mx-auto max-w-[1920px]">
        <div className="animate-marquee flex w-max items-center gap-24">
          {marqueeBrands.map((brand, index) => (
            <Link
              key={`${brand.id}-${index}`}
              href={`/ilanlar/${slugify(brand.name)}`}
              className="group relative flex items-center justify-center px-6 py-4 transition-all duration-300 rounded-2xl hover:bg-gray-100/90 hover:backdrop-blur-sm hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105"
            >
              {brand.logo_url ? (
                <div className="relative h-24 w-52">
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    fill
                    className="object-contain transition-all duration-300 filter brightness-0 invert opacity-60 group-hover:filter-none group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <span className="text-2xl font-bold text-neutral-500 transition-colors group-hover:text-black">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}



