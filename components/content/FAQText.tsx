import { faqs } from "@/constants/faq";

export default function FAQText() {
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
