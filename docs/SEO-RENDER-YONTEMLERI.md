# Next.js SEO Çalışmasında Kullanılan Render Yöntemleri

Bu dokümanda, SEO iyileştirmesi yaptığımız sayfalarda **hangi Next.js render yöntemini** kullandığımız ve **neden** o yöntemi seçtiğimiz özetleniyor.

---

## Next.js’te SEO Açısından Önemli Render Türleri

| Yöntem | Kısa açıklama | SEO notu |
|--------|----------------|----------|
| **SSG** (Static Site Generation) | Build zamanında HTML üretilir, her istekte aynı dosya sunulur. | İçerik ilk HTML’de; crawl ve hız için ideal. |
| **ISR** (Incremental Static Regeneration) | SSG gibi ama belirli aralıklarla (revalidate) arka planda sayfa yeniden üretilir. | Güncel içerik + hızlı TTFB; liste/detay sayfaları için uygun. |
| **SSR** (Server-Side Rendering) | Her istekte sunucuda HTML üretilir (`dynamic` veya `force-dynamic`). | Her zaman güncel; fakat her istekte DB/API maliyeti. |
| **CSR** (Client-Side Rendering) | İçerik tarayıcıda JS ile yüklenir. | İlk HTML’de içerik yok; arama motorları ve Lighthouse için zayıf. |

SEO için hedef: **İçeriğin (başlık, açıklama, liste, ilan metni) ilk HTML yanıtında bulunması.** Bu yüzden veriye dayalı sayfalarda SSG veya ISR/SSR tercih ettik; sadece client’ta veri çekilen sayfaları server’a taşıdık.

---

## Sayfa Sayfa Kullanılan Yöntemler ve Nedenleri

### 1. Ana sayfa (`/`)

- **Yöntem:** **ISR** — `revalidate = 600` (10 dakika).
- **Ne yapıyor:** Sayfa build’de veya ilk istekte üretilir; 10 dakika boyunca cache’lenir, süre dolunca arka planda yeniden üretilir.
- **Neden:** Kategoriler, vitrin ilanları ve marka listesi sık saniye saniye değişmiyor. 10 dakikada bir tazelenmesi hem güncelliği hem de sunucu yükü / TTFB dengesini sağlıyor. İçerik her zaman ilk HTML’de (SSR/ISR), SEO ve Lighthouse için uygun.

---

### 2. İlan listesi (`/ilanlar/[slug]` — satılık, kiralık, yedek parça)

- **Yöntem:** **ISR** — `revalidate = 120` (2 dakika). Önceden `force-dynamic` (SSR) vardı, kaldırıldı.
- **Ne yapıyor:** Her istekte sunucuya gitmek yerine, en fazla 2 dakika eski cache’li HTML sunulur; süre dolunca arka planda yeniden render.
- **Neden:** Liste ve filtreler sık değişir ama saniye bazında değil. 2 dakika ISR ile hem güncel sayfalar hem hızlı yanıt elde ediyoruz. Tam SSR her istekte ağır filtre sorguları çalıştırır; ISR ile hem SEO (içerik ilk HTML’de) hem performans korunuyor.

---

### 3. İlan detay (`/ilan/[slug]`)

- **Yöntem:** **ISR + kısmi SSG** — `revalidate = 60` (1 dakika) ve `generateStaticParams` ile ilk 20 satılık ilan build’de statik üretiliyor.
- **Ne yapıyor:** 20 ilan build zamanında statik; diğer tüm ilanlar ilk istekte üretilip 1 dakika cache’leniyor (on-demand ISR).
- **Neden:** Fiyat ve durum bilgisi güncel kalmalı; 1 dakika ISR bu ihtiyacı karşılıyor. 20 ilan için SSG ile ilk açılışlar çok hızlı; geri kalanı da ilk ziyarette HTML’e yazıldığı için crawler ve Lighthouse ilk HTML’de içeriği görüyor. Tam statik (sadece SSG) binlerce ilan için build süresini patlatır; tam SSR ise her tıklamada DB’ye gider; ISR bu ikisi arasında dengeli.

---

### 4. Galeriler listesi (`/galeriler`)

