import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-white/90">
          Page Not Found
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className={cn(
            "inline-flex items-center justify-center rounded-lg",
            "bg-primary px-6 py-3 text-sm font-medium text-white",
            "transition-colors hover:bg-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark"
          )}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

