import api from "./apiService.js";

export const taxRefundService = {
  // Apply for tax refund
  applyForTaxRefund: async (refundData) => {
    try {
      const response = await api.post("/tax-refund/apply", refundData);
      return response;
    } catch (error) {
      console.error("Error applying for tax refund:", error);
      throw error;
    }
  },

  // Get user's tax refund requests
  getUserTaxRefunds: async () => {
    try {
      const response = await api.get("/tax-refund/my-requests");
      return response;
    } catch (error) {
      console.error("Error fetching tax refunds:", error);
      throw error;
    }
  },

  // Get single tax refund request
  getTaxRefundById: async (refundId) => {
    try {
      const response = await api.get(`/tax-refund/${refundId}`);
      return response;
    } catch (error) {
      console.error("Error fetching tax refund:", error);
      throw error;
    }
  },

  // Cancel tax refund request
  cancelTaxRefund: async (refundId, reason) => {
    try {
      const response = await api.put(`/tax-refund/${refundId}/cancel`, { reason });
      return response;
    } catch (error) {
      console.error("Error cancelling tax refund:", error);
      throw error;
    }
  },

  // Admin: Get all tax refund requests
  getAllTaxRefunds: async (status = "", page = 1) => {
    try {
      const response = await api.get(`/admin/tax-refunds?status=${status}&page=${page}`);
      return response;
    } catch (error) {
      console.error("Error fetching all tax refunds:", error);
      throw error;
    }
  },

  // Admin: Get tax refund details
  getTaxRefundDetails: async (refundId) => {
    try {
      const response = await api.get(`/admin/tax-refunds/${refundId}`);
      return response;
    } catch (error) {
      console.error("Error fetching tax refund details:", error);
      throw error;
    }
  },

  // Admin: Update tax refund status
  updateTaxRefundStatus: async (refundId, statusData) => {
    try {
      const response = await api.put(`/admin/tax-refunds/${refundId}/status`, statusData);
      return response;
    } catch (error) {
      console.error("Error updating tax refund status:", error);
      throw error;
    }
  },
};