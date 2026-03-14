import { MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section id="home" className="relative h-[500px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1761013320045-d29e4f10bcbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5pY3VyZWQlMjBsYXduJTIwc3VidXJiYW4lMjBob21lfGVufDF8fHx8MTc3MzUxMTY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Perfectly manicured lawn"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/60 via-black/40 to-black/60 lg:from-black/40 lg:via-black/30 lg:to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center">
        <div className="max-w-2xl text-white space-y-4 lg:space-y-6">
          <h1 className="text-3xl lg:text-6xl font-bold leading-tight">
            Your lawn, perfectly kept.
          </h1>
          <p className="text-lg lg:text-2xl text-white/90">
            Serving Memphis and surrounding areas
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4">
            <button className="bg-[#6B7C2E] text-white px-8 py-3.5 lg:py-4 rounded-lg hover:bg-[#3B4A10] transition-colors text-base lg:text-lg">
              Get a Free Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-3.5 lg:py-4 rounded-lg hover:bg-white/10 transition-colors text-base lg:text-lg">
              Our Services
            </button>
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-2 pt-2 lg:pt-4">
            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            <span className="text-sm lg:text-base text-white/90">Memphis, TN & surrounding areas</span>
          </div>
        </div>
      </div>
    </section>
  );
}