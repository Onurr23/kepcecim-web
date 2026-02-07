import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value?: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Seçiniz",
    searchPlaceholder = "Ara...",
    disabled = false,
    className
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (val: string) => {
        onChange(val === value ? null : val); // Toggle off if clicked again? Or just standard Select behavior? Standard: select it.
        // Actually for filters, usually selecting same doesn't clear, but clearing is done via separate X or clear button.
        // Let's implement select. To clear, user usually expects 'null' or unselect.
        // Let's stick to simple select. 
        if (val === value) {
            // Optional: allow deselect by clicking active item
            // onChange(null); 
        } else {
            onChange(val);
        }
        setIsOpen(false);
        setSearch("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    return (
        <div className={cn("relative", className)} ref={wrapperRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full flex items-center justify-between bg-neutral-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-left transition-colors",
                    disabled ? "opacity-50 cursor-not-allowed bg-neutral-950" : "hover:border-white/20 focus:border-orange-600",
                    isOpen && "border-orange-600 ring-1 ring-orange-600"
                )}
            >
                <span className={cn("truncate", !selectedOption && "text-neutral-500")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {selectedOption && !disabled && (
                        <div
                            role="button"
                            onClick={handleClear}
                            className="p-0.5 hover:bg-white/10 rounded"
                        >
                            <X className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                    )}
                    <ChevronDown className={cn("w-4 h-4 text-neutral-500 transition-transform", isOpen && "rotate-180")} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-white/5 sticky top-0 bg-[#1A1A1A]">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full bg-neutral-900 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-600 placeholder:text-neutral-600"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                                        value === opt.value
                                            ? "bg-orange-600/20 text-orange-400"
                                            : "text-neutral-300 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))
                        ) : (
                            <div className="p-3 text-center text-xs text-neutral-500">
                                Sonuç bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
