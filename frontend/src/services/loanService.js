import api from "./apiService.js";

const isHandledError = (error) => [400, 401, 403, 404, 422, 429].includes(error.status);

export const loanService = {
  // Get all available loan products
  getLoanProducts: async () => {
    try {
      const response = await api.get("/loan/products");
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error fetching loan products:", error);
      throw error;
    }
  },

  // Get user's loan status
  getUserLoanStatus: async () => {
    try {
      const response = await api.get("/loan/user-status");
      return response;
    } catch (error) {
     if (!isHandledError(error))  console.error("Error fetching loan status:", error);
      throw error;
    }
  },

  // Apply for a loan
  applyForLoan: async (loanData) => {
    try {
      const response = await api.post("/loan/apply", loanData);
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error applying for loan:", error);
      throw error;
    }
  },

  // Get user's loan applications
  getUserLoans: async () => {
    try {
      const response = await api.get("/loan/my-applications");
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error fetching user loans:", error);
      throw error;
    }
  },

  // Get single loan application
  getLoanById: async (loanId) => {
    try {
      const response = await api.get(`/loan/${loanId}`);
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error fetching loan:", error);
      throw error;
    }
  },

  // Cancel loan application
  cancelLoan: async (loanId, reason) => {
    try {
      const response = await api.put(`/loan/${loanId}/cancel`, { reason });
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error cancelling loan:", error);
      throw error;
    }
  },

  // Admin: Get all loans
  getAllLoans: async (status = "", page = 1) => {
    try {
      const response = await api.get(`/admin/loans?status=${status}&page=${page}`);
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error fetching all loans:", error);
      throw error;
    }
  },

  // Admin: Get loan details
  getLoanDetails: async (loanId) => {
    try {
      const response = await api.get(`/admin/loans/${loanId}`);
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error fetching loan details:", error);
      throw error;
    }
  },

  // Admin: Update loan status
  updateLoanStatus: async (loanId, statusData) => {
    try {
      const response = await api.put(`/admin/loans/${loanId}/status`, statusData);
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error updating loan status:", error);
      throw error;
    }
  },

  // Admin: Create loan product
  createLoanProduct: async (productData) => {
    try {
      const response = await api.post("/admin/loan-products", productData);
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error creating loan product:", error);
      throw error;
    }
  },

  // Admin: Update loan product
  updateLoanProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/admin/loan-products/${productId}`, productData);
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error updating loan product:", error);
      throw error;
    }
  },

  // Admin: Delete loan product
  deleteLoanProduct: async (productId) => {
    try {
      const response = await api.delete(`/admin/loan-products/${productId}`);
      return response;
    } catch (error) {
    if (!isHandledError(error))   console.error("Error deleting loan product:", error);
      throw error;
    }
  },
};