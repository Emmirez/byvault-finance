import api from "./apiService.js";

export const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      // Change from "/user/profile" to "/profile"
      const response = await api.get("/profile");
      return response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      // Change from "/user/profile" to "/profile"
      const response = await api.put("/profile", profileData);
      return response;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      // This one is correct - "/change-password"
      const response = await api.put("/change-password", passwordData);
      return response;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await api.put("/user/notifications", preferences);
      return response;
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      throw error;
    }
  },

    // Change transaction PIN
  changeTransactionPin: async (pinData) => {
    try {
      const response = await api.put("/change-transaction-pin", pinData);
      return response;
    } catch (error) {
      console.error("Error changing transaction PIN:", error);
      throw error;
    }
  },

  // Verify transaction PIN
  verifyTransactionPin: async (pin) => {
    try {
      const response = await api.post("/verify-transaction-pin", { pin });
      return response;
    } catch (error) {
      console.error("Error verifying transaction PIN:", error);
      throw error;
    }
  },
};
