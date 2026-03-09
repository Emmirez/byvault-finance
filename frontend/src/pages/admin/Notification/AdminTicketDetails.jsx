/* eslint-disable react-hooks/exhaustive-deps */
// pages/admin/support/AdminTicketDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Clock,
  User,
  AlertCircle,
} from "lucide-react";
import { supportService } from "../../../services/supportService";
import { formatDistanceToNow } from "date-fns";
import AdminBottomNav from "../Components/AdminBottomNav";

const AdminTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTicketDetails(id);
      setTicket(response.ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    
    setSending(true);
    try {
      await supportService.addAdminReply(id, reply);
      setReply("");
      fetchTicket();
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
      in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
      resolved: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
      reopened: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
    };
    return colors[status] || colors.open;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ticket not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20"> {/* ✅ Added pb-20 for bottom nav */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Ticket #{ticket.ticketNumber}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {ticket.title}
            </p>
          </div>
          <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {ticket.user?.firstName} {ticket.user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {ticket.user?.email}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-4">
          {ticket.messages?.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.senderType === 'admin'
                    ? 'bg-blue-500 text-white rounded-tr-none'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                <p className={`text-[10px] mt-1 ${msg.senderType === 'admin' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.senderType === 'admin' ? 'Admin' : 'User'} · {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 pb-24">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <div className="flex items-center justify-between">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Paperclip size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleReply}
              disabled={!reply.trim() || sending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </div>
      
      
      <AdminBottomNav />
    </div>
  );
};

export default AdminTicketDetails;