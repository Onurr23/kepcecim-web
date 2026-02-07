# SEO Doğrulama Kontrol Listesi

Bu dokümanda, yapılan SEO geliştirmelerinin doğru uygulandığını sayfa sayfa ve araçlarla nasıl kontrol edeceğiniz adım adım yer alır.

## Otomatik kontrol (script)

Proje kökünden çalıştırın (site çalışır durumda olmalı):

```bash
# Production veya staging URL ile
node scripts/verify-seo.mjs https://kepcecim.com

# Local (npm run start ile çalışıyorsa)
node scripts/verify-seo.mjs http://localhost:3000
```

Script sitemap, robots ve ana sayfa / ilanlar / galeriler / SSS / indir sayfalarında temel meta ve JSON-LD varlığını kontrol eder. Detaylı manuel kontrol için aşağıdaki listeyi kullanın.

**Temel kural:** Testleri production veya `npm run build && npm run start` ile çalışan ortamda yapın. Geliştirme modunda (`npm run dev`) bazı meta ve canonical değerleri farklı olabilir.

---

## Genel Kontroller

### 1. Ortam değişkeni

- [ ] Production ortamında `NEXT_PUBLIC_BASE_URL` tanımlı ve doğru (örn. `https://kepcecim.com`)
- [ ] Canonical ve sitemap URL’leri bu domain’i kullanıyor

### 2. Sitemap

- [ ] `https://[SITE]/sitemap.xml` açılıyor
- [ ] Ana sayfa (`/`) listede
- [ ] `/ilanlar/satilik`, `/ilanlar/kiralik`, `/ilanlar/yedek-parca` listede
- [ ] `/galeriler` listede
- [ ] İlan ve galeri URL’leri (dinamik) listede

### 3. Robots

- [ ] `https://[SITE]/robots.txt` açılıyor
- [ ] `Sitemap: https://[SITE]/sitemap.xml` satırı doğru domain ile var
- [ ] `Disallow: /webview/`, `/api/`, `/_next/` mevcut

---

## Sayfa Bazlı Kontroller

Her sayfada **Sayfa kaynağını görüntüle** (sağ tık → View Page Source) ile aşağıdakilere bakın.

---

### Ana sayfa (`/`)

| Kontrol | Nasıl bakılır | Beklenen |
|--------|----------------|----------|
| Title | `<title>` | "Kepçecim - Türkiye'nin İş Makinesi Pazaryeri" veya benzeri |
| Description | `<meta name="description"` | Ana sayfaya özel, 1–2 cümle |
| OG | `og:title`, `og:description`, `og:url` | Dolu ve doğru |
| JSON-LD | `application/ld+json` içinde `@type":"WebSite"` | Tek blok, `name`, `url`, `potentialAction` (SearchAction) var |

- [ ] Tümü doğru

---

### İlan listesi (`/ilanlar/satilik`, `/ilanlar/kiralik`, `/ilanlar/yedek-parca`)

| Kontrol | Nasıl bakılır | Beklenen |
|--------|----------------|----------|
| Title | `<title>` | "Satılık İş Makineleri" / "Kiralık..." / "Yedek Parça..." (slug’a göre) |
| Canonical | `<link rel="canonical"` | Aynı path + anlamlı query (kategori, marka, sayfa vb.) |
| Sayfa no | Title | 2. sayfada "Sayfa 2" geçmeli |
| OG | `og:title`, `og:url` | Title ve canonical ile uyumlu |

- [ ] Satılık sayfası
- [ ] Kiralık sayfası
- [ ] Yedek parça sayfası
- [ ] Filtreli bir URL’de canonical doğru
- [ ] 2. sayfada title’da "Sayfa 2" var

---

### İlan detay (`/ilan/[herhangi-bir-ilan-slug]`)

| Kontrol | Nasıl bakılır | Beklenen |
|--------|----------------|----------|
| Title | `<title>` | Marka, model, kategori, şehir ve "Kepçecim" |
| Description | `<meta name="description"` | Yıl, saat, fiyat veya kısa açıklama |
| Canonical | `<link rel="canonical"` | `https://[SITE]/ilan/[slug]` (query yok) |
| OG image | `og:image` | İlan görseli veya boş değil |
| JSON-LD | `application/ld+json` içinde `@type":"Product"` | `name`, `image`, `offers` (price, priceCurrency) |

