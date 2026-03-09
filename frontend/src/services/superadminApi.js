// src/services/superadminApi.js
import apiService from "./apiService";

class SuperAdminApiService {
  // Get all users (superadmin only)
  getAllUsers(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/superadmin/users?${queryString}` : '/superadmin/users';
    
    return apiService.get(endpoint);
  }

  // Get all admins
  getAllAdmins() {
    return apiService.get('/superadmin/admins');
  }

  // Promote user to admin
  promoteUser(userId) {
    return apiService.patch(`/superadmin/promote/${userId}`, {});
  }

  // Demote admin to user
  demoteAdmin(userId) {
    return apiService.patch(`/superadmin/demote/${userId}`, {});
  }

  // Get system statistics
  getSystemStats() {
    return apiService.get('/superadmin/stats');
  }

  // Get admin activity logs
  getAdminLogs() {
    return apiService.get('/superadmin/logs');
  }
}

export default new SuperAdminApiService();