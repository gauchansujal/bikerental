// components/ui/Header.tsx
"use client"

import ThemeToggle from "@/app/_components/ThemeToggle";
import Link from 'next/link';
import { handleLogout } from "@/lib/actions/auth-action";
import { Bike } from 'lucide-react';

export default function Header() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50 w-full">
      {/* Full-width background */}
      <div className="w-full bg-white border-b">
        {/* Content stays centered with max width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Bike className="h-8 w-8 text-red-600" strokeWidth={2.5} />
              <span className="text-2xl font-bold text-black">
                MotoRent
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollTo("home")}
                className="text-red-700 hover:text-red-600 font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo("bikes")}
                className="text-red-700 hover:text-red-600 font-medium transition-colors"
              >
                Bikes
              </button>
              <Link
                href="/how-it-works"
                className="text-red-700 hover:text-red-600 font-medium transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-red-700 hover:text-red-600 font-medium transition-colors"
              >
                Pricing
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={handleLogout}
                className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-red-300 text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
              >
                Logout
              </button>

              <Link
                href="/get-started"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 md:top-5 md:right-8 z-50">
        <ThemeToggle />
      </div>
    </header>
  );
}