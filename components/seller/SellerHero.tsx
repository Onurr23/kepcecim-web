import Image from "next/image";
import { BadgeCheck, MapPin, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface SellerHeroProps {
    type: "corporate" | "individual";
    name: string;
    logo: string;
    coverImage?: string;
    memberSince: string;
    slogan?: string;
    location?: string;
    isVerified?: boolean;
}

export default function SellerHero({
    type,
    name,
    logo,
    coverImage,
    memberSince,
    slogan,
    location,
    isVerified = true,
}: SellerHeroProps) {

    // CORPORATE MODE (Reusing StoreHero logic)
    if (type === "corporate") {
        return (
            <div className="relative w-full">
                {/* Cover Image */}
                <div className="relative h-48 w-full md:h-64 bg-neutral-900">
                    {coverImage && (
                        <>
                            <Image
                                src={coverImage}
                                alt={`${name} Cover`}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </>
                    )}
                </div>

                {/* Profile Info */}
                <div className="relative mx-auto -mt-16 max-w-7xl px-4 md:px-8">
                    <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:gap-6 md:text-left">
                        {/* Logo */}
                        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-black bg-neutral-900 shadow-xl">
                            <Image
                                src={logo}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col pb-2">
                            <div className="mb-1 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                <h1 className="font-oswald text-3xl font-bold text-white md:text-4xl">
                                    {name}
                                </h1>
                                {isVerified && (
                                    <div className="flex items-center gap-1.5 rounded bg-orange-600 px-2 py-0.5 text-xs font-bold text-black shadow-lg shadow-orange-900/20">
                                        <BadgeCheck className="h-4 w-4" />
                                        <span>Onaylı Mağaza</span>
                                    </div>
                                )}
                            </div>

                            <div className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-medium text-neutral-400 md:justify-start">
                                {location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>{location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    <span>{memberSince} üye</span>
                                </div>
                            </div>

                            {slogan && (
                                <p className="max-w-md text-base text-neutral-300">
                                    {slogan}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // INDIVIDUAL MODE
    return (
        <div className="relative w-full border-b border-white/5 bg-[#0A0A0A] py-12">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 md:px-8">

                {/* Avatar */}
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 shadow-xl">
                    <Image
                        src={logo}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold text-white">
                        {name}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                        {location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{location}</span>
                            </div>
                        )}
                        <div className="h-1 w-1 rounded-full bg-neutral-700" />
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />
                            <span>{memberSince} üye</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
