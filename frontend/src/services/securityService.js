// src/services/securityService.js
import api from "./apiService.js";

export const securityService = {
  // Get security dashboard stats
  getSecurityStats: async () => {
    try {
      const response = await api.get("/admin/security/stats");
      return response;
    } catch (error) {
      console.error("Error fetching security stats:", error);
      throw error;
    }
  },

  // Get security logs
  getSecurityLogs: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== 'all' && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/admin/security/logs?${queryString}` : '/admin/security/logs';
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching security logs:", error);
      throw error;
    }
  },

  // Get security settings
  getSecuritySettings: async () => {
    try {
      const response = await api.get("/admin/security/settings");
      return response;
    } catch (error) {
      console.error("Error fetching security settings:", error);
      throw error;
    }
  },

  // Update security setting
  updateSecuritySetting: async (key, value) => {
    try {
      const response = await api.put(`/admin/security/settings/${key}`, { value });
      return response;
    } catch (error) {
      console.error("Error updating security setting:", error);
      throw error;
    }
  },

  // Get active sessions
  getActiveSessions: async () => {
    try {
      const response = await api.get("/admin/security/sessions");
      return response;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  },

  // Revoke session
  revokeSession: async (userId, sessionId) => {
    try {
      const response = await api.post("/admin/security/revoke-session", { userId, sessionId });
      return response;
    } catch (error) {
      console.error("Error revoking session:", error);
      throw error;
    }
  },

  // Get user login attempts
  getUserLoginAttempts: async (userId, limit = 20) => {
    try {
      const response = await api.get(`/admin/security/user/${userId}/attempts?limit=${limit}`);
      return response;
    } catch (error) {
      console.error("Error fetching login attempts:", error);
      throw error;
    }
  },

  // Toggle user 2FA
  toggleUser2FA: async (userId, enabled) => {
    try {
      const response = await api.post(`/admin/security/user/${userId}/toggle-2fa`, { enabled });
      return response;
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      throw error;
    }
  },
};