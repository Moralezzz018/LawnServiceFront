const stats = [
  { value: '12+', label: 'Years of Experience' },
  { value: '500+', label: 'Clients' },
  { value: '1200+', label: 'Projects Done' },
];

export function StatsBar() {
  return (
    <section className="relative bg-[#1E2A10] text-white overflow-hidden">
      <div className="noise-overlay absolute inset-0"></div>
      <div className="absolute top-0 left-0 w-full h-12 bg-[#F9FAF4] [clip-path:polygon(0_0,100%_0,100%_20%,0_100%)]"></div>
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-3xl lg:text-5xl font-bold text-white">{stat.value}</p>
              <p className="text-sm lg:text-base text-white/75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-12 bg-[#F9FAF4] [clip-path:polygon(0_80%,100%_0,100%_100%,0_100%)]"></div>
    </section>
  );
}
