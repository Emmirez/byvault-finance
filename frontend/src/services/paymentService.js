// services/paymentService.js
import api from "./apiService";

export const paymentService = {
  // Get BTC address
  getBTCAddress: async () => {
    try {
      const response = await api.get("/user/btc-address");
      ;

      // Handle different response structures
      if (response?.address) {
        return { address: response.address };
      } else if (response?.data?.address) {
        return { address: response.data.address };
      } else if (typeof response === "string") {
        return { address: response };
      } else {
        console.warn("Unexpected response format:", response);
        return { address: "bc1qyf5ae8kzuxh8y7axd9yxnmmyh3q3g4eqs3j9ag" };
      }
    } catch (error) {
      console.error("Error fetching BTC address:", error);
      throw error;
    }
  },

  // Upload payment proof
  uploadPaymentProof: async (formData) => {
    try {
      const response = await api.post("/payments/upload-proof", formData);
      

      // Your backend returns { success: true } directly
      return response; // Just return the response as-is
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      throw error;
    }
  },

  // Get deposit history
  getDepositHistory: async () => {
    try {
      const response = await api.get("/payments/history");
      

      // Handle different response structures
      if (response?.history) {
        return { history: response.history };
      } else if (response?.data?.history) {
        return { history: response.data.history };
      } else if (Array.isArray(response)) {
        return { history: response };
      } else if (response?.deposits) {
        return { history: response.deposits };
      } else {
        return { history: [] };
      }
    } catch (error) {
      console.error("Error fetching deposit history:", error);
      return { history: [] }; // Return empty array on error
    }
  },

  // Admin: Get pending deposits
  getPendingDeposits: async () => {
    try {
      const response = await api.get("/admin/payments/pending");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending deposits:", error);
      throw error;
    }
  },

  // Admin: Accept deposit
  acceptDeposit: async (depositId, data) => {
    try {
      const response = await api.put(
        `/admin/payments/${depositId}/accept`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error accepting deposit:", error);
      throw error;
    }
  },

  // Admin: Reject deposit
  rejectDeposit: async (depositId, reason) => {
    try {
      const response = await api.put(`/admin/payments/${depositId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error rejecting deposit:", error);
      throw error;
    }
  },

  // Admin: Cancel deposit
  cancelDeposit: async (depositId, reason) => {
    try {
      const response = await api.put(`/admin/payments/${depositId}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error cancelling deposit:", error);
      throw error;
    }
  },

  // Admin: Get deposit details
  getDepositDetails: async (depositId) => {
    try {
      const response = await api.get(`/admin/payments/${depositId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching deposit details:", error);
      throw error;
    }
  },

// In paymentService.js
getBankDetails: async () => {
  try {
    const response = await api.get('/bank-details');
    
    return response.data; 
  } catch (error) {
    console.error('Error fetching bank details:', error);
    throw error;
  }
},
};
