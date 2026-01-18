import ListingsClient from "@/components/listing/ListingsClient";
import { getMachineCategories } from "@/services/categories";
import { getAllBrands } from "@/services/brands";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kiralık İş Makineleri ve Hizmetler | Kepçecim",
    description: "Saatlik, günlük ve aylık kiralık iş makineleri. Uygun fiyatlı kiralık kepçe, ekskavatör, vinç ve platform ilanları burada.",
    openGraph: {
        title: "Kiralık İş Makineleri ve Hizmetler | Kepçecim",
        description: "Saatlik, günlük ve aylık kiralık iş makineleri. Uygun fiyatlı kiralık kepçe, ekskavatör, vinç ve platform ilanları burada.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Kiralık İş Makineleri ve Hizmetler | Kepçecim",
        description: "Saatlik, günlük ve aylık kiralık iş makineleri. Uygun fiyatlı kiralık kepçe, ekskavatör, vinç ve platform ilanları burada.",
    },
};

export default async function RentListingsPage() {
    const [categories, brands] = await Promise.all([
        getMachineCategories(),
        getAllBrands()
    ]);

    return <ListingsClient initialCategories={categories || []} initialBrands={brands || []} tab="rent" />;
}
