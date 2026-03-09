import api from "./apiService.js";

export const notificationService = {
  // Get user notifications
  getUserNotifications: async (page = 1, read = null) => {
    try {
      const url =
        read !== null
          ? `/notifications?page=${page}&read=${read}`
          : `/notifications?page=${page}`;
      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      return response;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  },

  getMenuCounts: async () => {
    try {
      const response = await api.get("/notifications/menu-counts");
      return response;
    } catch (error) {
      console.error("Error getting menu counts:", error);
      // Return empty object on error so UI doesn't break
      return { counts: {} };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await api.put("/notifications/read-all");
      return response;
    } catch (error) {
      console.error("Error marking all as read:", error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    try {
      const response = await api.delete("/notifications/clear-all");
      return response;
    } catch (error) {
      console.error("Error clearing notifications:", error);
      throw error;
    }
  },
};
