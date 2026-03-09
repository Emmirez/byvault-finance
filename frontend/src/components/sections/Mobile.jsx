
import React from "react";
import { Shield, CreditCard, TrendingUp } from "lucide-react";

export const Mobile = ({ t, className = "" }) => {
  const features = [
    {
      icon: Shield,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
      title: t("landing.mobileApp.features.biometricLogin.title"),
      description: t("landing.mobileApp.features.biometricLogin.description"),
    },
    {
      icon: CreditCard,
      iconBg: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
      title: t("landing.mobileApp.features.mobileCheckDeposit.title"),
      description: t("landing.mobileApp.features.mobileCheckDeposit.description"),
    },
    {
      icon: TrendingUp,
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
      title: t("landing.mobileApp.features.spendingInsights.title"),
      description: t("landing.mobileApp.features.spendingInsights.description"),
    },
  ];

  return (
    <section className={`py-20 bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t("landing.mobileApp.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {t("landing.mobileApp.description")}
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-10 h-10 ${feature.iconBg} rounded-lg flex items-center justify-center mr-4`}>
                    <feature.icon className={feature.iconColor} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 mt-8">
              <button className="flex items-center bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.67 3.51 7.94 9.05 7.66c1.1.07 1.9.64 2.53.85 1.34.53 1.97.51 3.08-.07 1.21-.64 1.9-.78 2.98-.73 2.33.08 4.01 1.19 4.69 3.03-4.33 2.07-3.37 7.2.8 8.54-.75.92-1.09 1.45-2.98 2.16zM12.03 7.48c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                {t("landing.mobileApp.appStore")}
              </button>
              <button className="flex items-center bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.863 2.91l10.937 6.333-2.301 2.301-8.636-8.634z" />
                </svg>
                {t("landing.mobileApp.googlePlay")}
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1611095973763-414019e72400?auto=format&fit=crop&w=800&q=80"
              alt={t("landing.mobileApp.imageAlt")}
              className="w-full max-w-md rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mobile;