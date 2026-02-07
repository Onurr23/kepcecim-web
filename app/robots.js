export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kepcecim.com';
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/webview/', '/api/', '/_next/'],
        },
        sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
    };
}
