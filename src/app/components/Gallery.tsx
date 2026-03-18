import { useEffect, useMemo, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IMAGES } from '@/config/images';

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  position: number;
};

export function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [showAll, setShowAll] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch(`${apiUrl}/gallery`);
        if (!response.ok) {
          throw new Error('No se pudo cargar la galería');
        }

        const payload = await response.json();
        const rows: GalleryImage[] = Array.isArray(payload.data) ? payload.data : [];
        setGalleryImages(rows);
      } catch (error) {
        setGalleryImages([]);
      }
    };

    loadGallery();
  }, [apiUrl]);

  const resolvedImages = useMemo(() => {
    if (galleryImages.length > 0) {
      return galleryImages;
    }

    return IMAGES.gallery.map((image, index) => ({
      id: index + 1,
      src: image.src,
      alt: image.alt,
      position: index + 1,
    }));
  }, [galleryImages]);

  const visibleImages = showAll ? resolvedImages : resolvedImages.slice(0, 9);
  const hasMoreThanNine = resolvedImages.length > 9;

  return (
    <section id="gallery" className="relative bg-white py-16 lg:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(217,232,197,0.45),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(217,232,197,0.35),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,rgba(59,74,16,0.04)_0px,rgba(59,74,16,0.04)_1px,transparent_1px,transparent_12px)]" />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-2xl lg:text-4xl font-bold text-[#1E1E1E] mb-4">
            Our Work
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {visibleImages.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-square"
            >
              <ImageWithFallback
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* View More Link */}
        {hasMoreThanNine && (
          <div className="text-center mt-8 lg:mt-12">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-block text-[#6B7C2E] hover:text-[#3B4A10] transition-colors underline underline-offset-4 text-sm lg:text-base"
            >
              {showAll ? 'Ver menos' : `Ver más (${resolvedImages.length - 9})`}
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-12 bg-[#1E2A10] [clip-path:polygon(0_20%,100%_0,100%_100%,0_100%)]"></div>
    </section>
  );
}