// components/Footer.tsx
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* FULL WIDTH BACKGROUND */}
      <div className="bg-gradient-to-b from-[#0b1220] to-[#020617] text-slate-400">

        {/* CENTERED CONTENT */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">

            {/* BRAND */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-red-500">Moto</span>
                <span className="text-3xl font-bold text-white">Rent</span>
              </div>

              <p className="max-w-md text-sm leading-relaxed">
                Your trusted partner for premium motorbike adventures.
              </p>

              <div className="flex gap-4">
                {[faFacebookF, faTwitter, faInstagram].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social link"
                    className="w-11 h-11 flex items-center justify-center rounded-full
                               bg-[#0f172a] text-slate-400
                               hover:bg-[#1e293b] hover:text-white
                               transition"
                  >
                    <FontAwesomeIcon icon={icon} />
                  </a>
                ))}
              </div>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-4 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition">Press</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
              <ul className="space-y-4 text-sm">
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white transition">Safety</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="/faqs" className="hover:text-white transition">FAQs</Link></li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
              <ul className="space-y-4 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
                <li><Link href="/licenses" className="hover:text-white transition">Licenses</Link></li>
              </ul>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p>© 2025 MotoRent. All rights reserved.</p>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} />
                <a
                  href="mailto:contact@motorrent.com"
                  className="hover:text-white transition"
                >
                  contact@motorrent.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
