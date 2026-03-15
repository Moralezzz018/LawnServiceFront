import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 7, suffix: '+', label: 'Years of Experience' },
  { value: 500, suffix: '+', label: 'Clients' },
  { value: 1200, suffix: '+', label: 'Projects Done' },
];

function CountUpValue({ target, suffix, isVisible }: { target: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1400;
    const startTime = performance.now();
    let animationFrame = 0;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(updateCount);
      }
    };

    animationFrame = window.requestAnimationFrame(updateCount);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isVisible, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#1E2A10] text-white overflow-hidden">
      <div className="noise-overlay absolute inset-0"></div>
      <div className="absolute top-0 left-0 w-full h-12 bg-[#F9FAF4] [clip-path:polygon(0_0,100%_0,100%_20%,0_100%)]"></div>
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-3xl lg:text-5xl font-bold text-white">
                <CountUpValue target={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </p>
              <p className="text-sm lg:text-base text-white/75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-12 bg-[#F9FAF4] [clip-path:polygon(0_80%,100%_0,100%_100%,0_100%)]"></div>
    </section>
  );
}
