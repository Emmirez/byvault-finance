/* eslint-disable no-undef */
// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to handle auth errors
  const handleAuthError = () => {
    apiService.removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  const initializeAuth = async () => {
    try {
      const token = apiService.getAuthToken();

      if (!token) {
        // No token, clear everything
        handleAuthError();
        setLoading(false);
        return;
      }

      // Check if we have cached user data (try localStorage first, then sessionStorage)
      const savedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (savedUser) {
        try {
          // Use cached user data immediately for faster load
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (parseError) {
          console.error("Error parsing saved user data:", parseError);
          handleAuthError();
        }
      }

      // Always verify with server
      try {
        const userData = await apiService.get("/auth/me");

        // If we get here, user exists and token is valid
       

        setUser(userData);
        setIsAuthenticated(true);

        if (localStorage.getItem("authToken")) {
          localStorage.setItem("user", JSON.stringify(userData));
        } else if (sessionStorage.getItem("authToken")) {
          sessionStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.log("Token verification failed:", error.message);

        // Check if it's a 404 (user deleted) error
        if (
          error.message.includes("404") ||
          error.message.includes("not found") ||
          error.message.includes("User not found")
        ) {
          console.log(
            "👤 User no longer exists in database - clearing session",
          );
          handleAuthError(); // This will clear all tokens and user data
          // Force redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return; // Stop further execution
        }

        // If token verification fails but we have cached user, keep it
        if (!savedUser) {
          handleAuthError();
        }
      }
    } catch (error) {
      // Cleanup on error
      handleAuthError();
      console.error("Auth initialization error:", error);
    } finally {
      // Always set loading to false
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const login = async (credentials) => {
    try {
      // If credentials has a token, it's a 2FA login
      if (credentials.token) {
        // Store the token
        apiService.setAuthToken(credentials.token, true);

        // If user data is provided, store it
        if (credentials.user) {
          localStorage.setItem("user", JSON.stringify(credentials.user));
          setUser(credentials.user);
        } else {
          // If no user data, fetch it
          const userData = await apiService.get("/auth/me");
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

        setIsAuthenticated(true);

        return {
          success: true,
          user: credentials.user || userData,
          token: credentials.token,
        };
      }

      const loginData = {
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      };

      Object.keys(loginData).forEach(
        (key) => loginData[key] === undefined && delete loginData[key],
      );

      const response = await apiService.post("/auth/login", loginData);

      // Check if 2FA is required
      if (response.requiresTwoFactor) {
        return {
          success: true,
          requiresTwoFactor: true,
          tempUserId: response.tempUserId,
          message: response.message,
        };
      }

      // Normal login
      if (credentials.rememberMe) {
        apiService.setAuthToken(response.token, true);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        apiService.setAuthToken(response.token, false);
        sessionStorage.setItem("user", JSON.stringify(response.user));
      }

      setUser(response.user);
      setIsAuthenticated(true);

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  };

  const verifyOTP = async (userId, code) => {
    try {
      const response = await apiService.post("/auth/verify-otp", {
        userId,
        code,
      });

      if (response.token) {
        // Store the token (you might want to remember the user's preference)
        apiService.setAuthToken(response.token, true);
        localStorage.setItem("user", JSON.stringify(response.user));

        setUser(response.user);
        setIsAuthenticated(true);

        return {
          success: true,
          user: response.user,
          token: response.token,
        };
      }

      return {
        success: false,
        error: response.message || "Invalid verification code",
      };
    } catch (error) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        error: error.message || "Verification failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.post("/auth/register", userData);

      // Auto-login after registration
      apiService.setAuthToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(response.user));

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await apiService.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with client-side logout even if API call fails
    } finally {
      handleAuthError();
      setLoading(false);

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  // Update user data (for profile updates, etc.)
  const updateUser = (updatedUserData) => {
    const updatedUser = {
      ...user,
      ...updatedUserData,
    };

    setUser(updatedUser);

    // Update storage too
    if (localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else if (sessionStorage.getItem("user")) {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return updatedUser;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user has any of the given roles
  const hasAnyRole = (roles) => {
    if (!user || !Array.isArray(roles)) return false;
    return roles.includes(user.role);
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const userData = await apiService.get("/auth/me");
      setUser(userData);

      // Update storage
      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      return userData;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    }
  };

  if (loading) {
    // return (
    //   <div className="flex items-center justify-center h-screen">
    //     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-b-4 border-gray-200"></div>
    //   </div>
    // );
    return null; // Don't render anything while loading to avoid flicker
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    hasRole,
    hasAnyRole,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
