import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/60">
            © {currentYear} Kepçecim. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              href="/gizlilik"
              className={cn(
                "text-sm text-white/60 transition-colors",
                "hover:text-white focus:outline-none focus:ring-2",
                "focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className={cn(
                "text-sm text-white/60 transition-colors",
                "hover:text-white focus:outline-none focus:ring-2",
                "focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
              )}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className={cn(
                "text-sm text-white/60 transition-colors",
                "hover:text-white focus:outline-none focus:ring-2",
                "focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
              )}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

