export type ConfigImage = {
  src: string;
  alt: string;
  category?: string;
};

export const IMAGES = {
    hero: {
        src: '/images/HeroFondo.jpg',
        alt: 'Professionally manicured residential lawn in Memphis, TN — Memphis Lawn Service',
    } as ConfigImage,
    gallery: [
        {
            src: '/images/IMG_9600.jpg',
            alt: 'Professional lawn mowing',
            category: 'lawn',
        },
        {
            src: '/images/img_002.jpg',
            alt: 'Professional lawn mowing',
            category: 'lawn',
        },
        {
            src: '/images/IMG_4863.jpg',
            alt: 'Trimmed bushes and landscaping',
            category: 'trimming',
        },
        {
            src: '/images/IMG_4864.jpg',
            alt: 'Mulch garden beds',
            category: 'mulching',
        },
        {
            src: '/images/IMG_4883.jpg',
            alt: 'Colorful flower garden',
            category: 'flowers',
        },
        {
            src: '/images/IMG_5158.jpg',
            alt: 'Tree trimming service',
            category: 'trimming',
        },
        {
            src: '/images/IMG_6134.jpg',
            alt: 'Manicured lawn',
            category: 'lawn',
        },
        //acá se puede agregar más imagenes en seguida, solo hay que respetar el formato src, alt y category
    ] as ConfigImage[],
};
