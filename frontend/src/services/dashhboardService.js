// services/dashboardService.js
import api from './apiService';

export const dashboardService = {
  // Get dashboard data
  async getDashboardData() {
    try {
      const response = await api.get('/dashboard');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get recent transactions
  async getRecentTransactions(limit = 5) {
    try {
      const response = await api.get(`/transactions?limit=${limit}`);
      return Array.isArray(response) ? response : response.transactions || [];
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }
};