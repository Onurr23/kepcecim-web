"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  APP_STORE_URL_IOS,
  APP_STORE_URL_ANDROID,
  getAppOutAbsoluteUrl,
} from "@/constants/appStore";

type Platform = "ios" | "android" | "both";

type Variant = "default" | "card" | "minimal";

interface AppStoreQRProps {
  platform?: Platform;
  size?: number;
  className?: string;
  showLabels?: boolean;
  labelClassName?: string;
  /** default: beyaz kutu; card: gölgeli kart; minimal: sadece QR, ince çerçeve */
  variant?: Variant;
  /**
   * Tek QR: /out/app mutlak URL — okutunca telefonda platform algılanır, doğru mağazaya gider.
   * true iken `platform` yok sayılır.
   */
  unified?: boolean;
}

const qrBoxClass = {
  default: "rounded-xl bg-white p-2.5 shadow-sm",
  card: "rounded-xl bg-white p-4 shadow-lg ring-1 ring-black/5",
  minimal: "rounded-xl bg-white/95 p-3 ring-1 ring-white/20",
};

export function AppStoreQR({
  platform = "both",
  size = 120,
  className = "",
  showLabels = true,
  labelClassName = "text-white/80",
  variant = "default",
  unified = false,
}: AppStoreQRProps) {
  const boxClass = qrBoxClass[variant];

  if (unified) {
    const url = getAppOutAbsoluteUrl();
    return (
      <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
        <div className={boxClass}>
          <QRCodeSVG value={url} size={size} level="M" />
        </div>
        {showLabels && (
          <span
            className={`text-sm font-semibold tracking-wide text-center max-w-[200px] ${labelClassName}`}
          >
            Telefonunuzdan tarayın
          </span>
        )}
      </div>
    );
  }

  if (platform === "both") {
    return (
      <div
        className={`flex flex-wrap items-stretch justify-center gap-5 ${className}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={boxClass}>
            <QRCodeSVG value={APP_STORE_URL_IOS} size={size} level="M" />
          </div>
          {showLabels && (
            <span className={`text-sm font-semibold tracking-wide ${labelClassName}`}>
              App Store
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className={boxClass}>
            <QRCodeSVG value={APP_STORE_URL_ANDROID} size={size} level="M" />
          </div>
          {showLabels && (
            <span className={`text-sm font-semibold tracking-wide ${labelClassName}`}>
              Google Play
            </span>
          )}
        </div>
      </div>
    );
  }

  const url =
    platform === "ios" ? APP_STORE_URL_IOS : APP_STORE_URL_ANDROID;
  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <div className={boxClass}>
        <QRCodeSVG value={url} size={size} level="M" />
      </div>
      {showLabels && (
        <span className={`text-sm font-semibold tracking-wide ${labelClassName}`}>
          {platform === "ios" ? "App Store" : "Google Play"}
        </span>
      )}
    </div>
  );
}
