"use client";

import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  hasPendingChanges: boolean;
  handleApply: () => void;
  pendingCount: number;
}

export default function FilterButton({
  hasPendingChanges,
  handleApply,
  pendingCount,
}: FilterButtonProps) {
  return (
    <div className="hidden lg:block">
      <button
        onClick={handleApply}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all",
          "bg-orange-600 text-black hover:bg-orange-500 border border-orange-500"
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filtrele</span>
        {pendingCount > 0 && (
          <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
            {pendingCount}
          </span>
        )}
      </button>
    </div>
  );
}
