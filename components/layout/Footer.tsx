import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Youtube, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white overflow-hidden">
      {/* Top Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Col 1: Brand */}
          <div className="space-y-6">
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
            <p className="text-neutral-400">
              Türkiye'nin İş Makinesi Pazaryeri.
              <br />
              Güvenli, hızlı ve kolay ticaret.
            </p>
            <div className="flex gap-4">
              <a href="#" className="rounded-full bg-white/5 p-2 text-white/60 transition-colors hover:bg-primary/20 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-white/5 p-2 text-white/60 transition-colors hover:bg-primary/20 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full bg-white/5 p-2 text-white/60 transition-colors hover:bg-primary/20 hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Hızlı Erişim */}
          <div>
            <h3 className="mb-6 font-bold text-white">Hızlı Erişim</h3>
            <ul className="space-y-4">
              <li><Link href="/ilanlar" className="text-neutral-400 transition-colors hover:text-primary">İlanlar</Link></li>
              <li><Link href="/fiyatlar" className="text-neutral-400 transition-colors hover:text-primary">Fiyat Listesi</Link></li>
              <li><Link href="/satici-ol" className="text-neutral-400 transition-colors hover:text-primary">Satıcı Ol</Link></li>
              <li><Link href="/kurumsal/sss" className="text-neutral-400 transition-colors hover:text-primary">Yardım</Link></li>
            </ul>
          </div>

          {/* Col 3: Kurumsal */}
          <div>
            <h3 className="mb-6 font-bold text-white">Kurumsal</h3>
            <ul className="space-y-4">
              <li><Link href="/kurumsal/hakkimizda" className="text-neutral-400 transition-colors hover:text-primary">Hakkımızda</Link></li>
              <li><Link href="/kurumsal/iletisim" className="text-neutral-400 transition-colors hover:text-primary">İletişim</Link></li>
              <li><Link href="/kurumsal/kariyer" className="text-neutral-400 transition-colors hover:text-primary">Kariyer</Link></li>
              <li><Link href="/kurumsal/gizlilik-politikasi" className="text-neutral-400 transition-colors hover:text-primary">Gizlilik Politikası</Link></li>
            </ul>
          </div>

          {/* Col 4: App CTA */}
          <div>
            <h3 className="mb-6 font-bold text-white">Cebindeki Şantiye</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <button className="flex items-center justify-center rounded bg-white/10 px-4 py-2 text-xs font-bold transition-colors hover:bg-white/20">
                    App Store
                  </button>
                  <button className="flex items-center justify-center rounded bg-white/10 px-4 py-2 text-xs font-bold transition-colors hover:bg-white/20">
                    Google Play
                  </button>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded bg-white p-1">
                  {/* Placeholder QR Code using Lucide Icon for now */}
                  <QrCode className="h-16 w-16 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Signature) */}
      <div className="relative border-t border-white/5 py-8">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <h1 className="select-none text-[12rem] font-black leading-none text-white/[0.03] opacity-50 blur-sm">
            KEPÇECİM
          </h1>
        </div>
        
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-neutral-600">
            © {currentYear} Kepçecim Teknoloji A.Ş. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

