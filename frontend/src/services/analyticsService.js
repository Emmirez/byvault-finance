// src/services/analyticsService.js
import api from "./apiService.js";

export const analyticsService = {
  // Get dashboard overview stats
  getOverviewStats: async () => {
    try {
      const response = await api.get("/admin/analytics/overview");
      return response;
    } catch (error) {
      console.error("Error fetching overview stats:", error);
      throw error;
    }
  },

  // Get user analytics
  getUserAnalytics: async (timeRange = "30days") => {
    try {
      const response = await api.get(`/admin/analytics/users?range=${timeRange}`);
      return response;
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      throw error;
    }
  },

  // Get transaction analytics
  getTransactionAnalytics: async (timeRange = "30days") => {
    try {
      const response = await api.get(`/admin/analytics/transactions?range=${timeRange}`);
      return response;
    } catch (error) {
      console.error("Error fetching transaction analytics:", error);
      throw error;
    }
  },

  // Get KYC analytics
  getKYCAnalytics: async () => {
    try {
      const response = await api.get("/admin/analytics/kyc");
      return response;
    } catch (error) {
      console.error("Error fetching KYC analytics:", error);
      throw error;
    }
  },

  // Get card analytics
  getCardAnalytics: async () => {
    try {
      const response = await api.get("/admin/analytics/cards");
      return response;
    } catch (error) {
      console.error("Error fetching card analytics:", error);
      throw error;
    }
  },

  // Get financial summary
  getFinancialSummary: async () => {
    try {
      const response = await api.get("/admin/analytics/financial");
      return response;
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      throw error;
    }
  },

  // Get recent activities (for timeline)
  getRecentActivities: async (limit = 20) => {
    try {
      const response = await api.get(`/admin/analytics/recent-activities?limit=${limit}`);
      return response;
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      throw error;
    }
  },
};