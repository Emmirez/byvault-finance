// services/twoFactorService.js
import api from "./apiService";

export const twoFactorService = {
  // Get 2FA status
  get2FAStatus: async () => {
    try {
      const response = await api.get("/2fa/status");

      return response;
    } catch (error) {
      console.error(" [2FA Service] Error fetching 2FA status:", error);
      throw error;
    }
  },

  // Enable 2FA (send verification code)
  enable2FA: async () => {
    try {
      const response = await api.post("/2fa/enable");

      return response;
    } catch (error) {
      console.error(" [2FA Service] Error enabling 2FA:", error);
      throw error;
    }
  },

  // Verify and enable 2FA
  verifyAndEnable2FA: async (data) => {
    try {
      console.log(
        "🔍 [2FA Service] Verifying and enabling 2FA with data:",
        data,
      );
      const response = await api.post("/2fa/verify-enable", data);

      return response;
    } catch (error) {
      console.error(" [2FA Service] Error verifying 2FA:", error);
      throw error;
    }
  },

  // Verify login OTP
  verifyLoginOTP: async (data) => {
    try {
      const response = await api.post("/verify-2fa", data);

      return response;
    } catch (error) {
      console.error(" [2FA Service] Error verifying login OTP:", error);
      throw error;
    }
  },

  resendOTP: async (userId) => {
    try {
      console.log("Sending resend request for userId:", userId);
      const response = await api.post("/2fa/resend", { userId });
      console.log("Resend API response:", response);
      return response;
    } catch (error) {
      console.error("Resend API error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  // Disable 2FA
  disable2FA: async (data) => {
    try {
      const response = await api.post("/2fa/disable", data);

      return response;
    } catch (error) {
      console.error("[2FA Service] Error disabling 2FA:", error);
      throw error;
    }
  },
};
