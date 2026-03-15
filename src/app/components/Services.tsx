import { Scissors, Trash2, Flower2, TreeDeciduous, Leaf, Sparkles } from 'lucide-react';

const services = [
  {
    icon: Scissors,
    name: 'General Lawn Service',
    description: 'Professional mowing and lawn maintenance',
  },
  {
    icon: TreeDeciduous,
    name: 'Bush & Trees Trimming',
    description: 'Expert pruning and shaping services',
  },
  {
    icon: Trash2,
    name: 'Plants Remove',
    description: 'Safe and efficient plant removal',
  },
  {
    icon: Leaf,
    name: 'Mulching',
    description: 'Quality mulch installation for your beds',
  },
  {
    icon: Flower2,
    name: 'Flowers',
    description: 'Beautiful flower bed design and planting',
  },
  {
    icon: Sparkles,
    name: 'Leaves Cleaning & More',
    description: 'Seasonal cleanup and maintenance',
  },
];

export function Services() {
  return (
    <section id="services" className="relative bg-[#F9FAF4] py-16 lg:py-28 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-[#1E1E1E] mb-3 lg:mb-4">
            What We Do
          </h2>
          <p className="text-base lg:text-lg text-[#1E1E1E]/70">
            Professional lawn care tailored to your needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-xl p-6 lg:p-8 bg-white/60 backdrop-blur-md border border-white/70 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-transparent hover:border-t-[#6B7C2E] group"
            >
              <service.icon className="w-10 h-10 lg:w-12 lg:h-12 text-[#6B7C2E] mb-4 lg:mb-6 stroke-[1.5] group-hover:scale-110 transition-transform" />
              <h3 className="text-lg lg:text-xl font-semibold text-[#1E1E1E] mb-2">
                {service.name}
              </h3>
              <p className="text-sm lg:text-base text-[#1E1E1E]/70">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-12 bg-white [clip-path:polygon(0_0,100%_15%,100%_100%,0_100%)]"></div>
    </section>
  );
}