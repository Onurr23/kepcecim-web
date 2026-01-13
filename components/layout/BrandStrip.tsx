import Link from "next/link";

interface Brand {
  id: string;
  name: string;
}

interface BrandStripProps {
  brands: Brand[];
}

export default function BrandStrip({ brands }: BrandStripProps) {
  return (
    <div className="border-y border-white/5 bg-neutral-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/ilanlar?brand=${brand.id}`}
              className="text-lg font-bold uppercase tracking-wider text-neutral-600 transition-colors hover:text-neutral-400 select-none cursor-pointer"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


