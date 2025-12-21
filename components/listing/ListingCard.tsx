import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  id: string | number;
  title: string;
  price: string;
  location: string;
  image: string;
  specs: {
    year: number;
    hours: string;
    weight: string;
  };
}

export default function ListingCard({ id, title, price, location, image, specs }: ListingCardProps) {
  return (
    <Link href={`/ilan/${id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_20px_-10px_rgba(249,115,22,0.3)]">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 right-3 rounded border border-white/5 bg-white/10 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            {specs.year}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 truncate text-lg font-bold text-white transition-colors group-hover:text-primary">
            {title}
          </h3>
          
          <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
            <span>{specs.year}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-700" />
            <span>{specs.hours}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-700" />
            <span>{specs.weight}</span>
          </div>
          
          <div className="mt-auto flex items-end justify-between">
            <p className="text-xl font-extrabold text-primary">
              {price}
            </p>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

