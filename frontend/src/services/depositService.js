// services/depositService.js
import api from "./apiService";

export const depositService = {
  // Get payment methods
  async getPaymentMethods() {
    try {
      const response = await api.get("/deposits/methods");
      return response.methods || [];
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  },

  // Get payment method details
  async getPaymentMethodDetails(methodId) {
    try {
      const response = await api.get(`/deposits/methods/${methodId}`);
      return response.details;
    } catch (error) {
      console.error("Error fetching method details:", error);
      throw error;
    }
  },

  // Submit deposit with receipt
  async submitDeposit(formData) {
    try {
      
      const response = await api.post("/deposits/submit", formData);
      
      return response;
    } catch (error) {
      console.error("❌ Service error:", error);
      throw error;
    }
  },

  // Get user's deposit history
  async getDepositHistory(page = 1, limit = 10) {
    try {
      const response = await api.get(
        `/deposits/history?page=${page}&limit=${limit}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching deposit history:", error);
      throw error;
    }
  },

  // Get single deposit request
  async getDepositRequest(id) {
    try {
      const response = await api.get(`/deposits/${id}`);
      return response.deposit;
    } catch (error) {
      console.error("Error fetching deposit request:", error);
      throw error;
    }
  },

  // Cancel deposit request
  async cancelDeposit(id) {
    try {
      const response = await api.put(`/deposits/${id}/cancel`);
      return response;
    } catch (error) {
      console.error("Error cancelling deposit:", error);
      throw error;
    }
  },

  // Get payment settings (bank, paypal, usdt, card, crypto details)
  async getPaymentSettings() {
    try {
      const response = await api.get("/payment-settings/public");
      return response.settings;
    } catch (error) {
      console.error("Error fetching payment settings:", error);
      throw error;
    }
  },
};
