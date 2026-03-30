export type AppStoreTarget = "ios" | "android" | "other";

/**
 * Mobil tarayıcıda App Store / Google Play ayrımı (masaüstü: other).
 */
export function detectAppStoreTarget(userAgent: string): AppStoreTarget {
  const ua = userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipod/.test(ua)) return "ios";
  if (/ipad/.test(ua)) return "ios";
  return "other";
}

/**
 * iPadOS 13+ Safari bazen masaüstü Safari UA'sı verir; dokunmatik iPad için iOS sayılır.
 */
export function detectAppStoreTargetInBrowser(): AppStoreTarget {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  const touchMac =
    navigator.platform === "MacIntel" &&
    Number(navigator.maxTouchPoints) > 1;
  if (touchMac) return "ios";
  return detectAppStoreTarget(ua);
}
