import { Phone, MessageCircle, MapPin } from "lucide-react";
import Image from "next/image";

interface StoreSidebarProps {
    phone: string;
    authorizedPerson: string;
    taxNumber?: string;
    address: string;
    mapImage?: string;
    coordinates?: { lat: number, lng: number } | null;
}

export default function StoreSidebar({
    phone,
    authorizedPerson,
    taxNumber,
    address,
    mapImage = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600&h=400",
    coordinates,
}: StoreSidebarProps) {
    const mapEmbedUrl = coordinates
        ? `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`
        : null;

    return (
        <div className="sticky top-24 hidden h-fit w-full flex-col gap-6 lg:flex">
            {/* Contact Card */}
            <div className="flex flex-col gap-3 rounded-2xl bg-[#121212] p-5 border border-white/5">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 text-base font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    <Phone className="h-5 w-5" />
                    <span>ARA</span>
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-3.5 text-base font-bold text-white transition-all hover:bg-white/5 active:scale-[0.98]">
                    <MessageCircle className="h-5 w-5" />
                    <span>MESAJ AT</span>
                </button>
            </div>

            {/* Location Card */}
            <div className="overflow-hidden rounded-2xl bg-[#121212] border border-white/5">
                {/* Map Section */}
                <div className="relative h-56 w-full bg-neutral-800">
                    {mapEmbedUrl ? (
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={mapEmbedUrl}
                            className="grayscale contrast-125 opacity-80"
                        />
                    ) : (
                        <>
                            <Image
                                src={mapImage}
                                alt="Map Location"
                                fill
                                className="object-cover opacity-60 grayscale transition-opacity hover:opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute -inset-1 animate-ping rounded-full bg-orange-600 opacity-75"></div>
                                    <div className="relative rounded-full bg-orange-600 p-2 shadow-lg shadow-orange-900/30">
                                        <MapPin className="h-6 w-6 text-black" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Address Info */}
                <div className="flex flex-col gap-4 p-5">
                    <div className="flex gap-3">
                        <MapPin className="h-5 w-5 shrink-0 text-orange-600" />
                        <p className="text-sm font-medium leading-relaxed text-neutral-300">
                            {address}
                        </p>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="space-y-1">
                        <p className="text-xs text-neutral-500">Yetkili</p>
                        <p className="text-sm font-medium text-white">{authorizedPerson}</p>
                    </div>

                    {taxNumber && (
                        <div className="space-y-1">
                            <p className="text-xs text-neutral-500">Vergi No</p>
                            <p className="text-sm font-medium text-white">{taxNumber}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
