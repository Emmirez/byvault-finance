/* eslint-disable no-unused-vars */
// services/adminApi.js
import apiService from "./apiService";

class AdminApiService {
  getDashboardStats() {
    return apiService.get("/admin/stats");
  }

  // Get all users with filters and pagination

  getUsers(params = {}) {
    const queryParams = new URLSearchParams();

    // Only add params that have values
    Object.keys(params).forEach((key) => {
      if (params[key] && params[key].toString().trim() !== "") {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/admin/users?${queryString}`
      : "/admin/users";

    console.log("API Request:", endpoint); // Add logging for debugging

    return apiService.get(endpoint);
  }

  // Get single user details
  getUserDetails(userId) {
    return apiService.get(`/admin/users/${userId}`);
  }

  // Update user (general info, role, balance)
  updateUser(userId, userData) {
    // Your backend has two update endpoints
    // Using /admin/edit/:userId for PATCH updates
    return apiService.patch(`/admin/edit/${userId}`, userData);
  }

  // Update user balance - NOT IN BACKEND YET
  updateUserBalance(userId, balance, type = "set") {
    // This will need to be added to backend
    console.warn("updateUserBalance not implemented in backend");
    return Promise.reject(new Error("Not implemented in backend"));
  }

  // Change user role - NOT IN BACKEND YET
  changeUserRole(userId, role) {
    // This will need to be added to backend
    console.warn("changeUserRole not implemented in backend");
    return Promise.reject(new Error("Not implemented in backend"));
  }

  // Block user - MATCHES /admin/block/:userId
  blockUser(userId, reason = "") {
    return apiService.patch(`/admin/block/${userId}`, { reason });
  }

  // Unblock user - MATCHES /admin/unblock/:userId
  unblockUser(userId) {
    return apiService.patch(`/admin/unblock/${userId}`, {});
  }

  // Suspend user
  suspendUser(userId, reason = "", duration = null) {
    return apiService.patch(`/admin/suspend/${userId}`, { reason, duration });
  }

  // Unsuspend user
  unsuspendUser(userId) {
    return apiService.patch(`/admin/unsuspend/${userId}`, {});
  }

  // Get suspended users
  getSuspendedUsers() {
    return apiService.get("/admin/suspended-users");
  }

  // Activate user - NOT IN BACKEND YET
  activateUser(userId) {
    // This will need to be added to backend
    console.warn("activateUser not implemented in backend");
    return Promise.reject(new Error("Not implemented in backend"));
  }

  // Delete user - MATCHES /admin/delete/:userId
  deleteUser(userId) {
    return apiService.delete(`/admin/delete/${userId}`);
  }

  // DEPOSITS

  // Get pending deposits - MATCHES /admin/deposits/pending
  getPendingDeposits() {
    return apiService.get("/admin/deposits/pending");
  }

  // Approve deposit - MATCHES /admin/deposits/:depositId/approve
  approveDeposit(depositId) {
    return apiService.patch(`/admin/deposits/${depositId}/approve`, {});
  }

  // Reject deposit - MATCHES /admin/deposits/:depositId/reject
  rejectDeposit(depositId, reason = "") {
    return apiService.patch(`/admin/deposits/${depositId}/reject`, { reason });
  }

  // Force update user timestamp
  updateUserTimestamp(userId, createdAt) {
    console.log("🔵 Updating timestamp for user:", userId, "to:", createdAt);
    return apiService.patch(`/admin/force-update-timestamp/${userId}`, {
      createdAt,
    });
  }

  //  TRANSACTIONS

  // Get all transactions with filters
  getTransactions(params = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] && params[key] !== "all" && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/admin/transactions?${queryString}`
      : "/admin/transactions";

    return apiService.get(endpoint);
  }

  // Get transaction statistics
  getTransactionStats(range = "30days") {
    return apiService.get(`/admin/transactions/stats?range=${range}`);
  }

  // Get transaction details
  getTransaction(transactionId) {
    return apiService.get(`/admin/transactions/${transactionId}`);
  }

  // Update transaction status
  updateTransactionStatus(transactionId, status, note = "") {
    return apiService.patch(`/admin/transactions/${transactionId}/status`, {
      status,
      note,
    });
  }

  // Edit transaction details (amount, type, status, description, date, etc.)
  editTransaction(transactionId, data) {
    return apiService.put(`/admin/transactions/${transactionId}`, data);
  }

  // Get pending transactions count
  getPendingTransactionCount() {
    return apiService.get("/admin/transactions/pending-count");
  }

  //  CARD MANAGEMENT

  // Get all cards with filters
  getAllCards(params = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] && params[key] !== "all" && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/superadmin/all-cards?${queryString}`
      : "/superadmin/all-cards";

    return apiService.get(endpoint);
  }

  // Get pending cards
  getPendingCards() {
    return apiService.get("/admin/cards/pending");
  }

  // Get card details
  getCardDetails(cardId) {
    return apiService.get(`/admin/cards/${cardId}`);
  }

  // Approve card
  approveCard(cardId) {
    return apiService.put(`/admin/cards/${cardId}/approve`, {});
  }

  // Reject card
  rejectCard(cardId, reason) {
    return apiService.put(`/admin/cards/${cardId}/reject`, { reason });
  }

  // Toggle card block
  toggleBlockCard(cardId) {
    return apiService.put(`/admin/cards/${cardId}/toggle-block`, {});
  }

  // Get card statistics
  getCardStats() {
    return apiService.get("/admin/cards/stats");
  }

  deleteCard(cardId) {
    return apiService.delete(`/superadmin/cards/${cardId}`);
  }

  // LOAN MANAGEMENT

  // Get all loans with filters
  getAllLoans(params = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] && params[key] !== "all" && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/admin/loans?${queryString}`
      : "/admin/loans";

    return apiService.get(endpoint);
  }

  // Get loan details
  getLoanDetails(loanId) {
    return apiService.get(`/admin/loans/${loanId}`);
  }

  // Update loan status
  updateLoanStatus(loanId, statusData) {
    return apiService.put(`/admin/loans/${loanId}/status`, statusData);
  }

  // Delete loan (superadmin only)
  deleteLoan(loanId) {
    return apiService.delete(`/admin/loans/${loanId}`);
  }

  // Get loan statistics
  getLoanStats() {
    return apiService.get("/admin/loans/stats");
  }

  //  SUPPORT TICKETS

  getSupportTickets(params = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] && params[key] !== "all" && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/admin/support/tickets?${queryString}`
      : "/admin/support/tickets";

    return apiService.get(endpoint);
  }

  // Get single support ticket
  getSupportTicket(ticketId) {
    return apiService.get(`/admin/support/tickets/${ticketId}`);
  }

  // Update ticket status
  updateTicketStatus(ticketId, statusData) {
    return apiService.put(
      `/admin/support/tickets/${ticketId}/status`,
      statusData,
    );
  }

  // Add admin reply to ticket
  addTicketReply(ticketId, message) {
    return apiService.post(`/admin/support/tickets/${ticketId}/reply`, {
      message,
    });
  }

  //  admin profile
  getProfile() {
    return apiService.get("/admin/profile");
  }

  // Update profile
  updateProfile(profileData) {
    return apiService.patch("/admin/profile", profileData);
  }

  // Change password
  changePassword(passwordData) {
    return apiService.post("/admin/change-password", passwordData);
  }

  // Toggle two-factor authentication
  toggleTwoFactor(enable) {
    return apiService.post("/admin/toggle-2fa", { enable });
  }

  getDashboardData() {
    return apiService.get("/admin/dashboard-data");
  }

  // In adminApi.js
  async search(query) {
    try {
      const response = await apiService.get(
        `/admin/search?q=${encodeURIComponent(query)}`,
      );
      return response.results || [];
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  async searchUsers(query) {
    try {
      const response = await apiService.get(
        `/admin/search/users?q=${encodeURIComponent(query)}`,
      );
      return response.users || [];
    } catch (error) {
      console.error("User search error:", error);
      return [];
    }
  }

  async searchTransactions(query) {
    try {
      const response = await apiService.get(
        `/admin/search/transactions?q=${encodeURIComponent(query)}`,
      );
      return response.transactions || [];
    } catch (error) {
      console.error("Transaction search error:", error);
      return [];
    }
  }

  // PAYMENT SETTINGS
  getPaymentSettings() {
    return apiService.get("/admin/payment-settings");
  }

  updatePaymentSettings(data) {
    return apiService.put("/admin/payment-settings", data);
  }
}

export default new AdminApiService();
