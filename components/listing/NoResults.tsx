import { SearchX } from "lucide-react";

export default function NoResults() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 rounded-full bg-neutral-900 p-6">
                <SearchX className="h-12 w-12 text-neutral-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
                Bu kriterlere uygun ilan bulunamadı
            </h3>
            <p className="max-w-md text-sm text-neutral-400">
                Arama filtrelerinizi değiştirerek veya daha genel aramalar yaparak tekrar deneyebilirsiniz.
            </p>
        </div>
    );
}
