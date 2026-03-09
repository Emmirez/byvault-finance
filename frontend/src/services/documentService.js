// src/services/documentService.js
import api from "./apiService.js";

export const documentService = {
  // User: Upload document
  uploadDocument: async (formData) => {
    try {
      const response = await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  // User: Get my documents
  getMyDocuments: async () => {
    try {
      const response = await api.get("/documents");
      return response;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  // User: Get single document
  getDocumentById: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}`);
      return response;
    } catch (error) {
      console.error("Error fetching document:", error);
      throw error;
    }
  },

  // User: Delete document
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`/documents/${documentId}`);
      return response;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  // Admin: Get all documents
  getAllDocuments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== 'all' && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/admin/documents?${queryString}` : '/admin/documents';
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching all documents:", error);
      throw error;
    }
  },

  // Admin: Get document stats
  getDocumentStats: async () => {
    try {
      const response = await api.get("/admin/documents/stats");
      return response;
    } catch (error) {
      console.error("Error fetching document stats:", error);
      throw error;
    }
  },

  // Admin: Get document details
  getDocumentDetails: async (documentId) => {
    try {
      const response = await api.get(`/admin/documents/${documentId}`);
      return response;
    } catch (error) {
      console.error("Error fetching document details:", error);
      throw error;
    }
  },

  // Admin: Verify document
  verifyDocument: async (documentId, status, rejectionReason = "") => {
    try {
      const response = await api.put(`/admin/documents/${documentId}/verify`, {
        status,
        rejectionReason,
      });
      return response;
    } catch (error) {
      console.error("Error verifying document:", error);
      throw error;
    }
  },

  // Admin: Delete document
  deleteDocumentAdmin: async (documentId) => {
    try {
      const response = await api.delete(`/admin/documents/${documentId}`);
      return response;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },
};