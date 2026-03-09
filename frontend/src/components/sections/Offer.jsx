import React from "react";
import { Link } from "react-router-dom"; // Import Link
import creditCard from "../../assets/images/creditCard.jpg";

export const Offer = ({ t, className = "" }) => {
  return (
    <section
      id="features"
      className={`py-16 bg-gray-50 dark:bg-gray-800 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 lg:p-12 border border-green-200 dark:border-gray-600">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold mb-4">
                {t("landing.featuredOffer.limitedTime")}
              </span>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("landing.featuredOffer.title")}
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                {t("landing.featuredOffer.description")}
              </p>
              <Link to="/login"> {/* Wrap button with Link */}
                <button className="px-8 py-3 bg-blue-500 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">
                  {t("landing.featuredOffer.cta")}
                </button>
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src={creditCard}
                alt={t("landing.featuredOffer.imageAlt")}
                className="w-72 h-44 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;