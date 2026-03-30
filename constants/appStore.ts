/**
 * Mobil uygulama mağaza linkleri – tek kaynak.
 * iOS: App Store (TR), Android: Google Play (TR)
 */
const SITE_BASE =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "")) ||
  "https://kepcecim.com";

export const APP_STORE_URL_IOS =
  "https://apps.apple.com/tr/app/kep%C3%A7ecim/id6757110859?l=tr#information";

export const APP_STORE_URL_ANDROID =
  "https://play.google.com/store/apps/details?id=com.kepcecim.app&hl=tr";

/** Platform algılayıp mağazaya yönlendiren tek giriş noktası (QR ve mobil CTA). */
export const APP_OUT_UNIFIED_PATH = "/out/app";

export function getAppOutAbsoluteUrl(): string {
  return `${SITE_BASE}${APP_OUT_UNIFIED_PATH}`;
}
