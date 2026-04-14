// components/ui/Header.tsx
"use client"

import ThemeToggle from "@/app/_components/ThemeToggle";
import Link from 'next/link';
import { handleLogout } from "@/lib/actions/auth-action";
import { Bike } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollTo = (id: string) => {
    if (pathname !== '/user/dashboard') {
      router.push(`/user/dashboard#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50 w-full">
      <div className="w-screen bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/user/dashboard" className="flex items-center gap-2">
              <Bike className="h-8 w-8 text-red-600" strokeWidth={2.5} />
              <span className="text-2xl font-bold text-black">
                MotoRent
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollTo("home")}
                className="text-black-700 hover:text-red-600 font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo("bikes")}
                className="text-black-700 hover:text-red-600 font-medium transition-colors"
              >
                Bikes
              </button>
              <Link
                href="/user/Uplodedrivinglicense"
                className="text-black-700 hover:text-red-600 font-medium transition-colors"
              >
                How It Works
              </Link>
              {/* <Link
                href="/pricing"
                className="text-black-700 hover:text-red-600 font-medium transition-colors"
              >
                Pricing
              </Link> */}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-white text-black px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>

              {/* <Link
                href="/get-started"
                className="bg-red-600 hover:bg-red-700 text-black px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                Get Started
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 md:top-5 md:right-8 z-50">
        <ThemeToggle />
      </div>
    </header>
  );
}