- [ ] Bir satılık ilan sayfası
- [ ] Bir kiralık ilan sayfası (varsa)
- [ ] Product JSON-LD hatasız

---

### Galeriler listesi (`/galeriler`)

| Kontrol | Nasıl bakılır | Beklenen |
|--------|----------------|----------|
| Title | `<title>` | "Onaylı Satıcılar & Galericiler" |
| Description | `<meta name="description"` | Galericiler sayfasına özel metin |
| OG / Twitter | `og:title`, `twitter:title` | Sayfa ile uyumlu |
| İçerik ilk HTML’de | Kaynakta mağaza isimleri / kart metinleri | Sayfa kaynağında en az birkaç mağaza adı görünüyor (client-only değil) |

- [ ] Meta ve OG doğru
- [ ] İlk yüklemede mağaza listesi HTML’de

---

### Galeri detay (`/galeri/[herhangi-bir-mağaza-slug]`)

| Kontrol | Nasıl bakılır | Beklenen |
|--------|----------------|----------|
| Title | `<title>` | "[Mağaza Adı] - İş Makineleri Galerisi | Kepçecim" |
| Canonical | `<link rel="canonical"` | `https://[SITE]/galeri/[slug]` |
| OG image | `og:image` | Mağaza logosu veya boş değil |
| JSON-LD | `application/ld+json` içinde `@type":"Organization"` | `name`, `url`, `description` |
| İçerik ilk HTML’de | Kaynakta mağaza adı ve ilanlar | Mağaza adı ve en az bir ilan başlığı/fiyatı HTML’de |

- [ ] Meta, canonical, OG doğru
- [ ] Organization JSON-LD var
- [ ] Mağaza ve ilanlar ilk HTML’de

---

### Kurumsal sayfalar

Her biri için: **Title**, **description** ve **OG** sayfaya özel mi?

| Sayfa | Title (içermeli) | Özel kontrol |
|-------|-------------------|--------------|
| `/kurumsal/hakkimizda` | Hakkımızda | - |
| `/kurumsal/gizlilik-politikasi` | Gizlilik Politikası | - |
| `/kurumsal/kullanim-kosullari` | Kullanım Koşulları | - |
| `/kurumsal/satici-sozlesmesi` | Satıcı Sözleşmesi | - |
| `/kurumsal/ilan-kurallari` | İlan Kuralları | - |
| `/kurumsal/iletisim` | İletişim | - |
| `/kurumsal/sss` | Sıkça Sorulan Sorular | **FAQPage** JSON-LD; `mainEntity` içinde soru-cevaplar |

- [ ] Hakkımızda
- [ ] Gizlilik Politikası
- [ ] Kullanım Koşulları
- [ ] Satıcı Sözleşmesi
- [ ] İlan Kuralları
- [ ] İletişim
- [ ] SSS (metadata + FAQPage JSON-LD)

---

### İndir (`/indir`)

| Kontrol | Nasıl bakılır | Beklenen |
|--------|----------------|----------|
| Title | `<title>` | Uygulama indirme ile ilgili |
| OG image | `og:image` veya `twitter:image` | Bir görsel (icon veya logo) |
| JSON-LD | `application/ld+json` içinde `@type":"SoftwareApplication"` | `name`, `applicationCategory`, `operatingSystem` |

- [ ] Meta ve OG doğru
- [ ] SoftwareApplication JSON-LD var

---

### 404 (var olmayan bir URL)

- [ ] `https://[SITE]/var-olmayan-sayfa` açıldığında 404 sayfası geliyor
- [ ] Metinler Türkçe: "Sayfa Bulunamadı" / "Ana Sayfaya Dön" (veya (main) not-found’taki Türkçe metinler)

---

## Araçlarla Doğrulama

### Google Rich Results Test

