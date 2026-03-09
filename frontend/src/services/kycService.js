/* eslint-disable no-unused-vars */
import api from "./apiService.js";

export const kycService = {
  // Submit KYC application
  submitKYC: async (formData) => {
    try {
      const response = await api.post("/kyc/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      throw error;
    }
  },

  // Get KYC status
  getKYCStatus: async () => {
    try {
      const response = await api.get("/kyc/status");
      return response;
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      throw error;
    }
  },

  // Get KYC details
  getKYCDetails: async () => {
    try {
      const response = await api.get("/kyc/details");
      return response;
    } catch (error) {
      console.error("Error fetching KYC details:", error);
      throw error;
    }
  },

  // Update KYC application
  updateKYC: async (kycData) => {
    try {
      const response = await api.put("/kyc/update", kycData);
      return response;
    } catch (error) {
      console.error("Error updating KYC:", error);
      throw error;
    }
  },

  // Admin: Get all KYC applications
  getAllKYC: async (status = "", page = 1) => {
    try {
      const response = await api.get(
        `/admin/kyc?status=${status}&page=${page}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching KYC applications:", error);
      throw error;
    }
  },

  // Get KYC by user ID
  getKYCByUserId: async (userId) => {
    try {
      // Try direct endpoint first (if you have one)
      const response = await api.get(`/admin/kyc/user/${userId}`);
      return response;
    } catch (error) {
      console.log("Direct endpoint failed, trying fallback...");
      // Fallback: get all and filter
      const allKyc = await api.get("/admin/kyc?limit=100");
      if (allKyc.applications) {
        const userKyc = allKyc.applications.find(
          (app) => app.user?._id === userId || app.user === userId,
        );
        return { kyc: userKyc };
      }
      return { kyc: null };
    }
  },

  getUserKyc: async (userId) => {
    try {
      // First get all KYC and filter, or create a new endpoint
      const response = await api.get(`/admin/kyc?userId=${userId}`);
      return response;
    } catch (error) {
      console.error("Error fetching user KYC:", error);
      throw error;
    }
  },
    getKYCById: async (kycId) => {
    try {
      // This matches your route: /admin/kyc/:id ✅
      const response = await api.get(`/admin/kyc/${kycId}`);
      return response;
    } catch (error) {
      console.error("Error fetching KYC by ID:", error);
      throw error;
    }
  },

  // Admin: Review KYC application
  reviewKYC: async (kycId, reviewData) => {
    try {
      const response = await api.put(`/admin/kyc/${kycId}/review`, reviewData);
      return response;
    } catch (error) {
      console.error("Error reviewing KYC:", error);
      throw error;
    }
  },

   deleteKYC: async (kycId) => {
    try {
      // This matches your route: /admin/kyc/:id (DELETE)
      const response = await api.delete(`/admin/kyc/${kycId}`);
      return response;
    } catch (error) {
      console.error("Error deleting KYC:", error);
      throw error;
    }
  },
};
