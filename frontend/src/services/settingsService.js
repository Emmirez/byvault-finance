// src/services/settingsService.js
import api from "./apiService.js";

export const settingsService = {
  // Get all settings (admin)
  getAllSettings: async (group = "all") => {
    try {
      const response = await api.get(`/admin/settings?group=${group}`);
      return response;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  },

  // Get single setting
  getSettingByKey: async (key) => {
    try {
      const response = await api.get(`/admin/settings/${key}`);
      return response;
    } catch (error) {
      console.error("Error fetching setting:", error);
      throw error;
    }
  },

  // Update setting
  updateSetting: async (key, value) => {
    try {
      const response = await api.put(`/admin/settings/${key}`, { value });
      return response;
    } catch (error) {
      console.error("Error updating setting:", error);
      throw error;
    }
  },

  // Create setting (superadmin)
  createSetting: async (settingData) => {
    try {
      const response = await api.post("/admin/settings", settingData);
      return response;
    } catch (error) {
      console.error("Error creating setting:", error);
      throw error;
    }
  },

  // Delete setting (superadmin)
  deleteSetting: async (key) => {
    try {
      const response = await api.delete(`/admin/settings/${key}`);
      return response;
    } catch (error) {
      console.error("Error deleting setting:", error);
      throw error;
    }
  },

  // Reset to defaults (superadmin)
  resetSettings: async () => {
    try {
      const response = await api.post("/admin/settings/reset");
      return response;
    } catch (error) {
      console.error("Error resetting settings:", error);
      throw error;
    }
  },

  // Get public settings (no auth)
  getPublicSettings: async () => {
    try {
      const response = await api.get("/settings/public");
      return response;
    } catch (error) {
      console.error("Error fetching public settings:", error);
      throw error;
    }
  },
};