/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// contexts/NotificationContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { notificationService } from "../services/notificationService";

// Menu notification types mapping
const menuNotificationTypes = {
  // Main Section
  dashboard: [
    "system_alert",
    "account_update",
    "large_transaction",
    "transfer_sent",
    "transfer_received",
    "security_alert",
    "welcome_bonus",
    "kyc_documents_uploaded",
    "kyc_verified", 
    "profile_updated", 
    "two_factor_enabled", 
    "two_factor_disabled",
  ],

  // Transactions Section
  transactions: [
    "deposit",
    "withdraw",
    "transfer",
    "payment",
    "large_transaction",
    "transfer_sent",
    "transfer_received", 
    "transfer_completed",
    "transfer_failed",
    "transaction_alert",
  ],

  cards: [
    "card_apply",
    "card_approve",
    "card_reject",
    "card_block",
    "card_unblock",
    "card_transaction",
    "card_limit_alert",
  ],

  // Transfers Section
  "local-transfer": [
    "transfer_sent",
    "transfer_received", 
    "transfer_completed",
    "transfer_failed",
    "large_transaction",
  ],

  "international-transfer": [
    "international_transfer",
    "transfer_sent",
    "transfer_received", 
    "currency_conversion",
  ],

  deposit: [
    "deposit_completed",
    "deposit_failed",
    "deposit_pending",
    "deposit_received",
  ],

  "currency-swap": ["swap_completed", "swap_failed", "swap_initiated"],

  // Services Section
  loans: [
    "loan_approved",
    "loan_rejected",
    "payment_due",
    "loan_disbursed",
    "emi_reminder",
  ],

  "tax-refund": ["refund_status", "refund_completed", "refund_initiated"],

  grants: ["grant_approved", "grant_rejected", "grant_disbursed"],

  // KYC Section 
  kyc: [
    "kyc_documents_uploaded", 
    "kyc_verified", 
    "kyc_approved",
    "kyc_rejected",
    "kyc_pending",
    "kyc_under_review",
    "kyc_documents_approved",
    "kyc_documents_rejected",
  ],

  // Account Section 
  settings: [
    "profile_update",
    "profile_updated", 
    "password_changed",
    "two_factor_enabled", 
    "two_factor_disabled",
    "security_alert",
    "kyc_documents_uploaded",
    "kyc_verified", 
    "transaction_pin_changed",
  ],

  support: [
    "ticket_created",
    "ticket_replied",
    "ticket_closed",
    "ticket_resolved",
    "support_message",
  ],
};

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuCounts, setMenuCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response?.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchMenuCounts = async () => {
    if (!user) return;

    try {
      const response = await notificationService.getMenuCounts();
      
      setMenuCounts(response?.counts || {});
    } catch (error) {
      console.error("Error fetching menu counts:", error);
      setMenuCounts({});
    }
  };

  
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchMenuCounts(); 

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchMenuCounts(); 
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  
  useEffect(() => {
    if (!user) return;

    const handleNewNotification = () => {
      fetchUnreadCount();
      fetchMenuCounts(); 
    };

   

    return () => {
      // socket.off('new_notification', handleNewNotification);
    };
  }, [user]);

  const incrementCount = () => setUnreadCount((prev) => prev + 1);
  const decrementCount = () => setUnreadCount((prev) => Math.max(0, prev - 1));
  const resetCount = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        menuCounts, 
        loading,
        fetchUnreadCount,
        fetchMenuCounts, 
        incrementCount,
        decrementCount,
        resetCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
