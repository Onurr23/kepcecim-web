const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kepcecim.com";

/**
 * Build full canonical URL for a path.
 * Path should start with / (e.g. /ilan/foo-123).
 */
export function getCanonicalUrl(path: string, baseUrl?: string): string {
  const base = baseUrl ?? BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${normalizedPath}`;
}

export function getBaseUrl(): string {
  return BASE_URL.replace(/\/$/, "");
}
