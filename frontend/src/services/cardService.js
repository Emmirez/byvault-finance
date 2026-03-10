import api from "./apiService.js";

const isHandledError = (error) =>
  [400, 401, 403, 404, 422, 429].includes(error.status);

export const cardService = {
  // Apply for a card
  applyForCard: async (cardData) => {
    try {
      const response = await api.post("/cards/apply", cardData);

      return response;
    } catch (error) {
      if (!isHandledError(error))
        console.error("Error applying for card - full error:", error);

      throw error;
    }
  },

  // Get user's cards
  getUserCards: async () => {
    try {
      const response = await api.get("/cards");
     
      return response;
    } catch (error) {
     if (!isHandledError(error)) console.error("Error fetching cards:", error);
      throw error;
    }
  },

  // Get single card details
  getCardDetails: async (cardId) => {
    try {
      const response = await api.get(`/cards/${cardId}`);
      
      return response; // Return the response directly, not response.data
    } catch (error) {
    if (!isHandledError(error))  console.error("Error fetching card details:", error);
      throw error;
    }
  },

  // User: Toggle block/unblock own card
userToggleBlockCard: async (cardId) => {
  try {
    const response = await api.put(`/cards/${cardId}/toggle-block`);
    return response;
  } catch (error) {
    if (!isHandledError(error)) console.error("Error toggling card block:", error);
    throw error;
  }
},

  // Admin: Get pending cards
  getPendingCards: async () => {
    try {
      const response = await api.get("/admin/cards/pending");
      return response.data;
    } catch (error) {
    if (!isHandledError(error))  console.error("Error fetching pending cards:", error);
      throw error;
    }
  },

  // Admin: Approve card
  approveCard: async (cardId) => {
    try {
      const response = await api.put(`/admin/cards/${cardId}/approve`);
      return response.data;
    } catch (error) {
    if (!isHandledError(error))  console.error("Error approving card:", error);
      throw error;
    }
  },

  // Admin: Reject card
  rejectCard: async (cardId, reason) => {
    try {
      const response = await api.put(`/admin/cards/${cardId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
    if (!isHandledError(error))  console.error("Error rejecting card:", error);
      throw error;
    }
  },

  // Admin: Toggle card block
  toggleBlockCard: async (cardId) => {
    try {
      const response = await api.put(`/admin/cards/${cardId}/toggle-block`);
      return response.data;
    } catch (error) {
    if (!isHandledError(error))  console.error("Error toggling card block:", error);
      throw error;
    }
  },

  // Superadmin: Get all cards
  getAllCards: async () => {
    try {
      const response = await api.get("/superadmin/all-cards");
      return response;
    } catch (error) {
    if (!isHandledError(error))  console.error("Error fetching all cards:", error);
      throw error;
    }
  },

  // Superadmin: Delete card
  deleteCard: async (cardId) => {
    try {
      const response = await api.delete(`/superadmin/cards/${cardId}`);
      return response.data;
    } catch (error) {
    if (!isHandledError(error))  console.error("Error deleting card:", error);
      throw error;
    }
  },

};
