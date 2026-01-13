import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Hourglass, Weight } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export default function ListingCard({ id, title, price, location, image, type, specs, subtitle, badgeText }: ListingCardProps) {
  return (
    <Link href={`/ilan/${id}${type ? `?type=${type}` : ''}`} className="group block h-full">
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

          {/* Type Badge */}
          {type && (
            <div className={cn(
              "absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md",
              type === "sale" ? "bg-green-600" : (type === "rent" ? "bg-blue-600" : "bg-purple-600")
            )}>
              {type === "sale" ? "SATILIK" : (type === "rent" ? "KİRALIK" : "YEDEK PARÇA")}
            </div>
          )}

          {/* Year/Info Badge (Top Right) */}
          <div className="absolute top-3 right-3 rounded border border-white/5 bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            {badgeText || specs.year}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-1 truncate text-lg font-medium font-oswald text-white transition-colors group-hover:text-primary">
            {title}
          </h3>
          {subtitle && (
            <p className="mb-3 truncate text-xs font-bold uppercase tracking-wider text-neutral-500">
              {subtitle}
            </p>
          )}

          <div className="mb-4 flex items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Calendar className="h-3.5 w-3.5 text-neutral-500" />
              <span>{specs.year}</span>
            </div>
            {type !== "part" && (
              <>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Hourglass className="h-3.5 w-3.5 text-neutral-500" />
                  <span>{specs.hours}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Weight className="h-3.5 w-3.5 text-neutral-500" />
                  <span>{specs.weight}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between">
            <p className="text-xl font-bold font-oswald text-orange-500">
              {price}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

