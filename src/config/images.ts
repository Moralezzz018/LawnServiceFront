export type ConfigImage = {
  src: string;
  alt: string;
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
        },
        {
            src: '/images/img_002.jpg',
            alt: 'Professional lawn mowing',
        },
        {
            src: '/images/IMG_4863.jpg',
            alt: 'Trimmed bushes and landscaping',
        },
        {
            src: '/images/IMG_4864.jpg',
            alt: 'Mulch garden beds',
        },
        {
            src: '/images/IMG_4883.jpg',
            alt: 'Colorful flower garden',
        },
        {
            src: '/images/IMG_5158.jpg',
            alt: 'Tree trimming service',
        },
        {
            src: '/images/IMG_6134.jpg',
            alt: 'Manicured lawn',
        },
        //acá se puede agregar más imagenes en seguida, solo hay que respetar el formato src y alt
    ] as ConfigImage[],
};
