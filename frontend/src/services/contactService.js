// services/contactService.js
import api from "./apiService";

export const contactService = {
  sendMessage: async (formData) => {
    // This endpoint is public 
    const response = await api.post("/contact", formData);
    return response;
  }
};