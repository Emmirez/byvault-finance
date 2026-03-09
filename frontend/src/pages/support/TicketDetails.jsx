/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/user/Support/TicketDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Flag,
  Send,
  User,
  Shield,
  Calendar,
  Paperclip,
  Download,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import Header from "../../components/layout/UserNav/Header";
import Sidebar from "../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../contexts/AuthContext";
import { supportService } from "../../services/supportService";
import { useDarkMode } from "../../hooks/useDarkMode";

const TicketDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTicketById(id);
      if (response.success) {
        setTicket(response.ticket);
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      setError("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setError("Please enter a message");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await supportService.addTicketMessage(id, replyMessage);
      if (response.success) {
        setTicket(response.ticket);
        setReplyMessage("");
        setSuccess("Message sent successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm("Are you sure you want to close this ticket?")) return;

    try {
      const response = await supportService.closeTicket(id);
      if (response.success) {
        await fetchTicketDetails();
        setSuccess("Ticket closed successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
      setError("Failed to close ticket");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "in_progress":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "closed":
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case "reopened":
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "closed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      case "reopened":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "High Priority":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "Medium Priority":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Low Priority":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading ticket details...
          </p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ticket Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The ticket you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/support/tickets")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate("/support/tickets")}
        pageTitle={`Ticket #${ticket.ticketNumber}`}
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage=""
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-3xl mx-auto p-4 lg:p-8">
            {/* Back Button */}
            <button
              onClick={() => navigate("/support/tickets")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Tickets</span>
            </button>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Ticket Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                  {ticket.ticketNumber}
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
              </div>

              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {ticket.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Created: {formatDate(ticket.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {ticket.messages?.length || 1} messages
                </span>
              </div>

              {/* Close Ticket Button */}
              {ticket.status !== "closed" && ticket.status !== "resolved" && (
                <button
                  onClick={handleCloseTicket}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Close Ticket
                </button>
              )}
            </div>

            {/* Messages Thread */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Conversation
              </h2>

              <div className="space-y-4 mb-6">
                {ticket.messages?.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.senderType === "admin"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {message.senderType === "admin" && (
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield
                          size={16}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] ${
                        message.senderType === "admin"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "bg-blue-50 dark:bg-blue-900/20"
                      } rounded-xl p-3`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {message.senderType === "admin"
                            ? "Support Team"
                            : "You"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {message.message}
                      </p>
                      {message.attachments?.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <Paperclip size={14} className="text-gray-400" />
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            {message.attachments.length} attachment(s)
                          </span>
                        </div>
                      )}
                    </div>

                    {message.senderType === "user" && (
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <User
                          size={16}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              {ticket.status !== "closed" && ticket.status !== "resolved" && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Add Reply
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Our support team typically responds within 24-48 hours.
                    </p>
                    <button
                      onClick={handleSendReply}
                      disabled={sending || !replyMessage.trim()}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                      {sending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {ticket.status === "closed" && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This ticket is closed. If you need further assistance,
                    please create a new ticket.
                  </p>
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 pb-10 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <HelpCircle
                  className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                  size={20}
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    Need immediate assistance?
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-10">
                    If your issue is urgent, please select "Urgent" priority
                    when creating a ticket, or contact our 24/7 support line.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default TicketDetails;