1. https://search.google.com/test/rich-results adresine gidin.
2. Sırayla test edin:
   - [ ] Bir **ilan detay** URL’i → Product tanınmalı
   - [ ] **SSS** sayfası URL’i → FAQPage tanınmalı
   - [ ] **Galeri detay** URL’i → Organization tanınmalı (eğer destekliyorsa)

### Schema.org Validator

1. https://validator.schema.org/ adresine gidin.
2. Sayfa URL’ini girin veya HTML’den `application/ld+json` bloklarını yapıştırın.
3. [ ] Hata vermiyor, uyarılar kabul edilebilir seviyede

### Lighthouse (Chrome)

1. İlgili sayfayı açın → F12 → **Lighthouse** sekmesi.
2. Kategori: **SEO** (isteğe bağlı Best practices).
3. Mode: **Navigation**, Device: **Desktop** önerilir.
4. "Analyze page load" çalıştırın.
5. [ ] SEO skoru makul (ör. 90+), kritik SEO maddeleri yeşil

**Skorları nasıl yorumlamalı?**

- **90–100:** SEO açısından çok iyi. Küçük farklar (örn. bir sayfada 92, diğerlerinde 100) genelde tek bir maddeden (görsel boyutları, tap target, vb.) kaynaklanır; testi değiştirmen gerekmez.
- **Bir sayfada 92, diğerlerinde 100:** İlan detay gibi içerik yoğun sayfalarda görsellerin `width`/`height` eksikliği, linklerin crawlable olmaması veya viewport ayarı gibi tek bir madde puan kırabilir. Lighthouse raporunda SEO bölümünü açıp **“Passed” dışında kalan** (uyarı veya failed) maddeye bak; çoğu zaman küçük bir iyileştirme yeterli olur.
- Test ayarlarını (Navigation, Desktop, SEO) değiştirmene gerek yok; bu ayarlar karşılaştırılabilir sonuç verir.

**“Document does not have a meta description” uyarısı (ilan detay):**

- Sayfada `generateMetadata` ile `description` dönüyor olsa bile Lighthouse bazen bu uyarıyı verebilir (özellikle streamed head veya client navigation sonrası).
- **Doğrulama:** İlan detay URL’ini **yeni sekmede** açın → **Sayfa kaynağını görüntüle** (Ctrl+U / Cmd+Option+U) → kaynakta `meta name="description"` veya `meta name='description'` arayın. Etiket ve `content="..."` görünüyorsa meta description teknik olarak mevcut demektir; arama motorları da bunu kullanır.
- **Lighthouse’u tekrar denemek:** İlan detay sayfasına **doğrudan** (adres çubuğuna URL yapıştırıp Enter veya yeni sekme) gidin, sayfa tam yüklendikten sonra Lighthouse çalıştırın. Client-side navigasyon yerine full page load bazen uyarıyı kaldırır.

---

## Hızlı Komut / Manuel Kontrol

Terminalde (curl ile):

```bash
# Sitemap erişilebilir mi?
curl -sI "https://[SITE]/sitemap.xml"

# Robots doğru mu?
curl -s "https://[SITE]/robots.txt"

# Ana sayfa title ve canonical (örnek)
curl -s "https://[SITE]/" | grep -E "<title>|<link rel=\"canonical\""
```

Tarayıcı konsolunda (bir sayfada):

```javascript
// Canonical URL
document.querySelector('link[rel="canonical"]')?.href

// JSON-LD blokları
document.querySelectorAll('script[type="application/ld+json"]').length
```

---

## Özet

- [ ] Genel: Base URL, sitemap, robots
- [ ] Ana sayfa: Meta + WebSite JSON-LD
- [ ] İlan listesi: Canonical, sayfa no, revalidate
- [ ] İlan detay: Canonical + Product JSON-LD
- [ ] Galeriler: SSR içerik + meta
- [ ] Galeri detay: SSR + canonical + Organization JSON-LD
- [ ] Kurumsal 7 sayfa: Meta; SSS’te FAQPage
- [ ] İndir: OG/Twitter + SoftwareApplication
- [ ] 404: Türkçe metin
- [ ] Rich Results + (isteğe bağlı) Schema validator + Lighthouse ile doğrulama

Tüm maddeler işaretlendiğinde SEO implementasyonu doğrulanmış sayılır.
