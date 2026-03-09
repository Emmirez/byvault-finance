// components/sections/CurrencyTable.jsx
import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CurrencyTable = ({ t, className = "" }) => {
  const [currencies, setCurrencies] = useState([
    {
      id: 1,
      name: "US Dollar",
      code: "USD",
      amount: "120.54",
      change: "+0.50%",
      trend: "up",
      flag: "https://flagcdn.com/w40/us.png",
    },
    {
      id: 2,
      name: "Japanese Yen",
      code: "JPY",
      amount: "134.76",
      change: "+0.24%",
      trend: "up",
      flag: "https://flagcdn.com/w40/jp.png",
    },
    {
      id: 3,
      name: "British Pound",
      code: "GBP",
      amount: "245.10",
      change: "-0.30%",
      trend: "down",
      flag: "https://flagcdn.com/w40/gb.png",
    },
    {
      id: 4,
      name: "New Zealand Dollar",
      code: "NZD",
      amount: "0.7564",
      change: "-0.063%",
      trend: "down",
      flag: "https://flagcdn.com/w40/nz.png",
    },
    {
      id: 5,
      name: "Canadian Dollar",
      code: "CAD",
      amount: "1.2741",
      change: "-0.76%",
      trend: "down",
      flag: "https://flagcdn.com/w40/ca.png",
    },
    {
      id: 6,
      name: "Swiss Franc",
      code: "CHF",
      amount: "15.063",
      change: "+0.26%",
      trend: "up",
      flag: "https://flagcdn.com/w40/ch.png",
    },
  ]);
  const navigate = useNavigate();

  // Simulate live updates (in a real app, you would connect to a WebSocket API)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrencies((prev) =>
        prev.map((currency) => {
          // Generate small random changes
          const randomChange = (Math.random() - 0.5) * 0.2;
          const newAmount = parseFloat(currency.amount) + randomChange;
          const changeSign = randomChange >= 0 ? "+" : "";
          const changePercent = `${changeSign}${((randomChange * 100) / parseFloat(currency.amount)).toFixed(2)}%`;

          return {
            ...currency,
            amount: newAmount.toFixed(4),
            change: changePercent,
            trend: randomChange >= 0 ? "up" : "down",
          };
        }),
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const generateSparkline = (trend) => {
    const points = 8;
    const baseHeight = 16;
    const variance = trend === "up" ? 1.3 : 0.7;

    return Array.from({ length: points }, (_, i) => {
      const progress = i / points;
      const noise = Math.sin(i * 0.8) * 2;
      return baseHeight * variance * (0.4 + progress * 0.6) + noise;
    });
  };

  return (
    <section className={`py-16 bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.currency.liveExchangeRates") || "Live Exchange Rates"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.currency.realTimeUpdates") ||
              "Real-time foreign exchange rates updated every minute"}
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="col-span-3 md:col-span-3 font-semibold text-gray-900 dark:text-white">
              {t("landing.currency.currency") || "Currency"}
            </div>
            <div className="col-span-3 md:col-span-3 font-semibold text-gray-900 dark:text-white">
              {t("landing.currency.amount") || "Amount"}
            </div>
            <div className="col-span-3 md:col-span-3 font-semibold text-gray-900 dark:text-white">
              {t("landing.currency.change") || "Change (24h)"}
            </div>
            <div className="col-span-3 md:col-span-3 font-semibold text-gray-900 dark:text-white">
              {t("landing.currency.chart") || "Chart (24h)"}
            </div>
          </div>

          {/* Table Rows */}
          {currencies.map((currency) => (
            <div
              key={currency.id}
              className="grid grid-cols-12 px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent dark:hover:from-blue-900/10 dark:hover:to-transparent transition-all duration-300"
            >
              {/* Currency Name */}
              <div className="col-span-12 md:col-span-3 mb-2 md:mb-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md mr-3 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <img
                      src={currency.flag}
                      alt={currency.code}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {currency.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {currency.code}
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="col-span-4 md:col-span-3 mb-2 md:mb-0 flex items-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                  {currency.amount}
                </div>
              </div>

              {/* Change */}
              <div className="col-span-4 md:col-span-3 mb-2 md:mb-0 flex items-center">
                <div
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg font-semibold ${
                    currency.trend === "up"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {currency.trend === "up" ? (
                    <TrendingUp size={16} className="mr-1.5" />
                  ) : (
                    <TrendingDown size={16} className="mr-1.5" />
                  )}
                  <span>{currency.change}</span>
                </div>
              </div>

              {/* Chart Indicator */}
              <div className="col-span-4 md:col-span-3 mb-2 md:mb-0 flex items-center">
                <div className="w-24 h-8 relative">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 96 32"
                    className="overflow-visible"
                  >
                    <defs>
                      <linearGradient
                        id={`gradient-${currency.id}`}
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor={
                            currency.trend === "up" ? "#10b981" : "#ef4444"
                          }
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            currency.trend === "up" ? "#10b981" : "#ef4444"
                          }
                          stopOpacity="0.05"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0,32 ${generateSparkline(currency.trend)
                        .map((y, i) => `L ${i * 12},${32 - y}`)
                        .join(" ")} L 96,32 Z`}
                      fill={`url(#gradient-${currency.id})`}
                    />
                    <path
                      d={`M ${generateSparkline(currency.trend)
                        .map((y, i) => `${i * 12},${32 - y}`)
                        .join(" L ")}`}
                      fill="none"
                      stroke={currency.trend === "up" ? "#10b981" : "#ef4444"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Last Updated & Info */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-2 md:mb-0">
            {t("landing.currency.lastUpdated") || "Last updated:"}{" "}
            {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>{t("landing.currency.positive") || "Positive"}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>{t("landing.currency.negative") || "Negative"}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-300 dark:border-blue-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("landing.currency.chatSupport") ||
                  "Chat with us, we're online!"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("landing.currency.instantSupport") ||
                  "Get instant support for currency exchange"}
              </p>
            </div>

            <button
              onClick={() => navigate("/contact-support")}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
            >
              <span className="mr-2">💬</span>
              {t("landing.currency.startChat") || "Start Live Chat"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrencyTable;
