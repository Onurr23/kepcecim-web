import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
    title: "Kepçecim Mobil Uygulamasını İndir - İş Makinesi Cebinde",
    description:
        "Kepçecim mobil uygulaması ile binlerce iş makinesi ilanı, yedek parça ve ataşman cebinizde. Hemen indirin, ticarete başlayın.",
};

export default function Page() {
    return <LandingPage />;
}
