"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/new_logo.png"
            alt="Kepçecim Logo"
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
          <span className="text-2xl font-bold">
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

        <div className="flex items-center gap-4">
          <button
            className="hidden rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white lg:block"
          >
            Uygulamayı İndir
          </button>

          <Link
            href="/ilan-ver"
            className="flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Ücretsiz İlan Ver
          </Link>
        </div>
      </div>
    </header>
  );
}

