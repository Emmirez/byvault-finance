import React from "react";
import { Shield, Phone, TrendingUp } from "lucide-react";

export const Features = ({ t, className = "" }) => {
  const features = [
    {
      icon: Shield,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      title: t("landing.features.secure"),
      description: t("landing.features.secureDesc"),
    },
    {
      icon: Phone,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      title: t("landing.features.support"),
      description: t("landing.features.supportDesc"),
    },
    {
      icon: TrendingUp,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      title: t("landing.features.rates"),
      description: t("landing.features.ratesDesc"),
    },
  ];

  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      alt: "Banking security and technology",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Digital banking interface",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80",
      alt: "Financial data analysis",
    },
  ];

  return (
    <section className={`py-20 bg-gray-50 dark:bg-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.features.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-16 h-16 ${feature.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <feature.icon className={feature.iconColor} size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* 3-Image Gallery Container */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 shadow-xl">
            {/* Simple 3-image grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-xl shadow-lg group"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-56 md:h-64 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Minimal overlay - no text, just visual effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 transition-all duration-300 rounded-xl"></div>
                </div>
              ))}
            </div>

            {/* Optional: Minimal decorative dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {galleryImages.map((image) => (
                <div
                  key={`dot-${image.id}`}
                  className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
