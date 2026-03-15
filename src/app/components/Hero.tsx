import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AppointmentModal } from './AppointmentModal';

export function Hero() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <section id="home" className="relative h-[500px] lg:h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761013320045-d29e4f10bcbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5pY3VyZWQlMjBsYXduJTIwc3VidXJiYW4lMjBob21lfGVufDF8fHx8MTc3MzUxMTY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Perfectly manicured lawn"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(122,161,66,0.45),transparent_45%),radial-gradient(circle_at_80%_18%,rgba(59,74,16,0.45),transparent_48%),radial-gradient(circle_at_50%_85%,rgba(30,42,16,0.55),transparent_52%),linear-gradient(125deg,rgba(0,0,0,0.55),rgba(0,0,0,0.28))]"></div>
          <div className="noise-overlay absolute inset-0"></div>
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
            <div className="pt-2 lg:pt-4">
              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-[#6B7C2E] text-white px-8 py-3.5 lg:py-4 rounded-lg hover:bg-[#3B4A10] transition-colors text-base lg:text-lg"
              >
                Schedule Your Appointment
              </button>
            </div>

            {/* Location Badge */}
            <div className="flex items-center gap-2 pt-2 lg:pt-4">
              <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              <span className="text-sm lg:text-base text-white/90">Memphis, TN & surrounding areas</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-12 bg-[#1E2A10] [clip-path:polygon(0_15%,100%_0,100%_100%,0_100%)]"></div>
      </section>

      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} />
    </>
  );
}