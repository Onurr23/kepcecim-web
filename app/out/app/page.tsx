"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  APP_STORE_URL_IOS,
  APP_STORE_URL_ANDROID,
  getAppOutAbsoluteUrl,
} from "@/constants/appStore";
import { detectAppStoreTargetInBrowser } from "@/lib/appPlatform";

export default function SmartAppOutPage() {
  const [phase, setPhase] = useState<"pending" | "desktop">("pending");

  useEffect(() => {
    const target = detectAppStoreTargetInBrowser();
    if (target === "ios") {
      window.location.href = APP_STORE_URL_IOS;
      return;
    }
    if (target === "android") {
      window.location.href = APP_STORE_URL_ANDROID;
      return;
    }
    setPhase("desktop");
  }, []);

  const outUrl = getAppOutAbsoluteUrl();

  if (phase === "pending") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="text-center space-y-3">
          <p className="text-sm text-orange-400 font-semibold tracking-wide uppercase">
            Yönlendiriliyorsunuz
          </p>
          <h1 className="text-2xl font-bold">Mağazaya yönlendiriliyorsunuz...</h1>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto">
            Cihazınıza uygun mağazaya aktarıyoruz.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4 py-16">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="text-sm text-orange-400 font-semibold tracking-wide uppercase">
            Mobil uygulama
          </p>
          <h1 className="text-2xl font-bold">Telefondan tarayın</h1>
          <p className="text-sm text-neutral-400">
            Karekodu telefon kamerasıyla okutun; doğru mağazaya
            yönlendirileceksiniz.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5">
            <QRCodeSVG value={outUrl} size={200} level="M" />
          </div>
        </div>

        <p className="text-xs text-neutral-500">
          Masaüstünden doğrudan gitmek isterseniz:
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/out/app-store"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            App Store
          </a>
          <a
            href="/out/google-play"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Google Play
          </a>
        </div>
      </div>
    </main>
  );
}
