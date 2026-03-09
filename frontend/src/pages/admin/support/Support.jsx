/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/Support.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Sun,
  Moon,
  Bell,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
  Mail,
  Calendar,
  MessageSquare,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Send,
  Paperclip,
  Tag,
  Flag,
  Shield,
  Users,
  BarChart3,
} from "lucide-react";
import { supportService } from "../../../services/supportService";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell";

// Toast Component
const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-300 max-w-sm
          ${toast.type === "success" ? "bg-green-600" : ""}
          ${toast.type === "error" ? "bg-red-600" : ""}
          ${toast.type === "info" ? "bg-blue-600" : ""}
          ${toast.type === "warning" ? "bg-orange-500" : ""}
        `}
      >
        {toast.type === "success" && (
          <CheckCircle size={16} className="flex-shrink-0" />
        )}
        {toast.type === "error" && (
          <XCircle size={16} className="flex-shrink-0" />
        )}
        {toast.type === "info" && (
          <AlertCircle size={16} className="flex-shrink-0" />
        )}
        {toast.type === "warning" && (
          <AlertCircle size={16} className="flex-shrink-0" />
        )}
        <span className="flex-1">{toast.message}</span>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 hover:opacity-70"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

// Confirm Delete Modal
const ConfirmDeleteModal = ({ open, onClose, onConfirm, ticket }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          Delete Ticket
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Are you sure you want to delete ticket #{ticket?.ticketNumber}? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Support = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "all",
    priority: "all",
    search: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getAllTickets(
        filters.status,
        filters.priority,
        filters.page,
      );

      setTickets(response.tickets || []);
      setPagination({
        page: response.currentPage || 1,
        total: response.total || 0,
        pages: response.totalPages || 1,
      });

      // Calculate stats
      const ticketsList = response.tickets || [];
      setStats({
        total: response.total || 0,
        open: ticketsList.filter((t) => t.status === "open").length,
        inProgress: ticketsList.filter((t) => t.status === "in_progress")
          .length,
        resolved: ticketsList.filter((t) => t.status === "resolved").length,
        closed: ticketsList.filter((t) => t.status === "closed").length,
        urgent: ticketsList.filter((t) => t.priority === "Urgent").length,
        high: ticketsList.filter((t) => t.priority === "High Priority").length,
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      addToast("Failed to fetch tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters.page, filters.status, filters.priority]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchTickets();
  };

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      setProcessing(true);
      await supportService.updateTicketStatus(ticketId, { status });
      await fetchTickets();
      if (selectedTicket?._id === ticketId) {
        const updated = await supportService.getTicketDetails(ticketId);
        setSelectedTicket(updated.ticket);
      }
      addToast(`Ticket status updated to ${status}`, "success");
    } catch (error) {
      console.error("Error updating ticket status:", error);
      addToast("Failed to update ticket status", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setProcessing(true);
      await supportService.addAdminReply(selectedTicket._id, replyMessage);
      const updated = await supportService.getTicketDetails(selectedTicket._id);
      setSelectedTicket(updated.ticket);
      setReplyMessage("");
      addToast("Reply sent successfully", "success");
    } catch (error) {
      console.error("Error sending reply:", error);
      addToast("Failed to send reply", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteClick = (ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ticketToDelete) return;
    
    try {
      setProcessing(true);
      // Assuming you have a deleteTicket method in supportService
      await supportService.deleteTicket(ticketToDelete._id);
      await fetchTickets();
      addToast(`Ticket #${ticketToDelete.ticketNumber} deleted successfully`, "success");
      setShowDeleteModal(false);
      setTicketToDelete(null);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      addToast("Failed to delete ticket", "error");
    } finally {
      setProcessing(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const map = {
      "Low Priority": {
        bg: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        icon: Flag,
      },
      "Medium Priority": {
        bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
        icon: Flag,
      },
      "High Priority": {
        bg: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
        icon: Flag,
      },
      Urgent: {
        bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        icon: Flag,
      },
    };
    const s = map[priority] || map["Low Priority"];
    const Icon = s.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg}`}
      >
        <Icon size={12} />
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const map = {
      open: {
        bg: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        icon: AlertCircle,
        label: "Open",
      },
      in_progress: {
        bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
        icon: Clock,
        label: "In Progress",
      },
      resolved: {
        bg: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
        icon: CheckCircle,
        label: "Resolved",
      },
      closed: {
        bg: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
        icon: XCircle,
        label: "Closed",
      },
      reopened: {
        bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
        icon: Clock,
        label: "Reopened",
      },
    };
    const s = map[status] || map.open;
    const Icon = s.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg}`}
      >
        <Icon size={12} />
        {s.label}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/20`}
        >
          <Icon
            size={16}
            className={`text-${color}-600 dark:text-${color}-400`}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {title}
        </span>
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );

  return (
    <div >
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTicketToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        ticket={ticketToDelete}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4"
              >
                <ArrowLeft size={20} className="dark:text-white" />
              </button>

              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 ml-5">
                Support Tickets
              </h1>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={20} className="dark:text-white" /> : <Moon size={20} />}
                </button>
                 <AdminAlertBell />
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Open Tickets"
                value={stats.open || 0}
                icon={AlertCircle}
                color="green"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress || 0}
                icon={Clock}
                color="blue"
              />
              <StatCard
                title="Urgent"
                value={stats.urgent || 0}
                icon={Flag}
                color="red"
              />
              <StatCard
                title="Resolved"
                value={stats.resolved || 0}
                icon={CheckCircle}
                color="purple"
              />
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 1 })
                  }
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="reopened">Reopened</option>
                </select>

                {/* Priority Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.priority}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priority: e.target.value,
                      page: 1,
                    })
                  }
                >
                  <option value="all">All Priorities</option>
                  <option value="Low Priority">Low</option>
                  <option value="Medium Priority">Medium</option>
                  <option value="High Priority">High</option>
                  <option value="Urgent">Urgent</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* Tickets Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ticket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Updated
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <MessageSquare
                          size={40}
                          className="mx-auto mb-3 opacity-50"
                        />
                        <p>No support tickets found</p>
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => {
                      const user = ticket.user || {};
                      return (
                        <tr
                          key={ticket._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {ticket.ticketNumber}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {ticket.title}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                  {user.firstName?.charAt(0) || "U"}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getPriorityBadge(ticket.priority)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(ticket.status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(ticket.updatedAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setShowDetails(true);
                                }}
                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                                title="View Ticket"
                              >
                                <Eye size={16} className="text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(ticket)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                title="Delete Ticket"
                              >
                                <Trash2 size={16} className="text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                    disabled={filters.page === 1}
                    className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    {filters.page}
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                    disabled={filters.page === pagination.pages}
                    className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminBottomNav />
      </div>

      {/* Ticket Details Modal */}
      {showDetails && selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => {
            setShowDetails(false);
            setSelectedTicket(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          onReply={handleReply}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
          processing={processing}
        />
      )}
    </div>
  );
};

// Ticket Details Modal Component
const TicketDetailsModal = ({
  ticket,
  onClose,
  onStatusUpdate,
  onReply,
  replyMessage,
  setReplyMessage,
  processing,
}) => {
  const user = ticket.user || {};
  const messages = ticket.messages || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ticket #{ticket.ticketNumber}
            </h3>
            <p className="text-sm text-gray-500">{ticket.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={18} className="dark:text-white"/>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ticket Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard
              label="User"
              value={`${user.firstName} ${user.lastName}`}
              subValue={user.email}
              icon={User}
            />
            <InfoCard
              label="Priority"
              value={ticket.priority}
              icon={Flag}
              badge
            />
            <InfoCard
              label="Status"
              value={ticket.status}
              icon={AlertCircle}
              badge
            />
            <InfoCard
              label="Created"
              value={new Date(ticket.createdAt).toLocaleDateString()}
              subValue={new Date(ticket.createdAt).toLocaleTimeString()}
              icon={Calendar}
            />
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Conversation
            </h4>
            <div className="space-y-4 max-h-96 overflow-y-auto p-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.senderType === "admin" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.senderType === "admin"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderType === "admin"
                          ? "text-gray-500"
                          : "text-blue-100"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Box */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Add Reply
            </h4>
            <div className="flex gap-2">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={onReply}
                disabled={processing || !replyMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 self-end"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Status Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-24">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Update Status
            </h4>
            <div className="flex gap-2 flex-wrap">
              {ticket.status !== "in_progress" && (
                <button
                  onClick={() => onStatusUpdate(ticket._id, "in_progress")}
                  disabled={processing}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Start Progress
                </button>
              )}
              {ticket.status !== "resolved" && (
                <button
                  onClick={() => onStatusUpdate(ticket._id, "resolved")}
                  disabled={processing}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Resolve
                </button>
              )}
              {ticket.status !== "closed" && (
                <button
                  onClick={() => onStatusUpdate(ticket._id, "closed")}
                  disabled={processing}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, subValue, icon: Icon, badge }) => (
  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
    <div className="flex items-center gap-2 mb-1">
      <Icon size={14} className="text-gray-500" />
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
    <p
      className={`text-sm font-medium ${
        badge
          ? value === "Urgent"
            ? "text-red-600"
            : value === "High Priority"
              ? "text-orange-600"
              : value === "Medium Priority"
                ? "text-blue-600"
                : "text-gray-900 dark:text-white"
          : "text-gray-900 dark:text-white"
      }`}
    >
      {value}
    </p>
    {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
  </div>
);

export default Support;