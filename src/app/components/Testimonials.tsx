import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

type Testimonial = {
  name: string;
  rating: number;
  text: string;
  location: string;
  service: string;
};

const initialTestimonials: Testimonial[] = [
  {
    name: 'Lisa johnson',
    rating: 5,
    text: 'highly recommend them very professional and came the same day my grass got very high and it was hard to find someone but they came and saved the day great price and my yard looks very good. I will start using their service now for good and I appreciate them. Im very picky and Im graceful | found this company. Thank you !!!',
    location: 'Memphis, TN',
    service: 'General Lawn Service',
  },
  {
    name: 'Michael Carter',
    rating: 5,
    text: 'They transformed my overgrown bushes into something beautiful. Very happy with the results and the price was fair.',
    location: 'Cordova, TN',
    service: 'Bush & Trees Trimming',
  },
  {
    name: 'Linda Torres',
    rating: 4,
    text: 'Great job with the mulching. The garden looks clean and fresh. Will definitely call them again next season.',
    location: 'Bartlett, TN',
    service: 'Mulching',
  },
  {
    name: 'James Williams',
    rating: 5,
    text: 'Fast, efficient and left everything spotless. Highly recommend Memphis Lawn Service to anyone in the area.',
    location: 'Germantown, TN',
    service: 'Leaves Cleaning & More',
  },
  {
    name: 'Patricia Moore',
    rating: 5,
    text: 'They planted the most gorgeous flower arrangement in my front yard. My neighbors keep asking who did the work!',
    location: 'Collierville, TN',
    service: 'Flowers',
  },
];

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
}

function StarRating({ rating, animate }: { rating: number; animate: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < rating;

        return (
          <div key={index} className="relative h-4 w-4">
            <Star className="absolute inset-0 h-4 w-4 text-[#D1D5DB] fill-[#D1D5DB]" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width: isFilled ? (animate ? '100%' : '0%') : '0%',
                transition: animate ? `width 600ms ease ${index * 90}ms` : 'none',
              }}
            >
              <Star className="h-4 w-4 text-[#6B7C2E] fill-[#6B7C2E]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <article
      className={`rounded-2xl border-l-4 border-l-[#6B7C2E] bg-white p-6 shadow-md transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Quote className="mb-4 h-8 w-8 text-[#6B7C2E]" />

      <div className="mb-4">
        <StarRating rating={testimonial.rating} animate={isVisible} />
      </div>

      <p
        className="mb-4 text-sm italic text-gray-600"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        “{testimonial.text}”
      </p>

      <hr className="mb-4 border-[#E5E7EB]" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9E8C5] text-sm font-bold text-[#3B4A10]">
            {getInitials(testimonial.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{testimonial.name}</p>
            <p className="text-xs text-gray-400">{testimonial.location}</p>
          </div>
        </div>

        <span className="rounded-full bg-[#D9E8C5] px-3 py-1 text-xs text-[#3B4A10]">
          {testimonial.service}
        </span>
      </div>
    </article>
  );
}

export function Testimonials() {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    name: '',
    rating: 5,
    text: '',
    location: '',
    service: '',
  });
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || allTestimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, allTestimonials.length]);

  const visibleTestimonials = useMemo(() => {
    return Array.from({ length: visibleCount }).map((_, offset) => {
      return allTestimonials[(currentIndex + offset) % allTestimonials.length];
    });
  }, [allTestimonials, currentIndex, visibleCount]);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  const handleNewTestimonialChange = (field: keyof Testimonial, value: string | number) => {
    setNewTestimonial((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTestimonial = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: Testimonial = {
      name: newTestimonial.name.trim(),
      location: newTestimonial.location.trim(),
      service: newTestimonial.service.trim(),
      text: newTestimonial.text.trim(),
      rating: Number(newTestimonial.rating),
    };

    if (!payload.name || !payload.location || !payload.service || !payload.text) {
      return;
    }

    setAllTestimonials((prev) => [payload, ...prev]);
    setCurrentIndex(0);
    setIsFormOpen(false);
    setNewTestimonial({
      name: '',
      rating: 5,
      text: '',
      location: '',
      service: '',
    });
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden py-12 lg:py-20"
      style={{
        backgroundColor: '#D9E8C5',
        backgroundImage:
          'radial-gradient(ellipse at top, #c8dba8 0%, #D9E8C5 60%, #bfd49a 100%)',
        boxShadow: 'inset 0 8px 20px rgba(0,0,0,0.05), inset 0 -8px 20px rgba(0,0,0,0.05)',
      }}
    >
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div
        className="pointer-events-none absolute inset-0 opacity-12"
        style={{
          filter: 'url(#grain)',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.08))',
        }}
      />
      <div className="noise-overlay absolute inset-0"></div>

      <div className="pointer-events-none absolute left-0 top-0 h-12 w-full bg-[#F9FAF4] [clip-path:polygon(0_0,100%_0,100%_25%,0_100%)]" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-12 w-full bg-white [clip-path:polygon(0_80%,100%_0,100%_100%,0_100%)]" />
      <div className="pointer-events-none absolute inset-y-[36%] left-0 w-full bg-gradient-to-b from-white/0 via-white/25 to-white/0" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
          <h2 className="mb-3 text-2xl font-bold text-[#1E1E1E] lg:text-4xl">What Our Clients Say</h2>
          <p className="text-base text-[#1E1E1E]/75 lg:text-lg">Real experiences from real customers</p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${currentIndex}-${index}`}
                testimonial={testimonial}
                delay={sectionVisible ? index * 90 : 0}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={goPrev}
            className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#6B7C2E] shadow-md transition-colors hover:bg-[#6B7C2E] hover:text-white md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={goNext}
            className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#6B7C2E] shadow-md transition-colors hover:bg-[#6B7C2E] hover:text-white md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {allTestimonials.map((testimonial, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={`${testimonial.name}-${index}`}
                type="button"
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                  isActive ? 'border-[#6B7C2E] bg-[#6B7C2E]' : 'border-gray-400 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        <div className="mt-9 text-center">
          <p className="mb-4 text-sm font-medium text-[#3B4A10]">Join our happy customers</p>
          <button
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="rounded-lg bg-[#6B7C2E] px-6 py-3 text-white transition-colors hover:bg-[#3B4A10]"
          >
            {isFormOpen ? 'Close Form' : 'Add Your Testimonial'}
          </button>

          {isFormOpen && (
            <form
              onSubmit={handleAddTestimonial}
              className="mx-auto mt-6 max-w-2xl rounded-2xl border border-white/60 bg-white/75 p-5 shadow-md backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  required
                  value={newTestimonial.name}
                  onChange={(event) => handleNewTestimonialChange('name', event.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Your name"
                />
                <input
                  required
                  value={newTestimonial.location}
                  onChange={(event) => handleNewTestimonialChange('location', event.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Your location"
                />
                <input
                  required
                  value={newTestimonial.service}
                  onChange={(event) => handleNewTestimonialChange('service', event.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Service used"
                />
                <select
                  value={newTestimonial.rating}
                  onChange={(event) => handleNewTestimonialChange('rating', Number(event.target.value))}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
                <textarea
                  required
                  rows={3}
                  value={newTestimonial.text}
                  onChange={(event) => handleNewTestimonialChange('text', event.target.value)}
                  className="md:col-span-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#6B7C2E]"
                  placeholder="Share your experience"
                />
              </div>

              <div className="mt-4 text-right">
                <button
                  type="submit"
                  className="rounded-lg bg-[#6B7C2E] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#3B4A10]"
                >
                  Submit Testimonial
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
