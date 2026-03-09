// src/services/activityService.js
import api from "./apiService.js";

export const activityService = {
  // Get user activities with filters and pagination
  getUserActivities: async (userId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.filter && params.filter !== 'all') queryParams.append('type', params.filter);
      if (params.dateRange && params.dateRange !== 'all') queryParams.append('range', params.dateRange);
      
      const queryString = queryParams.toString();
      const endpoint = `/admin/users/${userId}/activities${queryString ? `?${queryString}` : ''}`;
      
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching user activities:", error);
      // Return empty data structure on error
      return {
        activities: [],
        pagination: { page: 1, total: 0, pages: 1 },
        stats: { logins: 0, transactions: 0, updates: 0, security: 0 }
      };
    }
  },

  // Get activity statistics
  getActivityStats: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/activities/stats`);
      return response;
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      return { logins: 0, transactions: 0, updates: 0, security: 0 };
    }
  },
};