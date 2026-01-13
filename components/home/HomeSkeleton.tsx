
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeSkeleton() {
    return (
        <div className="bg-neutral-950">
            <HeroSectionSkeleton />
            <CategoryStripSkeleton />
            <BentoGridSkeleton />
            <BrandStripSkeleton />
        </div>
    )
}

export function HeroSectionSkeleton() {
    return (
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 w-full max-w-4xl px-4">
                <Skeleton className="h-16 w-3/4 md:h-24" />
                <Skeleton className="h-6 w-1/2 md:h-8" />
                <Skeleton className="h-14 w-full max-w-lg rounded-xl" /> {/* Search Input */}
                <div className="flex gap-4 mt-4">
                    <Skeleton className="h-12 w-40 rounded-lg" />
                    <Skeleton className="h-12 w-40 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export function CategoryStripSkeleton() {
    return (
        <div className="py-12 border-b border-white/5">
            <div className="container mx-auto px-4 overflow-hidden">
                <div className="flex gap-8 justify-center">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function BentoGridSkeleton() {
    return (
        <div className="py-20 container mx-auto px-4 max-w-7xl">
            <Skeleton className="h-10 w-64 mb-8" /> {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px]">
                <Skeleton className="md:col-span-2 md:row-span-2 rounded-xl" />
                <Skeleton className="md:col-span-2 md:row-span-1 rounded-xl" />
                <Skeleton className="md:col-span-1 md:row-span-1 rounded-xl" />
                <Skeleton className="md:col-span-1 md:row-span-1 rounded-xl" />
            </div>
        </div>
    )
}

export function BrandStripSkeleton() {
    return (
        <div className="py-12 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex gap-8 justify-between">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-32" />
                    ))}
                </div>
            </div>
        </div>
    )
}
