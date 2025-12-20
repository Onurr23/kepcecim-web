"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-dark/80 backdrop-blur supports-[backdrop-filter]:bg-dark/60" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">
            <span className="text-primary">Kep</span>
            <span className="text-white">çecim</span>
          </span>
        </Link>
        
        <button
          className={cn(
            "flex items-center gap-2 rounded-lg border",
            "bg-card/50 px-4 py-2 text-sm font-medium text-white",
            "transition-colors hover:bg-card hover:border-primary/50",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark"
          )}
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <Download className="h-4 w-4" />
          Download App
        </button>
      </div>
    </header>
  );
}

