
import { Skeleton } from "@/components/ui/Skeleton";

export default function DealerCardSkeleton() {
    return (
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#121212] h-[350px]">
            {/* Header Image */}
            <Skeleton className="h-32 w-full rounded-none" />

            {/* Logo Circle */}
            <div className="absolute left-4 top-[4.5rem] z-20">
                <Skeleton className="h-16 w-16 rounded-full border-2 border-[#121212]" />
            </div>

            {/* Body Content */}
            <div className="flex flex-1 flex-col px-4 pb-4 pt-10">
                {/* Title & Verified Badge */}
                <div className="mb-2 flex items-start justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>

                {/* Location */}
                <Skeleton className="mb-4 h-4 w-1/2" />

                {/* Bottom Section (Member since) */}
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
            </div>
        </div>
    );
}
