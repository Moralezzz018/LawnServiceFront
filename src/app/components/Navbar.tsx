import { useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#F9FAF4] sticky top-0 z-50 border-b border-[#D9E8C5]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 lg:w-6 lg:h-6 text-[#6B7C2E]" strokeWidth={2} />
            <span className="text-base lg:text-xl font-semibold text-[#1E1E1E]">Memphis Lawn Service</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#home" className="text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors">
              Home
            </a>
            <a href="#services" className="text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors">
              Services
            </a>
            <a href="#gallery" className="text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors">
              Gallery
            </a>
            <a href="#contact" className="text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors">
              Contact
            </a>
              <a href="#testimonials" className="text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors">
              Testimonials
            </a>
            <button
              onClick={() => {
                window.location.href = '/admin';
              }}
              className="bg-[#6B7C2E] text-white px-6 py-2.5 rounded-lg hover:bg-[#3B4A10] transition-colors"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-[#1E1E1E]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-4 border-t border-[#D9E8C5]">
            <a
              href="#home"
              className="block py-2 text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#services"
              className="block py-2 text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#gallery"
              className="block py-2 text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </a>
            <a
              href="#contact"
              className="block py-2 text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
              <a
              href="#testimonials"
              className="block py-2 text-[#1E1E1E] hover:text-[#6B7C2E] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                window.location.href = '/admin';
              }}
              className="w-full bg-[#6B7C2E] text-white px-6 py-3 rounded-lg hover:bg-[#3B4A10] transition-colors"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}