import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { AppStoreQR } from "@/components/AppStoreQR";
import OpenAppModalTrigger from "@/components/OpenAppModalTrigger";
import { APP_OUT_UNIFIED_PATH } from "@/constants/appStore";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#080808] text-white overflow-hidden mt-10">
      {/* Glow Separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      {/* Top Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
            <p className="text-gray-400 leading-relaxed text-sm">
              Türkiye'nin İş Makinesi Pazaryeri.
              <br />
              Güvenli, hızlı ve kolay ticaret.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/kepcecimapp" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/5 p-2 text-white/60 transition-colors hover:bg-primary/20 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Hızlı Erişim */}
          <div>
            <h3 className="mb-6 font-bold text-orange-500 uppercase tracking-widest text-sm">Hızlı Erişim</h3>
            <ul className="space-y-3">
              <li><Link href="/ilanlar" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">İlanlar</Link></li>
              <li><Link href="/galeriler" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Galeriler</Link></li>
              <li><Link href="/ilanlar" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Fiyat Listesi</Link></li>
              <li>
                <OpenAppModalTrigger triggerType="general" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">
                  Satıcı Ol
                </OpenAppModalTrigger>
              </li>
              <li><Link href="/kurumsal/sss" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Yardım</Link></li>
            </ul>
          </div>

          {/* Col 3: Kurumsal */}
          <div>
            <h3 className="mb-6 font-bold text-orange-500 uppercase tracking-widest text-sm">Kurumsal</h3>
            <ul className="space-y-3">
              <li><Link href="/kurumsal/hakkimizda" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Hakkımızda</Link></li>
              <li><Link href="/kurumsal/iletisim" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">İletişim</Link></li>
              <li><Link href="/kurumsal/gizlilik-politikasi" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Gizlilik Politikası</Link></li>
              <li><Link href="/kurumsal/kullanim-kosullari" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Kullanıcı Sözleşmesi</Link></li>
              <li><Link href="/kurumsal/satici-sozlesmesi" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Satıcı Sözleşmesi</Link></li>
              <li><Link href="/kurumsal/ilan-kurallari" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">İlan Kuralları</Link></li>
            </ul>
          </div>

          {/* Col 4: Mobil Uygulama */}
          <div className="flex flex-col justify-start min-w-0">
            <h3 className="mb-6 font-bold text-orange-500 uppercase tracking-widest text-sm">Mobil Uygulama</h3>

            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-xl shadow-black/20 min-w-[280px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative flex flex-col gap-6">
                <div>
                  <h4 className="text-lg font-bold text-white">Kepçecim Cepte</h4>
                  <p className="mt-1 text-xs text-gray-500">Uygulamayı indir, ticarete başla</p>
                </div>

                <div className="hidden sm:flex justify-center">
                  <AppStoreQR
                    unified
                    size={100}
                    showLabels
                    labelClassName="text-gray-400"
                    variant="card"
                  />
                </div>

                <a
                  href={APP_OUT_UNIFIED_PATH}
                  className="sm:hidden flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-orange-500 active:scale-[0.98]"
                >
                  Uygulamayı İndir
                </a>

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

