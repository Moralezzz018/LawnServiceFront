import { Leaf, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="relative bg-[#1E2A10] text-white overflow-hidden">
      <div className="noise-overlay absolute inset-0"></div>
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {/* Logo & Tagline */}
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-[#6B7C2E]" strokeWidth={2} />
              <span className="text-lg lg:text-xl font-semibold">Memphis Lawn Service</span>
            </div>
            <p className="text-sm lg:text-base text-white/70 italic">
              Conveying emotions from your garden
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Quick Links</h3>
            <nav className="space-y-2 lg:space-y-3">
              <a href="#home" className="block text-sm lg:text-base text-white/70 hover:text-white transition-colors">
                Home
              </a>
              <a href="#services" className="block text-sm lg:text-base text-white/70 hover:text-white transition-colors">
                Services
              </a>
              <a href="#gallery" className="block text-sm lg:text-base text-white/70 hover:text-white transition-colors">
                Gallery
              </a>
              <a href="#contact" className="block text-sm lg:text-base text-white/70 hover:text-white transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Contact Info</h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#6B7C2E] mt-0.5 flex-shrink-0" />
                <span className="text-sm lg:text-base text-white/70">Memphis, TN & surrounding areas</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#6B7C2E] flex-shrink-0" />
                <a href="tel:+19014270669" className="text-sm lg:text-base text-white/70 hover:text-white transition-colors">
                  +1 (901) 427-0669
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 lg:mt-12 pt-6 lg:pt-8 text-center">
          <p className="text-white/60 text-xs lg:text-sm">
            © 2025 Memphis Lawn Service. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}