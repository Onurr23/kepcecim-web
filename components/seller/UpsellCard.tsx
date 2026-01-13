import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function UpsellCard() {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-[#121212] p-6 shadow-2xl shadow-orange-900/10">
            {/* Background decoration */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-600/10 blur-3xl" />

            <div className="relative flex flex-col gap-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-oswald text-white">
                            Kurumsal Mağaza Ayrıcalığı
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                            İlanlarını kurumsal kimliğinle yayınla, daha fazla müşteriye ulaş.
                            <span className="text-orange-500 font-medium"> İlk 6 ay ücretsiz.</span>
                        </p>
                    </div>
                </div>

                <button className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-[0.98]">
                    <span>Hemen Başvur (App)</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}
