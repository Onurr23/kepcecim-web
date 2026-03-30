"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useAppModal } from "@/contexts/AppModalContext";
import { APP_OUT_UNIFIED_PATH } from "@/constants/appStore";

export default function Header() {
  const { openModal } = useAppModal();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/new_logo.png"
            alt="Kepçecim Logo"
            width={200}
            height={56}
            className="h-10 sm:h-14 w-auto object-contain"
            priority
          />
          <span className="hidden sm:block text-2xl font-bold whitespace-nowrap">
            <span className="text-primary">KEPÇECİM</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/ilanlar/satilik"
            className="text-base font-medium text-white transition-colors hover:text-orange-500"
          >
            Satılık
          </Link>
          <Link
            href="/ilanlar/kiralik"
            className="text-base font-medium text-white transition-colors hover:text-orange-500"
          >
            Kiralık
          </Link>
          <Link
            href="/ilanlar/yedek-parca"
            className="text-base font-medium text-white transition-colors hover:text-orange-500"
          >
            Yedek Parça
          </Link>
          <Link
            href="/galeriler"
            className="text-base font-medium text-white transition-colors hover:text-orange-500"
          >
            Mağazalar
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <a
            href={APP_OUT_UNIFIED_PATH}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            Uygulamayı İndir
          </a>

          <Link
            href="/indir"
            className="hidden rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/90 lg:inline-flex"
          >
            Uygulamayı İndir
          </Link>

          <button
            onClick={() => openModal("header")}
            className="flex items-center gap-2 rounded-full bg-orange-600 px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ücretsiz İlan Ver</span>
            <span className="inline sm:hidden">İlan Ver</span>
          </button>
        </div>
      </div>
    </header>
  );
}
