/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
// src/pages/user/FinancialInsights/FinancialInsights.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Lightbulb,
  Target,
  CreditCard,
  ShoppingBag,
  Coffee,
  Home,
  Car,
  Sparkles,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { dashboardService } from "../../../services/dashhboardService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const FinancialInsights = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);

  const periods = ["This Week", "This Month", "Last 3 Months", "This Year"];

  useEffect(() => {
    fetchTransactionData();
  }, [selectedPeriod]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      // Fetch more transactions for analysis
      const data = await dashboardService.getRecentTransactions(100);
      setTransactions(data || []);
      
      // Generate AI insights based on transaction data
      generateInsights(data || []);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (txs) => {
    const newInsights = [];
    
    // Calculate this month's totals
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthTxs = txs.filter(tx => new Date(tx.createdAt) >= firstDayOfMonth);
    const lastMonthTxs = txs.filter(tx => {
      const date = new Date(tx.createdAt);
      return date >= firstDayOfLastMonth && date <= lastDayOfLastMonth;
    });

    const thisMonthIncome = thisMonthTxs
      .filter(tx => tx.type === "deposit")
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const thisMonthExpenses = thisMonthTxs
      .filter(tx => tx.type !== "deposit")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const lastMonthIncome = lastMonthTxs
      .filter(tx => tx.type === "deposit")
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const lastMonthExpenses = lastMonthTxs
      .filter(tx => tx.type !== "deposit")
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate savings rate
    const savingsRate = thisMonthIncome > 0 
      ? ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome * 100).toFixed(1)
      : 0;

    // Insight 1: Savings habit
    if (savingsRate > 30) {
      newInsights.push({
        id: 1,
        title: "🌟 Great Savings Habit!",
        description: `You've saved ${savingsRate}% of your income this month. That's excellent! Keep up the great work.`,
        type: "positive",
        icon: Target,
      });
    } else if (savingsRate > 15) {
      newInsights.push({
        id: 1,
        title: "📈 Good Progress",
        description: `You're saving ${savingsRate}% of your income. Try to aim for 20% to build a stronger safety net.`,
        type: "positive",
        icon: Target,
      });
    } else {
      newInsights.push({
        id: 1,
        title: "💡 Savings Opportunity",
        description: `Your savings rate is ${savingsRate}%. Consider setting up automatic transfers to boost your savings.`,
        type: "warning",
        icon: Target,
      });
    }

    // Insight 2: Compare with last month
    const expenseChange = lastMonthExpenses > 0 
      ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1)
      : 0;

    if (expenseChange > 20) {
      newInsights.push({
        id: 2,
        title: "⚠️ Expense Alert",
        description: `Your expenses increased by ${expenseChange}% compared to last month. Review your spending in categories.`,
        type: "warning",
        icon: ShoppingBag,
      });
    } else if (expenseChange < -10) {
      newInsights.push({
        id: 2,
        title: "🎉 Great Job!",
        description: `You reduced your expenses by ${Math.abs(expenseChange)}% compared to last month. Keep it up!`,
        type: "positive",
        icon: TrendingDown,
      });
    } else {
      newInsights.push({
        id: 2,
        title: "📊 Stable Spending",
        description: `Your expenses are stable compared to last month (${expenseChange}% change).`,
        type: "positive",
        icon: PieChart,
      });
    }

    // Insight 3: Top spending category
    const categorySpending = {};
    thisMonthTxs.filter(tx => tx.type !== "deposit").forEach(tx => {
      const category = tx.category || "Other";
      categorySpending[category] = (categorySpending[category] || 0) + tx.amount;
    });

    const topCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory) {
      newInsights.push({
        id: 3,
        title: `Top Spending: ${topCategory[0]}`,
        description: `You spent $${topCategory[1].toFixed(2)} on ${topCategory[0]} this month. ${
          topCategory[1] > thisMonthExpenses * 0.5 
            ? "This is more than 50% of your total expenses." 
            : "Consider setting a budget for this category."
        }`,
        type: "info",
        icon: ShoppingBag,
      });
    }

    setInsights(newInsights);
  };

  const getDateRange = () => {
    const now = new Date();
    switch(selectedPeriod) {
      case "This Week":
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return { start: weekAgo, end: new Date() };
      case "This Month":
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: firstDay, end: new Date() };
      case "Last 3 Months":
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        return { start: threeMonthsAgo, end: new Date() };
      case "This Year":
        const firstDayYear = new Date(now.getFullYear(), 0, 1);
        return { start: firstDayYear, end: new Date() };
      default:
        return { start: new Date(0), end: new Date() };
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const { start, end } = getDateRange();
    const txDate = new Date(tx.createdAt);
    return txDate >= start && txDate <= end;
  });

  const totalIncome = filteredTransactions
    .filter(tx => tx.type === "deposit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(tx => tx.type !== "deposit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)
    : 0;

  const budgetUsed = totalIncome > 0 
    ? (totalExpenses / totalIncome * 100).toFixed(1)
    : 0;

  // Calculate spending by category
  const spendingCategories = [];
  const categoryMap = {};

  filteredTransactions.filter(tx => tx.type !== "deposit").forEach(tx => {
    const category = tx.category || "Other";
    if (!categoryMap[category]) {
      categoryMap[category] = {
        name: category,
        amount: 0,
        icon: getCategoryIcon(category),
        color: getCategoryColor(category),
        gradient: getCategoryGradient(category),
      };
    }
    categoryMap[category].amount += tx.amount;
  });

  Object.values(categoryMap).forEach(cat => {
    cat.percentage = totalExpenses > 0 
      ? Math.round((cat.amount / totalExpenses) * 100)
      : 0;
    spendingCategories.push(cat);
  });

  // Sort by amount descending
  spendingCategories.sort((a, b) => b.amount - a.amount);

  const tips = [
    "Set up automatic savings transfers on payday",
    "Review and cancel unused subscriptions",
    "Use the 50/30/20 budgeting rule",
    "Track your daily expenses with our app",
    "Create an emergency fund with 3-6 months of expenses",
    "Consider investing for long-term growth",
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  // Helper functions for categories
  function getCategoryIcon(category) {
    const icons = {
      shopping: ShoppingBag,
      food: Coffee,
      dining: Coffee,
      transport: Car,
      transportation: Car,
      bills: Home,
      utilities: Home,
      default: ShoppingBag,
    };
    return icons[category.toLowerCase()] || icons.default;
  }

  function getCategoryColor(category) {
    const colors = {
      shopping: "blue",
      food: "green",
      dining: "green",
      transport: "orange",
      transportation: "orange",
      bills: "purple",
      utilities: "purple",
      default: "gray",
    };
    return colors[category.toLowerCase()] || colors.default;
  }

  function getCategoryGradient(category) {
    const gradients = {
      shopping: "from-blue-500 to-cyan-500",
      food: "from-green-500 to-emerald-500",
      dining: "from-green-500 to-emerald-500",
      transport: "from-orange-500 to-red-500",
      transportation: "from-orange-500 to-red-500",
      bills: "from-purple-500 to-pink-500",
      utilities: "from-purple-500 to-pink-500",
      default: "from-gray-500 to-gray-600",
    };
    return gradients[category.toLowerCase()] || gradients.default;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Financial Insights"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage=""
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <TrendingUp size={40} className="text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  Financial Insights
                </h2>
                <p className="text-center text-white/90 text-sm">
                  Track your spending and improve your financial health
                </p>
              </div>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedPeriod === period
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Summary Cards - Dynamic */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <ArrowUpRight size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Income</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <ArrowDownRight size={16} className="text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Expenses</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Target size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Savings Rate</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {savingsRate}%
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <PieChart size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Budget Used</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {budgetUsed}%
                </p>
              </div>
            </div>

            {/* Spending by Category - Dynamic */}
            {spendingCategories.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Spending by Category
                </h3>
                <div className="space-y-4">
                  {spendingCategories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center`}>
                              <Icon size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {category.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ${category.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {category.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${category.gradient} h-2 rounded-full transition-all`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Insights - Dynamic */}
            {insights.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    AI-Powered Insights
                  </h3>
                </div>
                <div className="space-y-3">
                  {insights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                      <div
                        key={insight.id}
                        className={`p-4 rounded-xl border ${
                          insight.type === "positive"
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : insight.type === "warning"
                            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            insight.type === "positive"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : insight.type === "warning"
                              ? "bg-yellow-100 dark:bg-yellow-900/30"
                              : "bg-blue-100 dark:bg-blue-900/30"
                          }`}>
                            <Icon
                              size={20}
                              className={
                                insight.type === "positive"
                                  ? "text-green-600 dark:text-green-400"
                                  : insight.type === "warning"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-blue-600 dark:text-blue-400"
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                              {insight.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Financial Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={24} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Financial Tips
                </h3>
              </div>
              <ul className="space-y-3">
                {tips.slice(0, 4).map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                        {index + 1}
                      </span>
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default FinancialInsights;