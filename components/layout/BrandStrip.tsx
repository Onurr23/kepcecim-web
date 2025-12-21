export default function BrandStrip() {
  const brands = [
    "CATERPILLAR",
    "KOMATSU",
    "HIDROMEK",
    "JCB",
    "VOLVO",
    "HITACHI",
    "LIEBHERR",
  ];

  return (
    <div className="border-y border-white/5 bg-neutral-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-lg font-bold uppercase tracking-wider text-neutral-600 transition-colors hover:text-neutral-400 select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

