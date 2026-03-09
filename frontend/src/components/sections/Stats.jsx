import React from "react";
import { TrendingUp, Users, Award, Clock } from "lucide-react";

export const Stats = ({ t, className = "" }) => {
  const stats = [
    { 
      value: "10M+", 
      label: t("landing.stats.customers"),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-white/20"
    },
    { 
      value: "$250B+", 
      label: t("landing.stats.assetsManaged"),
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-white/20"
    },
    { 
      value: "99%", 
      label: t("landing.stats.customerSatisfaction"),
      icon: Award,
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-white/20"
    },
    { 
      value: "50+", 
      label: t("landing.stats.yearsExperience"),
      icon: Clock,
      color: "from-rose-500 to-pink-500",
      iconBg: "bg-white/20"
    },
  ];

  return (
    <section
      className={`py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white relative overflow-hidden ${className}`}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Value */}
                  <div className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {stat.label}
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-3 h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Stats;