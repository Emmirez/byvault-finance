// components/sections/Disclosures.jsx
import React from "react";
import { Shield, ChevronRight } from "lucide-react";
import { DisclosureCard } from "../cards/DisclosureCard";

export const Disclosures = ({ t, className = "" }) => {
  const items = [
    {
      title: t("landing.financialDisclosures.investingRisksTitle"),
      desc: t("landing.financialDisclosures.investingRisksDescription"),
    },
    {
      title: t("landing.financialDisclosures.securitiesProducts"),
      desc: t("landing.financialDisclosures.securitiesProductsDescription"),
    },
    {
      title: t("landing.financialDisclosures.byvaultfinancePrivateBank"),
      desc: t("landing.financialDisclosures.byvaultfinancePrivateBankDescription"),
    },
    {
      title: t("landing.financialDisclosures.insuranceProducts"),
      desc: t("landing.financialDisclosures.insuranceProductsDescription"),
    },
    {
      title: t("landing.financialDisclosures.bankingProducts"),
      desc: t("landing.financialDisclosures.bankingProductsDescription"),
    },
  ];

  return (
    <section className={`py-12 md:py-16 bg-gray-50 dark:bg-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stack on mobile, side-by-side on larger screens */}
        <div className="flex flex-col lg:flex-row lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Image Section - Full width on mobile */}
          <div className="w-full lg:w-auto order-2 lg:order-1">
            <div className="relative rounded-xl lg:rounded-2xl overflow-hidden shadow-lg lg:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
                alt={t("landing.financialDisclosures.financialSecurityAlt")}
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Shield size={20} lg:size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base lg:text-lg">
                      {t("landing.financialDisclosures.memberSipcFdic")}
                    </h4>
                    <p className="text-blue-100 text-xs lg:text-sm">
                      {t("landing.financialDisclosures.securitiesDepositsInsured")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Section - Full width on mobile */}
          <div className="w-full lg:w-auto order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
              {t("landing.financialDisclosures.importantFinancialInformation")}
            </h2>

            <div className="bg-white dark:bg-gray-900 rounded-lg lg:rounded-xl p-4 sm:p-6 shadow-md lg:shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
                {t("landing.financialDisclosures.onlineBankingServiceAgreement")}
              </h3>

              <div className="space-y-3 lg:space-y-4 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                {items.map((item, i) => (
                  <p key={i} className="leading-relaxed">
                    <span className="font-semibold block sm:inline">{item.title}:</span>{" "}
                    <span className="block sm:inline mt-1 sm:mt-0">{item.desc}</span>
                  </p>
                ))}

                <p className="font-semibold text-gray-700 dark:text-gray-400 pt-3 lg:pt-4 border-t border-gray-200 dark:border-gray-700 mt-3">
                  {t("landing.financialDisclosures.disclaimer")}
                </p>
              </div>

              {/* Disclosure Cards - Stack on mobile, side-by-side on larger screens */}
              <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-auto">
                  <DisclosureCard 
                    text={t("landing.financialDisclosures.sipcInsured")}
                    iconColor="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-100 dark:bg-blue-900"
                    className="w-full sm:w-auto"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <DisclosureCard 
                    text={t("landing.financialDisclosures.fdicInsured")}
                    iconColor="text-green-600 dark:text-green-400"
                    bgColor="bg-green-100 dark:bg-green-900"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-6">
              <a href="/terms-conditions" className="text-blue-600 dark:text-blue-400 font-semibold flex items-center hover:underline text-sm sm:text-base">
                {t("landing.financialDisclosures.viewFullTerms")}
                <ChevronRight size={16} sm:size={18} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};