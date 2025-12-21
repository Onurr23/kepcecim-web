export default function SSSPage() {
  const faqs = [
    {
      question: "Kepçecim nedir?",
      answer: "Kepçecim, Türkiye'nin iş makinesi alım-satım işlemlerini dijitalleştiren bir pazar yeridir. Platformumuz sayesinde iş makinesi sahipleri ve alıcılar güvenli bir şekilde buluşabilir, ilanlarını yayınlayabilir ve makine alım-satım işlemlerini gerçekleştirebilir."
    },
    {
      question: "Platformu kullanmak ücretli mi?",
      answer: "Temel ilan yayınlama ve görüntüleme hizmetleri ücretsizdir. Premium özellikler ve öne çıkan ilan hizmetleri için ücretli paketler sunulmaktadır. Detaylar için iletişim sayfamızdan bizimle iletişime geçebilirsiniz."
    },
    {
      question: "İlan nasıl yayınlanır?",
      answer: "Uygulamaya giriş yaptıktan sonra 'İlan Ver' butonuna tıklayarak ilan formunu doldurmanız yeterlidir. Makine bilgileri, fotoğraflar, fiyat ve konum bilgilerini ekledikten sonra ilanınız yayınlanacaktır."
    },
    {
      question: "Makine alırken nelere dikkat etmeliyim?",
      answer: "Makineyi satın almadan önce mutlaka yerinde görmenizi, gerekirse bir uzmana danışmanızı öneririz. Satıcıdan tüm bakım kayıtlarını ve belgeleri talep edin. Ödeme yapmadan önce makinenin çalışır durumda olduğundan emin olun."
    },
    {
      question: "Güvenli ödeme nasıl yapılır?",
      answer: "Platformumuz doğrudan ödeme işlemlerine müdahale etmez. Satıcı ve alıcı arasında doğrudan yapılan anlaşma gereği ödeme yöntemini siz belirlersiniz. Noter tasdikli senet veya banka havalesi gibi güvenli ödeme yöntemlerini öneririz."
    },
    {
      question: "İlanımı nasıl düzenleyebilirim?",
      answer: "Hesabınıza giriş yaptıktan sonra 'İlanlarım' bölümünden yayınladığınız ilanları görüntüleyebilir, düzenleyebilir veya kapatabilirsiniz."
    },
    {
      question: "Dolandırıcılık şüphesi durumunda ne yapmalıyım?",
      answer: "Şüpheli bir durumla karşılaştığınızda derhal platform yönetimi ile iletişime geçin. E-posta veya telefon kanallarından bizimle iletişime geçebilirsiniz. Güvenliğiniz için tüm şikayetlerimiz ciddiye alınır ve gerekli işlemler yapılır."
    },
    {
      question: "Mobil uygulama hangi platformlarda mevcut?",
      answer: "Kepçecim mobil uygulaması hem iOS (App Store) hem de Android (Google Play) platformlarında mevcut ve ücretsiz olarak indirilebilir."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-4xl font-bold text-white">Sıkça Sorulan Sorular</h1>
        <div className="h-1 w-24 bg-primary" />
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-xl font-bold text-white">{faq.question}</h3>
            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-white/10 bg-primary/10 p-6">
        <h3 className="mb-3 text-xl font-bold text-white">Başka bir sorunuz mu var?</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          Yukarıda cevabını bulamadığınız sorularınız için bizimle iletişime geçebilirsiniz. 
          Ekibimiz size yardımcı olmaktan mutluluk duyar.
        </p>
        <a 
          href="/kurumsal/iletisim" 
          className="inline-block rounded-lg bg-primary px-6 py-3 font-bold text-white transition-all hover:bg-primary/90"
        >
          İletişime Geç
        </a>
      </div>
    </div>
  );
}