- **Yöntem:** **ISR** — `revalidate = 300` (5 dakika). Önceden sayfa tamamen **CSR** idi (“use client” + `useEffect` ile veri).
- **Ne yapıyor:** Sunucuda `getStoresServer()` ile mağaza listesi çekiliyor, HTML’e yazılıyor; sonuç 5 dakika cache’leniyor. Client tarafında arama/şehir filtresi aynı kalıyor.
- **Neden:** CSR’da ilk HTML’de liste yoktu; arama motorları ve Lighthouse “içerik yok” görüyordu. Server’da veri çekip HTML’e yazarak (ISR) hem ilk HTML’de liste var hem 5 dakikada bir tazeleniyor. Böylece hem SEO hem güncellik sağlandı.

---

### 5. Galeri detay (`/galeri/[slug]`)

- **Yöntem:** **ISR** — `revalidate = 60` (1 dakika). Önceden sadece `generateMetadata` sunucudaydı; sayfa gövdesi **CSR** (mağaza ve ilanlar client’ta çekiliyordu).
- **Ne yapıyor:** Sunucuda mağaza ve ilanlar çekilip ilk HTML’e yazılıyor; `StoreProfileClient`’a `initialSeller` ve `initialProducts` veriliyor. Sayfa 1 dakika cache’leniyor.
- **Neden:** Sadece meta ile yetinmek SEO için yeterli değil; mağaza adı ve ilan listesi ilk HTML’de olmalı. Server’da veri çekip HTML’e yazarak (ISR) hem crawler hem Lighthouse içeriği görüyor; client aynı veriyi kullanıp tab/filtre etkileşimini sürdürüyor.

---

### 6. Kurumsal sayfalar (`/kurumsal/*`)

- **Yöntem:** **SSG** (varsayılan) — `revalidate` veya `dynamic` yok.
- **Ne yapıyor:** Build’de statik HTML üretilir; içerik sabit (Hakkımızda, Gizlilik, SSS vb.).
- **Neden:** İçerik nadiren değişir; her istekte sunucuda render etmeye gerek yok. SSG ile en hızlı yanıt ve ilk HTML’de tam metin; SEO için ideal.

---

### 7. İndir (`/indir`)

- **Yöntem:** **SSG** (varsayılan).
- **Ne yapıyor:** Statik metadata ve statik sayfa; build’de tek seferlik HTML.
- **Neden:** İçerik sabit; SSG hem hız hem SEO için yeterli.

---

## Özet tablo

| Sayfa | Render | revalidate / not |
|-------|--------|-------------------|
| Ana sayfa | ISR | 600 sn (10 dk) |
| İlan listesi | ISR | 120 sn (2 dk) |
| İlan detay | ISR + kısmi SSG | 60 sn; 20 ilan SSG |
| Galeriler | ISR | 300 sn (5 dk) |
| Galeri detay | ISR | 60 sn (1 dk) |
| Kurumsal | SSG | — |
| İndir | SSG | — |

---

## Neden CSR Kullanmadık (Veri Sayfalarında)?

- **CSR:** İlk HTML neredeyse boş; içerik JS ile sonradan gelir. Arama motorları ve Lighthouse ilk yanıta bakar; “meta description yok”, “içerik yok” gibi uyarılar çıkar, sıralama riski artar.
- Bu yüzden **galeriler** ve **galeri detay** sayfalarını client-only’den çıkarıp **server’da veri çeken + ISR** yapıya geçirdik; böylece ilk HTML’de hem meta hem liste/detay içeriği yer alıyor.

## Neden Tam SSR (force-dynamic) Değil?

- **SSR:** Her istekte sunucu DB’ye gider, HTML üretir. Güncellik en yüksek ama sunucu yükü ve TTFB artar.
- Liste ve detay sayfalarında **birkaç dakika veya dakika** gecikme kabul edilebilir; bu yüzden **ISR** ile hem güncel hem hızlı (cache’li) yanıt tercih edildi. Sadece gerçekten anlık veri gereken yerlerde SSR düşünülebilir.

Özetle: **SEO için içeriği ilk HTML’e yazdık (SSG/ISR/SSR); hız ve güncellik dengesi için ağırlığı ISR’a verdik.**
