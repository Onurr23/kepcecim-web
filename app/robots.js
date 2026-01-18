export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/webview/', '/api/', '/_next/'],
        },
        sitemap: 'https://kepcecim.com/sitemap.xml',
    }
}
