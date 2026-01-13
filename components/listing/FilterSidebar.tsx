import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterState } from "@/hooks/useListingFilters";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onApply: () => void;
  categories: any[];
  brands: any[];
  isForklift?: boolean;
  isCrane?: boolean;
  isExcavator?: boolean; // Can be used for Loder logic too
  isPart?: boolean;
  subCategories?: any[];
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onApply,
  categories,
  brands,
  isForklift,
  isCrane,
  isExcavator,
  isPart,
  subCategories
}: FilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("");

  const handleCheckboxChange = (group: keyof FilterState, value: string) => {
    // For single select behavior (radio-like checkbox)
    if (filters[group] === value) {
      onFilterChange(group, null);
    } else {
      onFilterChange(group, value);
    }
  };

  return (
    <div className="hidden h-fit space-y-8 rounded-xl bg-[#121212] p-6 lg:sticky lg:top-4 lg:block">

      {/* Kategori */}
      <div className="space-y-4">
        <h3 className="font-bold text-white">Kategori</h3>
        <div className="space-y-2.5">
          {(categories || []).map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.category === cat.id.toString()}
                  onChange={() => handleCheckboxChange('category', cat.id.toString())}
                  className="peer h-5 w-5 appearance-none rounded border border-white/10 bg-neutral-900 checked:bg-orange-500 checked:border-orange-500 transition-all"
                />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className={cn(
                "text-sm font-medium transition-colors",
                filters.category === cat.id.toString() ? "text-white" : "text-neutral-400 group-hover:text-white"
              )}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Alt Kategori (Parts Only) */}
      {isPart && subCategories && subCategories.length > 0 && (
        <>
          <div className="h-px bg-white/5" />
          <div className="space-y-4">
            <h3 className="font-bold text-white">Alt Kategori</h3>
            <div className="space-y-2.5">
              {subCategories.map((sub) => (
                <label key={sub.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.sub_type === sub.id.toString()}
                      onChange={() => handleCheckboxChange('sub_type', sub.id.toString())} // Using sub_type for sub_category ID
                      className="peer h-5 w-5 appearance-none rounded border border-white/10 bg-neutral-900 checked:bg-orange-500 checked:border-orange-500 transition-all"
                    />
                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    filters.sub_type === sub.id.toString() ? "text-white" : "text-neutral-400 group-hover:text-white"
                  )}>
                    {sub.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="h-px bg-white/5" />

      {/* Marka */}
      <div className="space-y-4">
        <h3 className="font-bold text-white">Marka</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Marka ara..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-neutral-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {(brands || [])
            .filter((brand) => brand.name.toLowerCase().includes(brandSearch.toLowerCase()))
            .map((brand) => (
              <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brand === brand.id.toString()}
                    onChange={() => handleCheckboxChange('brand', brand.id.toString())}
                    className="peer h-5 w-5 appearance-none rounded border border-white/10 bg-neutral-900 checked:bg-orange-500 checked:border-orange-500 transition-all"
                  />
                  <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  filters.brand === brand.id.toString() ? "text-white" : "text-neutral-400 group-hover:text-white"
                )}>
                  {brand.name}
                </span>
              </label>
            ))}
        </div>
      </div>

      {/* Dynamic Fields: Forklift */}
      {isForklift && (
        <>
          <div className="h-px bg-white/5" />
          <div className="space-y-4">
            <h3 className="font-bold text-white">Forklift Tipi</h3>
            <div className="space-y-2">
              {['Dizel', 'LPG', 'Elektrikli', 'Akülü'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio"
                    checked={filters.sub_type === type}
                    onChange={() => onFilterChange('sub_type', type)}
                    className="peer h-4 w-4 appearance-none rounded-full border border-white/10 bg-neutral-900 checked:bg-orange-500 checked:border-orange-500 transition-all"
                  />
                  <div className="h-2 w-2 rounded-full bg-white absolute opacity-0 peer-checked:opacity-100 left-[5px] pointer-events-none" />
                  <span className={cn("text-sm transition-colors", filters.sub_type === type ? "text-white" : "text-neutral-400")}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-bold text-white">Mast Tipi</h3>
            <div className="space-y-2">
              {['Standart', 'Triplex', 'Quadruplex'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio"
                    checked={filters.mastType === type}
                    onChange={() => onFilterChange('mastType', type)}
                    className="peer h-4 w-4 appearance-none rounded-full border border-white/10 bg-neutral-900 checked:bg-orange-500 checked:border-orange-500 transition-all"
                  />
                  <span className={cn("text-sm transition-colors", filters.mastType === type ? "text-white" : "text-neutral-400")}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-bold text-white">Kaldırma Kapasitesi (Ton)</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.liftingCapacity?.[0] || ""}
                onChange={(e) => onFilterChange('liftingCapacity', [e.target.value ? Number(e.target.value) : null, filters.liftingCapacity?.[1]])}
                className="w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.liftingCapacity?.[1] || ""}
                onChange={(e) => onFilterChange('liftingCapacity', [filters.liftingCapacity?.[0], e.target.value ? Number(e.target.value) : null])}
                className="w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </>
      )}

      {/* Dynamic Fields: Excavator / Loder */}
      {isExcavator && (
        <>
          <div className="h-px bg-white/5" />
          <div className="space-y-4">
            <h3 className="font-bold text-white">Yürüyüş Tipi</h3>
            <div className="flex gap-2">
              {['Paletli', 'Lastikli'].map(type => (
                <button
                  key={type}
                  onClick={() => onFilterChange('sub_type', type === filters.sub_type ? null : type)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                    filters.sub_type === type
                      ? "border-orange-500 bg-orange-500/10 text-orange-500"
                      : "border-white/10 bg-neutral-900 text-neutral-400 hover:text-white"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Dynamic Fields: Crane (Vinç) */}
      {isCrane && (
        <>
          <div className="h-px bg-white/5" />
          <div className="space-y-4">
            <h3 className="font-bold text-white">Vinç Tipi</h3>
            <div className="space-y-2">
              {['Teleskopik', 'Eklemli', 'Kule', 'Sepetli'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio"
                    checked={filters.craneType === type}
                    onChange={() => onFilterChange('craneType', type)}
                    className="peer h-4 w-4 appearance-none rounded-full border border-white/10 bg-neutral-900 checked:bg-orange-500 checked:border-orange-500 transition-all"
                  />
                  <span className={cn("text-sm transition-colors", filters.craneType === type ? "text-white" : "text-neutral-400")}>{type}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="h-px bg-white/5" />

      {/* Fiyat Aralığı */}
      <div className="space-y-4">
        <h3 className="font-bold text-white">Fiyat Aralığı</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-neutral-500 ml-1">Min</span>
            <input
              type="number"
              placeholder="0"
              value={filters.priceRange[0] || ""}
              onChange={(e) => onFilterChange('priceRange', [e.target.value ? Number(e.target.value) : null, filters.priceRange[1]])}
              className="w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-neutral-500 ml-1">Max</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1] || ""}
              onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], e.target.value ? Number(e.target.value) : null])}
              className="w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Yıl */}
      <div className="space-y-4">
        <h3 className="font-bold text-white">Üretim Yılı</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative w-full">
            <select
              value={filters.yearRange[0] || ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                // Validation: If new Min > current Max, reset Max
                const newMax = (filters.yearRange[1] && val && val > filters.yearRange[1]) ? null : filters.yearRange[1];
                onFilterChange('yearRange', [val, newMax]);
              }}
              className="w-full appearance-none rounded-md border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            >
              <option value="">Min</option>
              {Array.from({ length: 2026 - 1945 + 1 }, (_, i) => 2026 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          </div>
          <div className="relative w-full">
            <select
              value={filters.yearRange[1] || ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                // Validation: If new Max < current Min, reset Min
                const newMin = (filters.yearRange[0] && val && val < filters.yearRange[0]) ? null : filters.yearRange[0];
                onFilterChange('yearRange', [newMin, val]);
              }}
              className="w-full appearance-none rounded-md border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            >
              <option value="">Max</option>
              {Array.from({ length: 2026 - 1945 + 1 }, (_, i) => 2026 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Konum */}
      <div className="space-y-4">
        <h3 className="font-bold text-white">Konum</h3>
        <div className="relative">
          <select
            value={filters.city || ""}
            onChange={(e) => onFilterChange('city', e.target.value || null)}
            className="w-full appearance-none rounded-md border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
          >
            <option value="">İl Seçiniz</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
            <option value="Bursa">Bursa</option>
            <option value="Antalya">Antalya</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      <div className="sticky bottom-0 pt-4 bg-[#121212] pb-2">
        <button
          onClick={onApply}
          className="w-full rounded-xl bg-orange-600 py-4 text-sm font-bold text-white transition-all hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          Filtreleri Uygula
        </button>
      </div>
    </div>
  );
}

