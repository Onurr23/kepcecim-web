import { useState, useMemo } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterState } from "@/hooks/useListingFilters";
import SearchableSelect from "@/components/ui/SearchableSelect";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onApply: () => void;
  // Data
  categories: any[];
  brands: any[];
  models: any[];
  allCities: string[];
  districts: string[];
  features: any[];
  attachments: any[];
  // Logic Flags
  isForklift: boolean;
  isExcavator: boolean;
  isLoader: boolean;
  isCrane: boolean;
  isTireConditionGroup: boolean;
  isPart?: boolean;
  hasPendingChanges?: boolean;
  pendingCount?: number;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onApply,
  categories,
  brands,
  models,
  allCities,
  districts,
  features,
  attachments,
  isForklift,
  isExcavator,
  isLoader,
  isCrane,
  isTireConditionGroup,
  isPart,
  hasPendingChanges = true,
  pendingCount = 0
}: FilterSidebarProps) {

  // -- Helper Components --

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="font-bold text-white text-[15px]">{title}</h3>
  );

  const Divider = () => <div className="h-px bg-white/5 my-6" />;

  const RadioGroup = ({
    options,
    value,
    onChange
  }: {
    options: (string | { label: string, value: any })[],
    value: any,
    onChange: (val: any) => void
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const label = typeof opt === 'string' ? opt : opt.label;
        const val = typeof opt === 'string' ? opt : opt.value;
        const isSelected = value === val;

        return (
          <button
            key={label}
            onClick={() => onChange(val)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              isSelected
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-neutral-900 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  const ChoiceChips = ({
    options,
    value,
    onChange,
    cols = 2
  }: {
    options: (string | { label: string, value: any })[],
    value: any,
    onChange: (val: any) => void,
    cols?: number
  }) => (
    <div className={cn("grid gap-2", cols === 2 ? "grid-cols-2" : "grid-cols-3")}>
      {options.map(opt => {
        const label = typeof opt === 'string' ? opt : opt.label;
        const val = typeof opt === 'string' ? opt : opt.value;
        const isSelected = value === val;

        return (
          <button
            key={label}
            onClick={() => onChange(val)}
            className={cn(
              "h-10 flex items-center justify-center rounded-lg text-xs font-bold border transition-all",
              isSelected
                ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-900/20"
                : "bg-neutral-800/50 text-neutral-400 border-white/5 hover:border-white/20 hover:bg-neutral-800 hover:text-white"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  const CheckboxItem = ({
    label,
    checked,
    onChange
  }: {
    label: string,
    checked: boolean,
    onChange: () => void
  }) => (
    <label className="flex items-center gap-3 cursor-pointer group py-1 select-none">
      <div className={cn(
        "w-5 h-5 rounded border border-white/10 flex items-center justify-center transition-all shrink-0",
        checked ? "bg-orange-600 border-orange-600" : "bg-neutral-900 group-hover:border-white/30"
      )}>
        {checked && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className={cn(
        "text-sm transition-colors",
        checked ? "text-white font-medium" : "text-neutral-400 group-hover:text-white"
      )}>{label}</span>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    </label>
  );

  // -- Handlers --

  const handleCategoryToggle = (id: string) => {
    if (filters.category === id) onFilterChange('category', null);
    else onFilterChange('category', id);
  };

  // -- Logic Helpers --
  const selectedCategoryName = useMemo(() => {
    const cat = categories.find(c => c.id.toString() === filters.category);
    return cat?.name || "";
  }, [categories, filters.category]);

  const isOtherMachines = selectedCategoryName === "Diğer Makineler";

  // -- Helpers --

  const toLocaleTitleCase = (strValue: string) => {
    if (!strValue) return "";
    return strValue
      .split(' ')
      .map(word => {
        if (!word) return "";
        return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
      })
      .join(' ');
  };

  const formatDisplayPrice = (val: number | null) => {
    if (val === null || val === undefined) return "";
    return new Intl.NumberFormat("tr-TR").format(val);
  };

  const parseDisplayPrice = (str: string) => {
    const numericValue = str.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue, 10) : null;
  };

  // Convert Brands to Options
  const brandOptions = useMemo(() => brands.map(b => ({
    value: b.id.toString(),
    label: b.name
  })), [brands]);

  // Convert Models to Options
  const modelOptions = useMemo(() => models.map(m => ({
    value: m.id.toString(),
    label: m.name
  })), [models]);

  // Convert Cities to Options
  const cityOptions = useMemo(() => allCities.map(c => {
    const formatted = toLocaleTitleCase(c);
    return {
      value: formatted, // Send formatted to filter as requested "o haliyele"
      label: formatted
    };
  }), [allCities]);

  // Convert Districts to Options
  const districtOptions = useMemo(() => districts.map(d => {
    const formatted = toLocaleTitleCase(d);
    return {
      value: formatted,
      label: formatted
    };
  }), [districts]);

  // Year Options Logic
  const currentYear = new Date().getFullYear();
  const allYears = Array.from({ length: 80 }, (_, i) => currentYear - i);

  const minYearOptions = useMemo(() => {
    const max = filters.yearRange[1];
    if (max) return allYears.filter(y => y <= max);
    return allYears;
  }, [allYears, filters.yearRange]);

  const maxYearOptions = useMemo(() => {
    const min = filters.yearRange[0];
    if (min) return allYears.filter(y => y >= min);
    return allYears;
  }, [allYears, filters.yearRange]);

  const handleFeatureToggle = (id: string) => {
    const current = filters.features || [];
    if (current.includes(id)) {
      onFilterChange('features', current.filter(i => i !== id));
    } else {
      onFilterChange('features', [...current, id]);
    }
  };

  const handleAttachmentToggle = (id: string) => {
    const current = filters.attachments || [];
    if (current.includes(id)) {
      onFilterChange('attachments', current.filter(i => i !== id));
    } else {
      onFilterChange('attachments', [...current, id]);
    }
  };


  return (
    <div className="hidden lg:flex flex-col relative h-full bg-gradient-to-b from-neutral-900/95 to-neutral-900 rounded-2xl border border-neutral-800/50 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)]">

      {/* Content Area - No internal scroll, flows with page */}
      <div className="space-y-4 p-5 pb-28">

        {/* CATEGORY */}
        <div className="space-y-4">
          <SectionHeader title="Kategori" />
          <div className="space-y-1">
            {categories.map(cat => (
              <CheckboxItem
                key={cat.id}
                label={cat.name}
                checked={filters.category === cat.id.toString()}
                onChange={() => handleCategoryToggle(cat.id.toString())}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* BRAND & MODEL */}

        {!isOtherMachines && (
          <>
            {/* Marka */}
            <div className="space-y-4">
              <SectionHeader title="Marka" />
              <SearchableSelect
                options={brandOptions}
                value={filters.brand}
                onChange={(val) => onFilterChange('brand', val)}
                placeholder="Marka Seçiniz"
                searchPlaceholder="Marka ara..."
              />
            </div>

            {/* Model */}
            {!isPart && (
              <div className={cn("space-y-4 transition-opacity", !filters.brand && "opacity-50 pointer-events-none")}>
                <SectionHeader title="Model" />
                <SearchableSelect
                  options={modelOptions}
                  value={filters.model}
                  onChange={(val) => onFilterChange('model', val)}
                  placeholder="Model Seçiniz"
                  searchPlaceholder="Model ara..."
                  disabled={!filters.brand}
                />
              </div>
            )}

            <Divider />
          </>
        )}

        {/* DYNAMIC FIELDS - GROUP A (Priority fields like Subtype/Class) */}
        {!isOtherMachines && (
          <>
            {/* Ekskavatör */}
            {isExcavator && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-3">
                  <SectionHeader title="Alt Tip" />
                  <RadioGroup
                    options={['Paletli', 'Lastikli']}
                    value={filters.sub_type}
                    onChange={(v) => onFilterChange('sub_type', v === filters.sub_type ? null : v)}
                  />
                </div>
                <div className="space-y-3">
                  <SectionHeader title="Sınıf" />
                  <RadioGroup
                    options={['Standart', 'Mini']}
                    value={filters.class}
                    onChange={(v) => onFilterChange('class', v === filters.class ? null : v)}
                  />
                </div>
                <Divider />
              </div>
            )}

            {/* Loder & Yükleyici */}
            {isLoader && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-3">
                  <SectionHeader title="Alt Tip" />
                  <RadioGroup
                    options={['Lastikli', 'Paletli']}
                    value={filters.sub_type}
                    onChange={(v) => onFilterChange('sub_type', v === filters.sub_type ? null : v)}
                  />
                </div>
                <div className="space-y-3">
                  <SectionHeader title="Sınıf" />
                  <RadioGroup
                    options={['Standart', 'Mini']}
                    value={filters.class}
                    onChange={(v) => onFilterChange('class', v === filters.class ? null : v)}
                  />
                </div>
                {/* Tire Condition Logic */}
                {filters.sub_type === 'Lastikli' && (
                  <div className="space-y-3">
                    <SectionHeader title="Lastik Kondisyonu" />
                    <ChoiceChips
                      options={['%100', '%75+', '%50+', '%25+']}
                      value={filters.tireCondition}
                      onChange={(v) => onFilterChange('tireCondition', v === filters.tireCondition ? null : v)}
                    />
                  </div>
                )}
                <Divider />
              </div>
            )}
          </>
        )}



        {/* YEAR */}
        <div className="space-y-4">
          <SectionHeader title="Üretim Yılı" />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filters.yearRange[0] || ""}
              onChange={(e) => onFilterChange('yearRange', [e.target.value ? Number(e.target.value) : null, filters.yearRange[1]])}
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
            >
              <option value="">Min</option>
              {minYearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={filters.yearRange[1] || ""}
              onChange={(e) => onFilterChange('yearRange', [filters.yearRange[0], e.target.value ? Number(e.target.value) : null])}
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
            >
              <option value="">Max</option>
              {maxYearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PRICE */}
        <div className="space-y-4">
          <SectionHeader title="Fiyat" />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Min TL"
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-600"
              value={formatDisplayPrice(filters.priceRange[0])}
              onChange={(e) => onFilterChange('priceRange', [parseDisplayPrice(e.target.value), filters.priceRange[1]])}
            />
            <input
              type="text"
              placeholder="Max TL"
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-600"
              value={formatDisplayPrice(filters.priceRange[1])}
              onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], parseDisplayPrice(e.target.value)])}
            />
          </div>
        </div>

        <Divider />

        {/* LOCATION - Searchable */}
        <div className="space-y-4">
          <SectionHeader title="Konum" />
          <div className="space-y-2">
            <SearchableSelect
              options={cityOptions}
              value={filters.city}
              onChange={(val) => onFilterChange('city', val)}
              placeholder="İl Seçiniz"
              searchPlaceholder="İl ara..."
            />

            <SearchableSelect
              options={districtOptions}
              value={filters.district}
              onChange={(val) => onFilterChange('district', val)}
              placeholder="İlçe Seçiniz"
              searchPlaceholder="İlçe ara..."
              disabled={!filters.city}
            />
          </div>
        </div>

        {/* MORE DYNAMIC FIELDS & NEW FILTERS */}

        {!isOtherMachines && (
          <>
            <Divider />

            {/* Working Hours */}
            <div className="space-y-4">
              <SectionHeader title="Çalışma Saati" />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number" placeholder="Min Saat"
                  className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-600"
                  value={filters.hoursRange?.[0] || ""}
                  onChange={(e) => onFilterChange('hoursRange', [e.target.value ? Number(e.target.value) : null, filters.hoursRange?.[1]])}
                />
                <input
                  type="number" placeholder="Max Saat"
                  className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-600"
                  value={filters.hoursRange?.[1] || ""}
                  onChange={(e) => onFilterChange('hoursRange', [filters.hoursRange?.[0], e.target.value ? Number(e.target.value) : null])}
                />
              </div>
            </div>

            <Divider />

            {/* Machine Status */}
            <div className="space-y-4">
              <SectionHeader title="Makine Durumu" />
              <ChoiceChips
                options={['Tümü', 'Sıfır', 'İkinci El']}
                value={filters.machineStatus || 'Tümü'}
                onChange={(v) => onFilterChange('machineStatus', v === 'Tümü' ? null : v)}
                cols={3}
              />
            </div>

            <Divider />

            {/* Condition - Uses Chips ? or maybe just standard radio? "Grid of Choice Chips... for Lastik ... and Makine Durumu". Okay, Condition can be standard or Chips. Let's make it standard to save vertical space if needed, or consistent. Let's stick to simple radio for Condition to vary, or Chips? Requirement said "Makine Durumu" -> Chips. Condition -> Not specified. I'll stick to Radio for Condition to avoid clutter. */}
            <div className="space-y-4">
              <SectionHeader title="Kondisyon" />
              <RadioGroup
                options={[
                  { label: 'Tümü', value: null },
                  { label: 'Mükemmel', value: 'excellent' },
                  { label: 'İyi', value: 'good' },
                  { label: 'Orta', value: 'fair' }
                ]}
                value={filters.condition}
                onChange={(v) => onFilterChange('condition', v)}
              />
            </div>

            {/* Features (Özellikler) */}
            {features && features.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <Divider />
                <div className="space-y-4">
                  <SectionHeader title="Özellikler" />
                  <div className="space-y-2">
                    {features.map(f => (
                      <CheckboxItem
                        key={f.id}
                        label={f.name}
                        checked={(filters.features || []).includes(f.id.toString())}
                        onChange={() => handleFeatureToggle(f.id.toString())}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Attachments (Ataşmanlar) */}
            {attachments && attachments.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
                <Divider />
                <div className="space-y-4">
                  <SectionHeader title="Ataşmanlar" />
                  <div className="space-y-2">
                    {attachments.map(a => (
                      <CheckboxItem
                        key={a.id}
                        label={a.name}
                        checked={(filters.attachments || []).includes(a.id.toString())}
                        onChange={() => handleAttachmentToggle(a.id.toString())}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}





            {/* Mobil Vinç */}
            {isCrane && (
              <div className="animate-in fade-in duration-300">
                <Divider />
                <div className="space-y-6">
                  <div className="space-y-3">
                    <SectionHeader title="Vinç Tipi" />
                    <div className="space-y-2">
                      {['Eklemli Bomlu Vinç', 'Teleskopik Vinç', 'Paletli Vinç', 'Sepetli Platform'].map(opt => (
                        <CheckboxItem
                          key={opt}
                          label={opt}
                          checked={filters.craneType === opt}
                          onChange={() => onFilterChange('craneType', filters.craneType === opt ? null : opt)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <SectionHeader title="Şasi Tipi" />
                    <RadioGroup
                      options={['Paletli', 'Kamyon Üstü', 'Vinç Şasi']}
                      value={filters.chassisType}
                      onChange={(v) => onFilterChange('chassisType', v === filters.chassisType ? null : v)}
                    />
                  </div>
                  {filters.chassisType === 'Kamyon Üstü' && (
                    <div className="space-y-3">
                      <SectionHeader title="Kamyon Markası" />
                      <select
                        value={filters.truckBrand || ""}
                        onChange={(e) => onFilterChange('truckBrand', e.target.value || null)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:border-orange-600 outline-none"
                      >
                        <option value="">Seçiniz</option>
                        {['Mercedes-Benz', 'MAN', 'Ford', 'Scania', 'Volvo', 'BMC'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Forklift */}
            {isForklift && (
              <div className="animate-in fade-in duration-300">
                <Divider />
                <div className="space-y-6">
                  <div className="space-y-3">
                    <SectionHeader title="Forklift Tipi" />
                    <div className="space-y-2">
                      {['Dizel', 'LPG', 'Elektrikli', 'Dar Koridor', 'Dizel/LPG'].map(opt => (
                        <CheckboxItem
                          key={opt}
                          label={opt}
                          checked={filters.sub_type === opt}
                          onChange={() => onFilterChange('sub_type', filters.sub_type === opt ? null : opt)}
                        />
                      ))}
                    </div>
                  </div>

                  {filters.sub_type === 'Elektrikli' && (
                    <div className="space-y-3">
                      <SectionHeader title="Tekerlek Sayısı" />
                      <RadioGroup
                        options={['3 Teker', '4 Teker']}
                        value={filters.wheelCount}
                        onChange={(v) => onFilterChange('wheelCount', v === filters.wheelCount ? null : v)}
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <SectionHeader title="Kaldırma Kapasitesi (Ton)" />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number" placeholder="Min"
                        className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-600"
                        value={filters.liftingCapacity?.[0] || ""}
                        onChange={(e) => onFilterChange('liftingCapacity', [e.target.value ? Number(e.target.value) : null, filters.liftingCapacity?.[1]])}
                      />
                      <input
                        type="number" placeholder="Max"
                        className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-600"
                        value={filters.liftingCapacity?.[1] || ""}
                        onChange={(e) => onFilterChange('liftingCapacity', [filters.liftingCapacity?.[0], e.target.value ? Number(e.target.value) : null])}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <SectionHeader title="Mast Tipi" />
                    <div className="space-y-2">
                      {['Standart (Duplex)', 'Triplex (Konteyner)', 'Quadruplex'].map(opt => (
                        <CheckboxItem
                          key={opt}
                          label={opt}
                          checked={filters.mastType === opt}
                          onChange={() => onFilterChange('mastType', filters.mastType === opt ? null : opt)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <SectionHeader title="Lastik Tipi" />
                    <RadioGroup
                      options={['Havalı', 'Dolgu', 'İz Yapmayan']}
                      value={filters.tireType}
                      onChange={(v) => onFilterChange('tireType', v === filters.tireType ? null : v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Key Logic: Tire Condition for others */}
            {isTireConditionGroup && (
              <div className="animate-in fade-in duration-300">
                <Divider />
                <div className="space-y-6">
                  <div className="space-y-3">
                    <SectionHeader title="Lastik Kondisyonu" />
                    <ChoiceChips
                      options={['%100', '%75+', '%50+', '%25+']}
                      value={filters.tireCondition}
                      onChange={(v) => onFilterChange('tireCondition', filters.tireCondition === v ? null : v)}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}
