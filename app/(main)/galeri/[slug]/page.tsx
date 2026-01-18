import { Metadata } from 'next';
import { getStoreBySlug } from '@/services/store';
import StoreProfileClient from './StoreProfileClient';

interface PageProps {
    params: { slug: string };
}

// Helper for image URLs
const getStorageUrl = (path: string | null | undefined) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvritvbtpntvwyispsid.supabase.co";
    return `${baseUrl}/storage/v1/object/public/machine-images/${path}`;
};


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    // Fetch store details
    // Note: getStoreBySlug handles both ID and Slug
    const store = await getStoreBySlug(slug);

    if (!store) {
        return {
            title: 'Mağaza Bulunamadı | Kepçecim',
            description: 'Aradığınız mağaza sistemimizde bulunamadı.',
            openGraph: {
                title: 'Mağaza Bulunamadı | Kepçecim',
                description: 'Aradığınız mağaza sistemimizde bulunamadı.',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Mağaza Bulunamadı | Kepçecim',
                description: 'Aradığınız mağaza sistemimizde bulunamadı.',
            },
        };
    }

    const title = `${store.name} - İş Makineleri Galerisi | Kepçecim`;
    const description = `${store.name} mağazasının güncel iş makinesi ilanlarını, iletişim bilgilerini ve konumunu inceleyin.`;
    const logoUrl = getStorageUrl(store.logoUrl);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: logoUrl ? [logoUrl] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: logoUrl ? [logoUrl] : [],
        },
    };
}

export default function StoreProfilePage() {
    return <StoreProfileClient />;
}
