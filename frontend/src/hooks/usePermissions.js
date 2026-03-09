// hooks/usePermissions.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService"; // 👈 Import your service

export const usePermissions = () => {
  const { user: authUser } = useAuth();
  const [fullProfile, setFullProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFullProfile = async () => {
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 👈 Use your existing userService
        const response = await userService.getUserProfile();

        // Handle different response structures
        const profileData = response.user || response;
        setFullProfile(profileData);
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message);
        // Fallback to auth user data
        setFullProfile(authUser);
      } finally {
        setLoading(false);
      }
    };

    fetchFullProfile();
  }, [authUser]);

  // Use full profile if available, otherwise fallback to auth user
  const user = fullProfile || authUser;

  // Check if user exists
  const isLoggedIn = !!user;

  // Check if user is pending (status is "pending")
  const isPending = user?.status === "pending";

  // Check if user is active (status is "active")
  const isActive = user?.status === "active";

  // Check if user is verified (for backward compatibility)
  const isVerified = user?.isVerified === true || isActive;

  // Check if user is blocked
  const isBlocked = user?.isBlocked === true;

  // Check if user is suspended
  const isSuspended = user?.isSuspended === true;

  // Check if user can transact (must be active and not blocked/suspended)
  const canTransact = () => {
    return isActive && !isBlocked && !isSuspended;
  };

  // Any logged in user can view dashboard
  const canViewDashboard = () => {
    return isLoggedIn;
  };

  // Show KYC banner only for pending users
  const showKYCBanner = () => {
    if (!isPending) return false; // verified/active users don't see it

    const kycStatus = user?.kycStatus || "";

    // Already submitted — show different message
    if (
      ["pending", "submitted", "under_review", "reviewing"].includes(kycStatus)
    ) {
      return "pending";
    }

    // Not submitted yet
    return "unverified";
  };

  return {
    canTransact,
    canViewDashboard,
    showKYCBanner,
    isVerified,
    isPending,
    isActive,
    isLoggedIn,
    isBlocked,
    isSuspended,
    status: user?.status,
    loading,
    error,
    user: fullProfile, // Return the full profile
  };
};
