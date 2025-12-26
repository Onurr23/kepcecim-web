"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
  { href: "/kurumsal/sss", label: "Sıkça Sorulan Sorular" },
  { href: "/kurumsal/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kurumsal/kullanim-kosullari", label: "Kullanıcı Sözleşmesi" },
  { href: "/kurumsal/iletisim", label: "İletişim" },
];

export default function KurumsalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 py-20 lg:flex-row">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 lg:shrink-0">
            <nav className="sticky top-32 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      "border-l-4",
                      isActive
                        ? "border-l-primary bg-primary/10 text-primary"
                        : "border-l-transparent text-neutral-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-invert prose-lg max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
