/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/Analytics.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Sun,
  Moon,
  ArrowLeft,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Bell,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { analyticsService } from "../../../services/analyticsService";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell";

const Analytics = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30days");
  const [overview, setOverview] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [transactionAnalytics, setTransactionAnalytics] = useState(null);
  const [kycAnalytics, setKycAnalytics] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);

      const [
        overviewRes,
        userRes,
        transactionRes,
        kycRes,
        financialRes,
        activitiesRes,
      ] = await Promise.all([
        analyticsService.getOverviewStats(),
        analyticsService.getUserAnalytics(timeRange),
        analyticsService.getTransactionAnalytics(timeRange),
        analyticsService.getKYCAnalytics(),
        analyticsService.getFinancialSummary(),
        analyticsService.getRecentActivities(10),
      ]);

      setOverview(overviewRes.stats || overviewRes);
      setUserAnalytics(userRes.analytics || userRes);
      setTransactionAnalytics(transactionRes.analytics || transactionRes);
      setKycAnalytics(kycRes.analytics || kycRes);
      setFinancial(financialRes.financial || financialRes);
      setRecentActivities(activitiesRes.activities || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllAnalytics();
  }, [timeRange]);

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
          <Icon className="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        {change && (
          <span
            className={`flex items-center gap-1 text-xs sm:text-sm ${
              change > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
        {title}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <RefreshCw size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 overflow-x-hidden">
        {/* Header */}

        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-3 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2 sm:mr-4"
                aria-label="Go back"
              >
                <ArrowLeft
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </button>

              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex-1 truncate">
                Analytics Dashboard
              </h1>

              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="7days">7d</option>
                  <option value="30days">30d</option>
                  <option value="90days">90d</option>
                  <option value="year">1y</option>
                </select>

                <button
                  onClick={toggleDarkMode}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? (
                    <Sun size={18} className="text-white" />
                  ) : (
                    <Moon size={18} />
                  )}
                </button>

                <AdminAlertBell />

                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Total Users"
              value={overview?.users?.total?.toLocaleString() || 0}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Volume"
              value={`$${overview?.transactions?.volume?.toLocaleString() || 0}`}
              icon={DollarSign}
              color="green"
            />
            <StatCard
              title="Pending KYC"
              value={overview?.kyc?.pending || 0}
              icon={FileText}
              color="yellow"
            />
            <StatCard
              title="Active Cards"
              value={overview?.cards?.active || 0}
              icon={CreditCard}
              color="purple"
            />
          </div>

          {/* User Growth Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                User Growth
              </h3>
              <div className="w-full h-[250px] sm:h-[300px] min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userAnalytics?.growth || []}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Users by Role
              </h3>
              <div className="w-full h-[250px] sm:h-[300px] min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <Pie
                      data={userAnalytics?.byRole || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="_id"
                    >
                      {(userAnalytics?.byRole || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transaction Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Transaction Volume
              </h3>
              <div className="w-full h-[250px] sm:h-[300px] min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transactionAnalytics?.volumeOverTime || []}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Transactions by Type
              </h3>
              <div className="w-full h-[250px] sm:h-[300px] min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <Pie
                      data={transactionAnalytics?.byType || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="_id"
                    >
                      {(transactionAnalytics?.byType || []).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* KYC Stats and Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                KYC Status Distribution
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {kycAnalytics?.byStatus?.map((item, index) => (
                  <div key={item._id}>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="capitalize text-gray-600 dark:text-gray-400">
                        {item._id}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                      <div
                        className={`h-full rounded-full ${
                          item._id === "verified"
                            ? "bg-green-500"
                            : item._id === "pending"
                              ? "bg-yellow-500"
                              : item._id === "rejected"
                                ? "bg-red-500"
                                : "bg-blue-500"
                        }`}
                        style={{
                          width: `${(item.count / (kycAnalytics?.byStatus?.reduce((acc, curr) => acc + curr.count, 0) || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Financial Summary
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Total Fiat
                  </span>
                  <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                    ${financial?.totalFiat?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Total BTC
                  </span>
                  <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                    ₿{financial?.totalBTC?.toFixed(4) || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Daily Revenue
                  </span>
                  <span className="text-base sm:text-xl font-bold text-green-600">
                    ${financial?.dailyRevenue?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Recent Platform Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type?.includes("login")
                        ? "bg-green-100 dark:bg-green-900/20"
                        : activity.type?.includes("kyc")
                          ? "bg-yellow-100 dark:bg-yellow-900/20"
                          : activity.type?.includes("card")
                            ? "bg-purple-100 dark:bg-purple-900/20"
                            : "bg-blue-100 dark:bg-blue-900/20"
                    }`}
                  >
                    <Activity
                      size={16}
                      className={
                        activity.type?.includes("login")
                          ? "text-green-600"
                          : activity.type?.includes("kyc")
                            ? "text-yellow-600"
                            : activity.type?.includes("card")
                              ? "text-purple-600"
                              : "text-blue-600"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.user?.firstName} {activity.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdminBottomNav />
      </div>
    </div>
  );
};

export default Analytics;
