
import { Skeleton } from "@/components/ui/Skeleton";

export default function ListingDetailSkeleton() {
    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* LEFT COLUMN (Content) */}
                    <div className="space-y-8 lg:col-span-2">

                        {/* Header Section */}
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-64" /> {/* Breadcrumbs */}

                            <div className="flex gap-2 mb-3">
                                <Skeleton className="h-6 w-20 rounded-md" />
                                <Skeleton className="h-6 w-20 rounded-md" />
                            </div>

                            <Skeleton className="h-10 w-3/4" /> {/* Title */}

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-6">
                                <Skeleton className="h-10 w-48" /> {/* Price */}
                                <Skeleton className="h-4 w-40" /> {/* Location */}
                            </div>
                        </div>

                        {/* Main Image Gallery */}
                        <div className="space-y-4">
                            <Skeleton className="aspect-video w-full rounded-xl" />
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className="h-20 w-32 shrink-0 rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Condition Section */}
                        <Skeleton className="h-32 rounded-xl" />

                        {/* Specs Grid */}
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F]">
                            <div className="grid grid-cols-2 divide-x divide-y divide-white/5 md:grid-cols-3">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="p-4 flex flex-col justify-center h-24">
                                        <Skeleton className="h-3 w-20 mb-2" />
                                        <Skeleton className="h-6 w-32" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <Skeleton className="h-48 rounded-xl" />

                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    <div className="relative lg:col-span-1 hidden lg:block">
                        <div className="sticky top-4 h-fit space-y-6">
                            <Skeleton className="h-64 rounded-xl" /> {/* Seller Card */}
                            <Skeleton className="h-14 rounded-lg" /> {/* Button 1 */}
                            <Skeleton className="h-14 rounded-lg" /> {/* Button 2 */}
                            <Skeleton className="h-20 rounded-lg" /> {/* Safety Tips */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
