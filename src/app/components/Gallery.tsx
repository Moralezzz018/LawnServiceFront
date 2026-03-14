import { ImageWithFallback } from './figma/ImageWithFallback';

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1734303023481-7508b5c9f1ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXduJTIwbW93aW5nJTIwc2VydmljZXxlbnwxfHx8fDE3NzM0ODE0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Professional lawn mowing',
  },
  {
    url: 'https://images.unsplash.com/photo-1759509474971-0f1f35a29efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBsYW5kc2NhcGluZyUyMHRyaW1tZWQlMjBidXNoZXN8ZW58MXx8fHwxNzczNTExNjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Trimmed bushes and landscaping',
  },
  {
    url: 'https://images.unsplash.com/photo-1599776765440-3504b0d25653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWxjaCUyMGdhcmRlbiUyMGJlZHN8ZW58MXx8fHwxNzczNTExNjY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Mulch garden beds',
  },
  {
    url: 'https://images.unsplash.com/photo-1615046526364-ccfd92cd45bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZsb3dlciUyMGdhcmRlbnxlbnwxfHx8fDE3NzM1MTE2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Colorful flower garden',
  },
  {
    url: 'https://images.unsplash.com/photo-1765064520254-229dbf995bcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwdHJpbW1pbmclMjBsYW5kc2NhcGluZ3xlbnwxfHx8fDE3NzM1MTE2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Tree trimming service',
  },
  {
    url: 'https://images.unsplash.com/photo-1761013320045-d29e4f10bcbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5pY3VyZWQlMjBsYXduJTIwc3VidXJiYW4lMjBob21lfGVufDF8fHx8MTc3MzUxMTY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Manicured lawn',
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-white py-16 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-[#1E1E1E] mb-4">
            Our Work
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 aspect-square"
            >
              <ImageWithFallback
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center mt-8 lg:mt-12">
          <a
            href="#gallery"
            className="inline-block text-[#6B7C2E] hover:text-[#3B4A10] transition-colors underline underline-offset-4 text-sm lg:text-base"
          >
            View More
          </a>
        </div>
      </div>
    </section>
  );
}