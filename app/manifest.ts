import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri",
        short_name: 'Kepçecim',
        description: 'Satılık ve kiralık iş makineleri, yedek parça ve sektörün nabzı.',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#F97316',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        prefer_related_applications: true,
    }
}
