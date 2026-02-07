/**
 * Converts a string to a URL-friendly slug.
 * Handles Turkish characters and removes non-alphanumeric characters.
 *
 * @param {string} text - The text to slugify
 * @returns {string} The slugified string
 */
export function slugify(text: string | null | undefined): string {
    if (!text) return '';

    const trMap: { [key: string]: string } = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ı': 'i', 'I': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u'
    };

    return text
        .toString()
        .split('')
        .map(char => trMap[char] || char)
        .join('')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}
