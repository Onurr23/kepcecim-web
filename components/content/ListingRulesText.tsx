
export default function ListingRulesText() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-4 text-4xl font-bold text-white">İlan Verme ve Yayınlama Kuralları</h1>
                <div className="h-1 w-24 bg-primary" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                <p className="leading-relaxed">
                    Kepçecim platformunda güvenli, şeffaf ve kaliteli bir ticaret ortamı sağlamak amacıyla, ilan veren tüm kullanıcıların aşağıdaki kurallara uyması zorunludur. Bu kurallara uymayan ilanlar editörlerimiz tarafından reddedilebilir veya yayından kaldırılabilir.
                </p>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">1. Fotoğraf ve Görsel Kuralları</h2>
                    <ul className="space-y-4 list-none p-0">
                        <li className="leading-relaxed">
                            <strong className="text-white">Gerçeklik:</strong> İlan fotoğrafları, satılan veya kiralanan makineye/parçaya ait güncel ve gerçek fotoğraflar olmalıdır. Sıfır ürünler haricinde katalog veya internetten alınma temsili görsel kullanımı yasaktır.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">Filigran ve Reklam:</strong> Fotoğrafların üzerinde başka bir web sitesinin, rakip platformun logosu, ismi veya telefon numarası gibi yazılar bulunmamalıdır.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">Netlik:</strong> Bulanık, karanlık, ters çekilmiş veya ürünün detaylarının anlaşılmadığı fotoğraflar kabul edilmez.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">İçerik:</strong> Fotoğraflarda insan yüzü, plaka (güvenlik gereği kapatılması önerilir) veya genel ahlaka aykırı unsurlar bulunmamalıdır.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">2. Fiyat ve Finansal Bilgiler</h2>
                    <ul className="space-y-4 list-none p-0">
                        <li className="leading-relaxed">
                            <strong className="text-white">Gerçek Fiyat:</strong> İlan fiyatı alanına "1 TL", "111 TL", "123 TL" gibi temsili veya yanıltıcı rakamlar girilmesi yasaktır. Ürünün gerçek satış veya kiralama bedeli girilmelidir. Dövizli satışlarda güncel kur dikkate alınmalıdır.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">Tutarlılık:</strong> Başlıkta veya açıklamada belirtilen fiyat ile "Fiyat" kutucuğuna girilen rakam aynı olmalıdır.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">3. Başlık ve Açıklama Kuralları</h2>
                    <ul className="space-y-4 list-none p-0">
                        <li className="leading-relaxed">
                            <strong className="text-white">Arama Manipülasyonu:</strong> İlan başlığında "Acil", "Kelepir", "Sahibinden", "Dikkat" gibi kelimelerin kullanılması yasaktır. Başlık; Makine Markası, Modeli ve Yılı bilgilerini içermelidir.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">Büyük Harf:</strong> İlan başlığının veya açıklamasının tamamının BÜYÜK HARFLERLE yazılması, görsel kirlilik oluşturduğu için yasaktır. Sadece baş harfler büyük kullanılmalıdır.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">Yönlendirme:</strong> Açıklama kısmında başka web sitelerine, linklere veya rakip platformlara yönlendirme yapılamaz.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">Hakaret ve Argo:</strong> Açıklama metinlerinde hakaret, küfür, argo veya siyasi içerik barındıran ifadeler kullanılamaz.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">4. Kategori ve İlan Yapısı</h2>
                    <ul className="space-y-4 list-none p-0">
                        <li className="leading-relaxed">
                            <strong className="text-white">Doğru Kategori:</strong> "Satılık" olan bir makine "Kiralık" kategorisine veya "Yedek Parça" kategorisine açılamaz. Yanlış kategorideki ilanlar reddedilir.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">Mükerrer (Tekrarlayan) İlan:</strong> Aynı ürün için birden fazla aktif ilan açılamaz. Satılan ürünün ilanı silinmelidir.
                        </li>
                        <li className="leading-relaxed">
                            <strong className="text-white">Yasaklı Ürünler:</strong> Ruhsatsız, hacizli, chalıntı, motor/şasi numarası kazınmış veya satışı kanunen yasak olan makinelerin ilanı verilemez.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mt-8 mb-4 text-2xl font-bold text-white">5. Yaptırımlar</h2>
                    <p className="leading-relaxed">
                        Kepçecim, bu kuralları ihlal eden ilanları düzenleme, reddetme veya yayından kaldırma hakkına sahiptir. Kuralları ısrarla ihlal eden kullanıcıların "Satıcı Yetkisi" iptal edilebilir veya üyelikleri süresiz olarak durdurulabilir.
                    </p>
                </section>
            </div>
        </div>
    );
}
