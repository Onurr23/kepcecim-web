interface IlanDetailPageProps {
  params: {
    slug: string;
  };
}

export default function IlanDetailPage({ params }: IlanDetailPageProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          İlan Detayı
        </h1>
        <p className="text-white/60 mb-4">
          Listing detail for: <span className="text-white">{params.slug}</span>
        </p>
        <p className="text-white/60">
          Listing detail page content coming soon...
        </p>
      </div>
    </div>
  );
}

