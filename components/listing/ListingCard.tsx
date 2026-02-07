import Link from "next/link";
import Image from "next/image";
// Add Sparkles icon
import { MapPin, Calendar, Clock, Sparkles, Heart } from "lucide-react";
import AppGuard from "@/components/ui/AppGuard";
import { cn } from "@/lib/utils";
import { slugify } from "@/utils/slugify";

interface ListingCardProps {
  id: string | number;
  title: string;
  price: string;
  location: string;
  image: string;
  subtitle?: string;
  badgeText?: string;
  type?: "sale" | "rent" | "part";
  specs: {
    year: number;
    hours: string;
    weight: string;
  };
  // Optional detailed info for better slugs
  machineInfo?: {
    category?: string;
    brand?: string;
    model?: string;
  }
}

export default function ListingCard({ id, title, price, location, image, type, specs, subtitle, badgeText, machineInfo }: ListingCardProps) {
  // Formula: [category-slug]-[brand-slug]-[model-slug]-[title-slug]-[id]
  const constructSlug = () => {
    const parts = [];

    if (machineInfo?.category) parts.push(slugify(machineInfo.category));
    if (machineInfo?.brand) parts.push(slugify(machineInfo.brand));
    if (machineInfo?.model) parts.push(slugify(machineInfo.model));

    // Always include title, fall back to "ilan" if empty (rare)
    parts.push(slugify(title));

    // ID always at the end
    parts.push(id);

    return parts.join('-');
  };

  const href = `/ilan/${constructSlug()}${type ? `?type=${type}` : ''}`;
  const modelName = machineInfo?.model;
  const showModel = type !== 'part' && modelName && modelName !== '-' && modelName !== 'undefined' && modelName.trim().length > 0;

  return (
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-[0_0_20px_-10px_rgba(249,115,22,0.3)]">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

          {/* Hours Badge (Replaces Type Badge) - Not for Parts */}
          {type !== "part" && (
            <div className={cn(
              "absolute left-3 top-3 rounded-md px-2 py-1 flex items-center gap-1.5 border backdrop-blur-md",
              specs.hours === "Sıfır Makine"
                ? "bg-green-600/90 border-green-500 text-white shadow-lg shadow-green-900/20"
                : "bg-black/60 border-white/10 text-white"
            )}>
              {specs.hours === "Sıfır Makine" ? (
                <Sparkles className="w-3 h-3 text-yellow-300" />
              ) : (
                <Clock className="w-3 h-3 text-orange-500" />
              )}
              <span className={cn(
                "text-[10px] font-bold tracking-wide",
                specs.hours === "Sıfır Makine" ? "text-white" : "text-white"
              )}>{specs.hours}</span>
            </div>
          )}

          {/* Year/Info Badge (Top Right) - Not for Parts */}
          {type !== "part" && (
            <div className="absolute top-3 right-3 rounded border border-white/5 bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
              {badgeText || specs.year}
            </div>
          )}

          {/* Favorite Button (Bottom Right) - New Addition */}
          <div className="absolute top-3 right-14 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <div onClick={(e) => {
              e.preventDefault();
              // AppGuard handles its own click but since we are wrapping button, we need AppGuard
              // Actually AppGuard wraps the child.
            }}>
              <AppGuard trigger="favorite">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-white hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </AppGuard>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3">
            <h3 className="mb-0.5 truncate text-lg font-medium font-oswald text-white transition-colors group-hover:text-primary">
              {title}
            </h3>
            <div className="flex flex-col gap-0.5">
              {/* Brand • Model Subtitle */}
              <p className="truncate text-sm font-medium text-neutral-300">
                {machineInfo?.brand || '-'}
                {showModel && <span className="text-neutral-500"> • {modelName}</span>}
              </p>
              {/* Category */}
              <p className="truncate text-xs text-neutral-500">
                {machineInfo?.category || '-'}
              </p>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-4">
            <div className="flex items-start gap-1.5 text-xs text-neutral-500">
              <MapPin className="h-3 w-3 shrink-0 mt-[1px]" />
              <div className="flex flex-col leading-tight opacity-80">
                {location.includes(',') ? (
                  <>
                    <span>{location.split(',')[0].trim()}</span>
                    <span>{location.split(',')[1].trim()}</span>
                  </>
                ) : (
                  <span>{location}</span>
                )}
              </div>
            </div>
            <p className="text-xl font-bold font-oswald text-orange-500">
              {price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

