interface FiyatlariPageProps {
  params: {
    category: string;
  };
}

export default function FiyatlariPage({ params }: FiyatlariPageProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Fiyatlar
        </h1>
        <p className="text-white/60 mb-4">
          SEO landing page for category: <span className="text-white">{params.category}</span>
        </p>
        <p className="text-white/60">
          SEO landing page content coming soon...
        </p>
      </div>
    </div>
  );
}

