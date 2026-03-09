import api from "./apiService.js";

export const grantService = {
  // Apply for individual grant
  applyIndividualGrant: async (grantData) => {
    try {
      const response = await api.post("/grants/individual/apply", grantData);
      return response;
    } catch (error) {
      console.error("Error applying for individual grant:", error);
      throw error;
    }
  },

  // Apply for company grant
  applyCompanyGrant: async (grantData) => {
    try {
      const response = await api.post("/grants/company/apply", grantData);
      return response;
    } catch (error) {
      console.error("Error applying for company grant:", error);
      throw error;
    }
  },

  // Get user's grant applications
  getUserGrants: async () => {
    try {
      const response = await api.get("/grants/my-applications");
      return response;
    } catch (error) {
      console.error("Error fetching grants:", error);
      throw error;
    }
  },

  // Get single grant application
  getGrantById: async (grantId) => {
    try {
      const response = await api.get(`/grants/${grantId}`);
      return response;
    } catch (error) {
      console.error("Error fetching grant:", error);
      throw error;
    }
  },

  // Cancel grant application
  cancelGrant: async (grantId, reason) => {
    try {
      const response = await api.put(`/grants/${grantId}/cancel`, { reason });
      return response;
    } catch (error) {
      console.error("Error cancelling grant:", error);
      throw error;
    }
  },

  // Admin: Get all grant applications
  getAllGrants: async (status = "", type = "", page = 1) => {
    try {
      const response = await api.get(`/admin/grants?status=${status}&type=${type}&page=${page}`);
      return response;
    } catch (error) {
      console.error("Error fetching all grants:", error);
      throw error;
    }
  },

  // Admin: Get grant details
  getGrantDetails: async (grantId) => {
    try {
      const response = await api.get(`/admin/grants/${grantId}`);
      return response;
    } catch (error) {
      console.error("Error fetching grant details:", error);
      throw error;
    }
  },

  // Admin: Update grant status
  updateGrantStatus: async (grantId, statusData) => {
    try {
      const response = await api.put(`/admin/grants/${grantId}/status`, statusData);
      return response;
    } catch (error) {
      console.error("Error updating grant status:", error);
      throw error;
    }
  },

  deleteGrant: async (grantId) => {
  try {
    const response = await api.delete(`/admin/grants/${grantId}`);
    return response;
  } catch (error) {
    console.error("Error deleting grant:", error);
    throw error;
  }
},
};