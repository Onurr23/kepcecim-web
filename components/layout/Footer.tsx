import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Youtube, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

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
            <h3 className="mb-6 font-bold text-orange-500 uppercase tracking-widest text-sm">Hızlı Erişim</h3>
            <ul className="space-y-3">
              <li><Link href="/ilanlar" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">İlanlar</Link></li>
              <li><Link href="/galeriler" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Galeriler</Link></li>
              <li><Link href="/fiyatlar" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Fiyat Listesi</Link></li>
              <li><Link href="/satici-ol" className="inline-block text-gray-400 transition-transform hover:text-white hover:translate-x-1">Satıcı Ol</Link></li>
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

          {/* Col 4: App CTA (New Design) */}
          <div className="flex flex-col justify-start">
            <h3 className="mb-6 font-bold text-orange-500 uppercase tracking-widest text-sm">Mobil Uygulama</h3>

            {/* Glassmorphism Download Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-orange-500/30">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl transition-all group-hover:bg-orange-500/20" />

              <div className="relative flex items-center gap-4">
                {/* QR Code */}
                <div className="flex-shrink-0 rounded-xl bg-white p-2 shadow-lg">
                  {/* Real QR or Placeholder */}
                  <QrCode className="h-20 w-20 text-black" />
                </div>

                {/* Text & Buttons */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-lg font-bold text-white">Kepçecim Cepte</h4>
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-2 rounded bg-black/40 px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-black/60 border border-white/10">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.5.87 3.29.87.78 0 2.26-1.07 3.93-.91 1.32.09 2.38.57 3.12 1.58-2.73 1.57-2.31 5.34.69 7.07zm-4.61-12.2c.71-1.02 1.23-2.49.92-3.8 1.27.08 2.53.86 3.09 2.14-1.29.98-2.88 1.94-4.01 1.66z" /></svg>
                      App Store
                    </button>
                    <button className="flex items-center gap-2 rounded bg-black/40 px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-black/60 border border-white/10">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,4.25L17.41,7.13L15.39,9.15L14.54,11.15L6.05,2.66L20.3,10.88C20.71,11.13 20.71,11.75 20.3,12L17.41,9.15M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
                      Google Play
                    </button>
                  </div>
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

