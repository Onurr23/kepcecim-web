"use client";

import { cn } from "@/lib/utils";

interface FilterTab {
    id: string;
    label: string;
    count: number;
}

interface FilterTabsProps {
    tabs: FilterTab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
    return (
        <div className="flex w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-3">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                                isActive
                                    ? "bg-orange-600 text-black shadow-lg shadow-orange-900/20"
                                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
                            )}
                        >
                            <span>{tab.label}</span>
                            <span
                                className={cn(
                                    "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                                    isActive ? "bg-black/20 text-black" : "bg-neutral-700 text-neutral-500"
                                )}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
