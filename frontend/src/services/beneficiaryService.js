// src/services/beneficiaryService.js
import apiService from "./apiService.js";

export const beneficiaryService = {
  // Fetch all saved beneficiaries for the logged-in user
  getBeneficiaries: async () => {
    const response = await apiService.get("/beneficiaries");
    return response.beneficiaries || [];
  },

  // Save a new beneficiary
  saveBeneficiary: async (data) => {
    const response = await apiService.post("/beneficiaries", data);
    return response.beneficiary;
  },

  // Delete a beneficiary by its _id
  deleteBeneficiary: async (id) => {
    return await apiService.delete(`/beneficiaries/${id}`);
  },
};