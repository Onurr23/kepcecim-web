import Image from "next/image";
import { BadgeCheck } from "lucide-react";

interface StoreHeroProps {
    name: string;
    logo: string;
    coverImage: string;
    memberSince: string;
    slogan: string;
    isVerified?: boolean;
}

export default function StoreHero({
    name,
    logo,
    coverImage,
    memberSince,
    slogan,
    isVerified = true,
}: StoreHeroProps) {
    return (
        <div className="relative w-full">
            {/* Cover Image */}
            <div className="relative h-48 w-full md:h-64">
                <Image
                    src={coverImage}
                    alt={`${name} Cover`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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

                        <p className="mb-2 text-sm font-medium text-neutral-400">
                            {memberSince} tarihinden beri üye
                        </p>

                        <p className="max-w-md text-base text-neutral-300">
                            {slogan}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
