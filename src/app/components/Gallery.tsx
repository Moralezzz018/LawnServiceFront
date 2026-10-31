import { useCallback, useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IMAGES } from '@/config/images';
import { getApiUrl } from '@/config/api';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  position: number;
  category: string;
};

type CategoryTab = {
  key: string;
  label: string;
};

// ─── Categorías (deben coincidir con el backend) ──────────────────────────────

const CATEGORY_TABS: CategoryTab[] = [
  { key: 'all',      label: 'All Work'       },
  { key: 'lawn',     label: 'Lawn Service'   },
  { key: 'trimming', label: 'Tree & Bush Trimming' },
  { key: 'plants',   label: 'Plants Remove'  },
  { key: 'mulching', label: 'Mulching'       },
  { key: 'flowers',  label: 'Flowers'        },
  { key: 'cleanup',  label: 'Cleanup'        },
  { key: 'general',  label: 'General'        },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────

type LightboxProps = {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const image = images[currentIndex];

  // Cerrar con Escape, navegar con flechas
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  // Bloquear scroll del body mientras lightbox está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Contenedor imagen — evita cerrar al hacer clic en la imagen */}
      <div
        className="relative max-h-[90dvh] max-w-[92vw] md:max-w-[85vw] lg:max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[85dvh] w-auto rounded-xl object-contain shadow-2xl"
        />

        {/* Caption */}
        <p className="mt-2 text-center text-sm text-white/70">{image.alt}</p>

        {/* Contador */}
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
          {currentIndex + 1} / {images.length}
        </span>

        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Flecha anterior */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Imagen anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80 md:left-6 md:h-12 md:w-12"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Flecha siguiente */}
      {currentIndex < images.length - 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Imagen siguiente"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80 md:right-6 md:h-12 md:w-12"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

// ─── Componente principal Gallery ─────────────────────────────────────────────

export function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const apiUrl = getApiUrl();

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch(`${apiUrl}/gallery`);
        if (!response.ok) throw new Error('No se pudo cargar la galería');
        const payload = await response.json();
        const rows: GalleryImage[] = Array.isArray(payload.data) ? payload.data : [];
        setGalleryImages(rows);
      } catch {
        setGalleryImages([]);
      }
    };

    loadGallery();
  }, [apiUrl]);

  // Imágenes base (API o fallback estático)
  const resolvedImages = useMemo<GalleryImage[]>(() => {
    if (galleryImages.length > 0) return galleryImages;

    return IMAGES.gallery.map((image, index) => ({
      id: index + 1,
      src: image.src,
      alt: image.alt,
      position: index + 1,
      category: image.category ?? 'general',
    }));
  }, [galleryImages]);

  // Filtrar por categoría activa
  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return resolvedImages;
    return resolvedImages.filter((img) => img.category === activeCategory);
  }, [resolvedImages, activeCategory]);

  // Sólo mostrar tabs que tengan imágenes (+ "All Work" siempre)
  const activeTabs = useMemo(() => {
    const categoriesWithImages = new Set(resolvedImages.map((img) => img.category));
    return CATEGORY_TABS.filter(
      (tab) => tab.key === 'all' || categoriesWithImages.has(tab.key)
    );
  }, [resolvedImages]);

  const INITIAL_COUNT = 9;
  const visibleImages = showAll ? filteredImages : filteredImages.slice(0, INITIAL_COUNT);
  const hasMore = filteredImages.length > INITIAL_COUNT;

  // Resetear "ver más" cuando cambia categoría
  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setShowAll(false);
  };

  // Lightbox handlers
  const openLightbox = useCallback((indexInVisible: number) => {
    // Calculamos el índice en filteredImages (no en visibleImages)
    const image = visibleImages[indexInVisible];
    const realIndex = filteredImages.findIndex((img) => img.id === image.id);
    setLightboxIndex(realIndex);
  }, [visibleImages, filteredImages]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null && i < filteredImages.length - 1 ? i + 1 : i)), [filteredImages.length]);

  return (
    <>
      <section id="gallery" className="relative bg-white py-16 lg:py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(217,232,197,0.45),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(217,232,197,0.35),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,rgba(59,74,16,0.04)_0px,rgba(59,74,16,0.04)_1px,transparent_1px,transparent_12px)]" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <h2 className="text-2xl lg:text-4xl font-bold text-[#1E1E1E] mb-3">
              Our Work
            </h2>
            <p className="text-base text-[#1E1E1E]/65">
              Real results from real jobs — browse by service type
            </p>
          </div>

          {/* Tabs de categoría — scroll horizontal en móvil */}
          {activeTabs.length > 1 && (
            <div className="mb-8 lg:mb-10 -mx-6 px-6 lg:mx-0 lg:px-0 overflow-x-auto">
              <div className="flex gap-2 pb-1 min-w-max lg:min-w-0 lg:flex-wrap lg:justify-center">
                {activeTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleCategoryChange(tab.key)}
                    className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeCategory === tab.key
                        ? 'bg-[#6B7C2E] text-white shadow-md'
                        : 'bg-white border border-[#D9E8C5] text-[#3B4A10] hover:bg-[#D9E8C5]'
                    }`}
                  >
                    {tab.label}
                    {tab.key !== 'all' && (
                      <span className={`ml-1.5 text-xs ${activeCategory === tab.key ? 'opacity-70' : 'opacity-50'}`}>
                        ({resolvedImages.filter((img) => img.category === tab.key).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grid de imágenes */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-16 text-[#1E1E1E]/50">
              <p className="text-base">No photos in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
              {visibleImages.map((image, index) => (
                <button
                  key={`${image.id}-${index}`}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-square text-left"
                  aria-label={`Ver imagen: ${image.alt}`}
                >
                  <ImageWithFallback
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay hover con ícono zoom */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 drop-shadow" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Botón Ver más */}
          {hasMore && (
            <div className="text-center mt-8 lg:mt-10">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="inline-block text-[#6B7C2E] hover:text-[#3B4A10] transition-colors underline underline-offset-4 text-sm lg:text-base"
              >
                {showAll
                  ? 'Show less'
                  : `Show more (${filteredImages.length - INITIAL_COUNT} more)`}
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-12 bg-[#1E2A10] [clip-path:polygon(0_20%,100%_0,100%_100%,0_100%)]"></div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  );
}
