
import { Mail } from "lucide-react";

export default function ContactText() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-4 text-4xl font-bold text-white">İletişim</h1>
                <div className="h-1 w-24 bg-primary" />
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="mb-6 text-2xl font-bold text-white">Bize Ulaşın</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçebilirsiniz.
                        Ekibimiz size en kısa sürede dönüş yapacaktır.
                    </p>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="mb-1 font-semibold text-white">E-posta</h3>
                        <a
                            href="mailto:info@kepcecim.com"
                            className="text-lg text-gray-300 hover:text-primary transition-colors"
                        >
                            info@kepcecim.com
                        </a>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 text-xl font-bold text-white">Destek</h3>
                <p className="text-gray-300 leading-relaxed">
                    Teknik destek, hesap sorunları veya platform kullanımı hakkında sorularınız için
                    <strong className="text-white"> info@kepcecim.com</strong> adresinden bizimle iletişime geçebilirsiniz.
                </p>
            </div>
        </div>
    );
}
