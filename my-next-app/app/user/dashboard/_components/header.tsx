// components/ui/Header.tsx
import Link from 'next/link';
import { Bike } from 'lucide-react'; // or use your own SVG/icon

export default function Header() {
  return (
    <header className="border-b bg-white  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Bike className="h-8 w-8 text-red-600" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-black-900 dark:text-black">
              MotoRent
            </span>
          </Link>

          {/* Navigation - hidden on mobile, shown on md+ */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-black-600 dark:text-black-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/our-fleet" 
              className="text-black-600 dark:text-black-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
            >
              Our Fleet
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-black-600 dark:text-black-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link 
              href="/pricing" 
              className="text-black-600 dark:text-black-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-black-700 dark:text-black-300 hover:text-black-900 dark:hover:text-white font-medium"
            >
              Log in
            </Link>
            
            <Link 
              href="/get-started" 
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button (add later when you implement mobile nav) */}
          {/* <button className="md:hidden">☰</button> */}
        </div>
      </div>
    </header>
  );
}