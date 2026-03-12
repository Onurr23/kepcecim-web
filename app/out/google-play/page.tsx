"use client";

import { useEffect } from "react";

export default function GooglePlayRedirectPage() {
  useEffect(() => {
    window.location.href =
      "https://play.google.com/store/apps/details?id=com.kepcecim.app";
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="text-center space-y-3">
        <p className="text-sm text-orange-400 font-semibold tracking-wide uppercase">
          Yönlendiriliyorsunuz
        </p>
        <h1 className="text-2xl font-bold">
          Mağazaya yönlendiriliyorsunuz...
        </h1>
        <p className="text-sm text-neutral-400 max-w-sm mx-auto">
          Sizi Google Play sayfamıza aktarıyoruz. Birazdan otomatik olarak
          yönlendirileceksiniz.
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

