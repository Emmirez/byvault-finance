// src/services/announcementService.js
import api from "./apiService.js";

export const announcementService = {
  // User: Get announcements
  getUserAnnouncements: async () => {
    try {
      const response = await api.get("/announcements");
      return response;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  },

  // User: Mark as read
  markAsRead: async (announcementId) => {
    try {
      const response = await api.post(`/announcements/${announcementId}/read`);
      return response;
    } catch (error) {
      console.error("Error marking as read:", error);
      throw error;
    }
  },

  // Admin: Get all announcements
  getAllAnnouncements: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== 'all' && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/admin/announcements?${queryString}` : '/admin/announcements';
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  },

  // Admin: Get single announcement
  getAnnouncementById: async (announcementId) => {
    try {
      const response = await api.get(`/admin/announcements/${announcementId}`);
      return response;
    } catch (error) {
      console.error("Error fetching announcement:", error);
      throw error;
    }
  },

  // Admin: Create announcement
  createAnnouncement: async (data) => {
    try {
      const response = await api.post("/admin/announcements", data);
      return response;
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
  },

  // Admin: Update announcement
  updateAnnouncement: async (announcementId, data) => {
    try {
      const response = await api.put(`/admin/announcements/${announcementId}`, data);
      return response;
    } catch (error) {
      console.error("Error updating announcement:", error);
      throw error;
    }
  },

  // Admin: Publish announcement
  publishAnnouncement: async (announcementId) => {
    try {
      const response = await api.post(`/admin/announcements/${announcementId}/publish`);
      return response;
    } catch (error) {
      console.error("Error publishing announcement:", error);
      throw error;
    }
  },

  // Admin: Archive announcement
  archiveAnnouncement: async (announcementId) => {
    try {
      const response = await api.post(`/admin/announcements/${announcementId}/archive`);
      return response;
    } catch (error) {
      console.error("Error archiving announcement:", error);
      throw error;
    }
  },

  // Admin: Delete announcement
  deleteAnnouncement: async (announcementId) => {
    try {
      const response = await api.delete(`/admin/announcements/${announcementId}`);
      return response;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  },
};