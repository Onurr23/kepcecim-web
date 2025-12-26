
export default function PrivacyText() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-4xl font-bold text-white">Gizlilik Politikası ve Aydınlatma Metni</h1>
        <div className="h-1 w-24 bg-primary" />
        <p className="mt-4 text-sm text-gray-400">Son Güncelleme: 21 Aralık 2025</p>
      </div>

      <div className="prose prose-invert prose-lg max-w-none text-gray-300">
        <p className="leading-relaxed">
          Kepçecim Teknoloji A.Ş. ("Şirket" veya "Kepçecim") olarak, kullanıcılarımızın güvenliğine ve gizliliğine büyük önem veriyoruz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat ile App Store/Google Play politikalarına uygun olarak hazırlanmıştır.
        </p>

        <section>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-white">1. Toplanan Veriler</h2>
          <p className="mb-3 leading-relaxed">Hizmetlerimizi sunabilmek için aşağıdaki verileri işlemekteyiz:</p>
          <ul className="space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong className="text-white">Kimlik Bilgileri:</strong> Ad, soyad, kullanıcı adı.
            </li>
            <li>
              <strong className="text-white">İletişim Bilgileri:</strong> E-posta adresi, telefon numarası (İlan sahipleriyle iletişim için).
            </li>
            <li>
              <strong className="text-white">Görsel ve İşitsel Kayıtlar:</strong> İlanlara yüklediğiniz fotoğraflar ve videolar.
            </li>
            <li>
              <strong className="text-white">Konum Bilgileri:</strong> "Yakınımdaki İlanlar" özelliğini kullanmanız durumunda (İzninize bağlı olarak).
            </li>
            <li>
              <strong className="text-white">Cihaz ve Kullanım Verileri:</strong> IP adresi, cihaz modeli, uygulama içi etkileşimler (Analiz ve güvenlik için).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-white">2. Verilerin Kullanım Amacı</h2>
          <p className="mb-3 leading-relaxed">Toplanan veriler şu amaçlarla kullanılır:</p>
          <ul className="space-y-2 list-disc list-inside leading-relaxed">
            <li>Kullanıcı hesabı oluşturmak ve yönetmek.</li>
            <li>İlanların yayınlanmasını ve alıcı-satıcı iletişimini sağlamak.</li>
            <li>Platform güvenliğini sağlamak ve dolandırıcılığı önlemek.</li>
            <li>Uygulama performansını analiz etmek ve iyileştirmek.</li>
          </ul>
        </section>

        <section>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-white">3. Verilerin Paylaşımı</h2>
          <p className="leading-relaxed">
            Kişisel verileriniz, yasal zorunluluklar (savcılık talepleri vb.) dışında üçüncü şahıslara satılmaz. Ancak, hizmeti sağlamak için altyapı sağlayıcıları (örn: Sunucu hizmetleri, SMS doğrulama firmaları) ile "bilme gereği" prensibiyle paylaşılabilir.
          </p>
        </section>

        <section>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-white">4. Kullanıcı Hakları ve Veri Silme (Hesap Silme)</h2>
          <p className="mb-3 leading-relaxed">Kullanıcılar, diledikleri zaman hesaplarını silebilirler.</p>
          <ul className="space-y-2 list-disc list-inside leading-relaxed mb-4">
            <li>
              <strong className="text-white">Uygulama içerisinden:</strong> Ayarlar &gt; Hesabımı Sil adımlarını izleyerek.
            </li>
            <li>
              <strong className="text-white">E-posta yoluyla:</strong> info@kepcecim.com adresine talep ileterek.
            </li>
          </ul>
          <p className="leading-relaxed">
            Hesap silme işlemiyle birlikte, yasal olarak saklanması zorunlu olmayan tüm verileriniz sistemlerimizden kalıcı olarak silinir veya anonim hale getirilir.
          </p>
        </section>

        <section>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-white">5. İletişim</h2>
          <p className="leading-relaxed">
            Gizlilik politikamızla ilgili sorularınız için bizimle <strong className="text-white">info@kepcecim.com</strong> adresinden iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
