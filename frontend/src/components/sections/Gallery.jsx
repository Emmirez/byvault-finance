import React from "react";

export const Gallery = ({ t, className = "" }) => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
      alt: t("landing.imageGallery.atmMachineAlt"),
      caption: t("landing.imageGallery.atmAccess"),
    },
    {
      src: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80",
      alt: t("landing.imageGallery.bankingServicesAlt"),
      caption: t("landing.imageGallery.personalBanking"),
    },
    {
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      alt: t("landing.imageGallery.digitalBankingAlt"),
      caption: t("landing.imageGallery.mobileBanking"),
    },
  ];

  return (
    <div className={`grid md:grid-cols-3 gap-8 ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative h-64 rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h4 className="text-white font-semibold">{image.caption}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
