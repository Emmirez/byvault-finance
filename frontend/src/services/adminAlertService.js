// services/adminAlertService.js
import api from "./apiService";

export const adminAlertService = {
  // Get all alerts
  async getAlerts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/alerts?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching admin alerts:", error);
      throw error;
    }
  },

  // Get alert counts for dashboard
  async getAlertCounts() {
    try {
      const response = await api.get("/admin/alerts/counts");
      return response;
    } catch (error) {
      console.error("Error fetching alert counts:", error);
      return { new: 0, critical: 0, byType: [] };
    }
  },

  // Get single alert
  async getAlert(id) {
    try {
      const response = await api.get(`/admin/alerts/${id}`);
      return response.alert;
    } catch (error) {
      console.error("Error fetching alert:", error);
      throw error;
    }
  },

  
  async markAsRead(id) {
    try {
      const response = await api.put(`/admin/alerts/${id}/read`);
      return response;
    } catch (error) {
      console.error("Error marking alert as read:", error);
      throw error;
    }
  },

  
  async markAllAsRead() {
    try {
      const response = await api.put("/admin/alerts/mark-all-read");
      return response;
    } catch (error) {
      console.error("Error marking all alerts as read:", error);
      throw error;
    }
  },

  
  async deleteAlert(id) {
    try {
      const response = await api.delete(`/admin/alerts/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting alert:", error);
      throw error;
    }
  },

  
  async clearAllAlerts() {
    try {
      const response = await api.delete("/admin/alerts/clear-all");
      return response;
    } catch (error) {
      console.error("Error clearing all alerts:", error);
      throw error;
    }
  },

 
  async getReadAlerts(filters = {}) {
    try {
      const queryParams = new URLSearchParams({ ...filters, status: 'read' }).toString();
      const response = await api.get(`/admin/alerts?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching read alerts:", error);
      throw error;
    }
  },

  
  async getArchivedAlerts(filters = {}) {
    try {
      const queryParams = new URLSearchParams({ ...filters, status: 'archived' }).toString();
      const response = await api.get(`/admin/alerts?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching archived alerts:", error);
      throw error;
    }
  },

  // Acknowledge alert
  async acknowledgeAlert(id) {
    try {
      const response = await api.put(`/admin/alerts/${id}/acknowledge`);
      return response;
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      throw error;
    }
  },

  // Resolve alert
  async resolveAlert(id, resolution) {
    try {
      const response = await api.put(`/admin/alerts/${id}/resolve`, { resolution });
      return response;
    } catch (error) {
      console.error("Error resolving alert:", error);
      throw error;
    }
  },

  // Bulk acknowledge alerts
  async bulkAcknowledge(alertIds) {
    try {
      const response = await api.post("/admin/alerts/bulk/acknowledge", { alertIds });
      return response;
    } catch (error) {
      console.error("Error bulk acknowledging alerts:", error);
      throw error;
    }
  },

  // Create alert (for system use)
  async createAlert(alertData) {
    try {
      const response = await api.post("/admin/alerts", alertData);
      return response;
    } catch (error) {
      console.error("Error creating alert:", error);
      throw error;
    }
  },
};