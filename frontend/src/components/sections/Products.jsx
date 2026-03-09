import React from "react";
import {
  ChevronRight,
  CreditCard,
  TrendingUp,
  Home,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export const Product = ({ t, className = "" }) => {
  const products = [
    {
      icon: CreditCard,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      title: t("navigation.checking"),
      description: t("landing.products.checking.description"),
    },
    {
      icon: TrendingUp,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      title: t("navigation.savings"),
      description: t("landing.products.savings.description"),
    },
    {
      icon: CreditCard,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      title: t("navigation.creditCards"),
      description: t("landing.products.creditCards.description"),
    },
    {
      icon: Home,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      title: t("landing.products.homeLoans.title"),
      description: t("landing.products.homeLoans.description"),
    },
    {
      icon: Briefcase,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      title: t("navigation.business"),
      description: t("landing.products.business.description"),
    },
    {
      icon: GraduationCap,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      title: t("landing.products.student.title"),
      description: t("landing.products.student.description"),
    },
  ];

  return (
    <section className={`py-20 bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.products.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("landing.products.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-lg dark:hover:shadow-gray-700/30 transition"
            >
              <div
                className={`w-12 h-12 ${product.iconBg} rounded-lg flex items-center justify-center mb-4`}
              >
                <product.icon className={product.iconColor} size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {product.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {product.description}
              </p>
              <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 font-semibold flex items-center hover:underline"
              >
                {t("common.learnMore")}
                <ChevronRight size={20} className="ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Product;
