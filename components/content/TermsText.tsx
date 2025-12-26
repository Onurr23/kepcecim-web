
export default function TermsText() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-4 text-4xl font-bold text-white">Kullanıcı Sözleşmesi ve Hizmet Şartları</h1>
                <div className="h-1 w-24 bg-primary" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                <section>
                    <h2 className="mt-0 mb-4 text-2xl font-bold text-white">1. Taraflar ve Konu</h2>
                    <p className="leading-relaxed">
                        Bu sözleşme, Kepçecim mobil uygulaması ve web sitesini ("Platform") kullanan kullanıcı ("Kullanıcı") ile platform sahibi Kepçecim Teknoloji A.Ş. arasında akdedilmiştir. Platforma üye olan herkes bu şartları kabul etmiş sayılır.
                    </p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">2. Platformun Rolü (Yer Sağlayıcı)</h2>
                    <p className="mb-3 leading-relaxed">
                        Kepçecim, 5651 sayılı kanun kapsamında "Yer Sağlayıcı" konumundadır.
                    </p>
                    <ul className="space-y-2 list-disc list-inside leading-relaxed">
                        <li>Kepçecim, satılan makinelerin sahibi veya satıcısı değildir.</li>
                        <li>İlanlardaki bilgilerin doğruluğu, ürünün kalitesi veya yasal durumu tamamen İlan Veren'in sorumluluğundadır.</li>
                        <li>Kepçecim, alıcı ve satıcı arasındaki uyuşmazlıklarda taraf değildir ve sorumlu tutulamaz.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">3. Üyelik ve İlan Kuralları</h2>
                    <ul className="space-y-2 list-disc list-inside leading-relaxed">
                        <li>Kullanıcı, verdiği bilgilerin doğru olduğunu beyan eder.</li>
                        <li>Yanıltıcı, hatalı veya yasalara aykırı ilan vermek yasaktır.</li>
                        <li>Kepçecim, şüpheli gördüğü üyelikleri veya ilanları haber vermeksizin askıya alma/silme hakkını saklı tutar.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">4. Ödeme ve Güvenlik</h2>
                    <p className="leading-relaxed">
                        Platform üzerinden yapılan görüşmeler sonrasındaki para transferleri tamamen kullanıcıların kendi inisiyatifindedir. Kepçecim, kapora dolandırıcılığı veya hatalı ödemelerden sorumlu değildir. Kullanıcıların makineyi fiziksel olarak görmeden ödeme yapmamaları önemle tavsiye edilir.
                    </p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">5. Fikri Mülkiyet</h2>
                    <p className="leading-relaxed">
                        Platformun tasarımı, yazılımı, logosu ve veritabanı Kepçecim'in mülkiyetindedir. İzinsiz kopyalanamaz veya "scraping" (veri kazıma) yapılamaz.
                    </p>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">6. Değişiklikler</h2>
                    <p className="leading-relaxed">
                        Kepçecim, bu sözleşme maddelerini dilediği zaman güncelleme hakkını saklı tutar. Güncel sözleşme her zaman bu sayfada yayınlanır.
                    </p>
                </section>
            </div>
        </div>
    );
}
