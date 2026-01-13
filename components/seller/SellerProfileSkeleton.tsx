
import { Skeleton } from "@/components/ui/Skeleton";
import ListingCardSkeleton from "@/components/listing/ListingCardSkeleton";

export default function SellerProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[#050505] pb-24 md:pb-12">
            {/* Hero Section Skeleton */}
            <div className="relative h-[300px] w-full bg-neutral-900 md:h-[400px]">
                {/* Cover Image Skeleton */}
                <div className="absolute inset-0 block h-full w-full">
                    <Skeleton className="h-full w-full rounded-none opacity-20" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 md:px-8">
                    <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
                        {/* Logo */}
                        <Skeleton className="h-24 w-24 rounded-2xl border-4 border-[#050505] shadow-2xl md:h-32 md:w-32" />

                        <div className="flex-1 space-y-4">
                            {/* Name & Badge */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-64 md:h-10" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>

                            {/* Location & Contact Info */}
                            <div className="flex flex-wrap gap-4">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-36" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex w-full gap-3 md:w-auto">
                            <Skeleton className="h-12 flex-1 rounded-lg md:w-32" />
                            <Skeleton className="h-12 flex-1 rounded-lg md:w-32" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-8 max-w-7xl px-4 md:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* LEFT COLUMN (Inventory) */}
                    <div className="lg:col-span-3">
                        {/* Filter Tabs */}
                        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-10 w-24 rounded-lg" />
                            ))}
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-full">
                                    <ListingCardSkeleton />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    <div className="hidden lg:col-span-1 lg:block">
                        <div className="space-y-6">
                            <Skeleton className="h-64 rounded-xl" />
                            <Skeleton className="h-48 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
