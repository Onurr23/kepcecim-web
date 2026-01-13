
import { Skeleton } from "@/components/ui/Skeleton";

export default function ListingCardSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A]">
            {/* Image Skeleton */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Skeleton className="h-full w-full rounded-none" />
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-1 flex-col p-5">
                {/* Title */}
                <Skeleton className="mb-2 h-6 w-3/4" />

                {/* Subtitle */}
                <Skeleton className="mb-4 h-3 w-1/2" />

                {/* Specs Row */}
                <div className="mb-4 flex items-center justify-between gap-2 border-b border-white/5 pb-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                </div>

                {/* Bottom Row (Price & Location) */}
                <div className="mt-auto flex items-end justify-between">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
}
