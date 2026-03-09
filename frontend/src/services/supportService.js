import api from "./apiService.js";

export const supportService = {
  // Submit a support ticket
  submitTicket: async (ticketData) => {
    try {
      const response = await api.post("/support/tickets", ticketData);
      return response;
    } catch (error) {
      console.error("Error submitting ticket:", error);
      throw error;
    }
  },

  // Get user's tickets
  getUserTickets: async () => {
    try {
      const response = await api.get("/support/tickets");
      return response;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  },

  // Get single ticket details
  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`/support/tickets/${ticketId}`);
      return response;
    } catch (error) {
      console.error("Error fetching ticket:", error);
      throw error;
    }
  },

  // Add message to ticket
  addTicketMessage: async (ticketId, message) => {
    try {
      const response = await api.post(`/support/tickets/${ticketId}/messages`, { message });
      return response;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  },

  // Close ticket
  closeTicket: async (ticketId) => {
    try {
      const response = await api.put(`/support/tickets/${ticketId}/close`);
      return response;
    } catch (error) {
      console.error("Error closing ticket:", error);
      throw error;
    }
  },

  // Admin: Get all tickets
  getAllTickets: async (status = "", priority = "", page = 1) => {
    try {
      const response = await api.get(`/admin/support/tickets?status=${status}&priority=${priority}&page=${page}`);
      return response;
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      throw error;
    }
  },

  // Admin: Get ticket details
  getTicketDetails: async (ticketId) => {
    try {
      const response = await api.get(`/admin/support/tickets/${ticketId}`);
      return response;
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      throw error;
    }
  },

  // Admin: Update ticket status
  updateTicketStatus: async (ticketId, statusData) => {
    try {
      const response = await api.put(`/admin/support/tickets/${ticketId}/status`, statusData);
      return response;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw error;
    }
  },

  // Admin: Add admin reply
  addAdminReply: async (ticketId, message) => {
    try {
      const response = await api.post(`/admin/support/tickets/${ticketId}/reply`, { message });
      return response;
    } catch (error) {
      console.error("Error adding admin reply:", error);
      throw error;
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const response = await api.delete(`/admin/support/tickets/${ticketId}`);
      return response;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      throw error;
    }
  },
};