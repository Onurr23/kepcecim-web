
import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}
