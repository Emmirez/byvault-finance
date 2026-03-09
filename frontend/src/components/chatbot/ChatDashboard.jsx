/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Admin/ChatDashboard.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import AdminBottomNav from "../../pages/admin/Components/AdminBottomNav";
import SuperAdminProfile from "../../pages/admin/Components/SuperAdmin";
import {
  Send, Users, MessageSquare, Clock, CheckCheck,
  Wifi, WifiOff, Trash2, ChevronLeft, AlertTriangle,
  X, Menu, Bell, BellOff, Moon, Sun,
  LayoutDashboard, ArrowLeftRight, Settings, Activity,
} from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

const SESSIONS_STORAGE_KEY = "byvault_admin_sessions";
const MESSAGES_STORAGE_KEY = "byvault_admin_messages";
const SELECTED_SESSION_KEY = "byvault_admin_selected";

//  Desktop vertical nav rail items ─
const NAV_ITEMS = [
  { label: "Dashboard",    icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Users",        icon: Users,            to: "/admin/users" },
  { label: "Transactions", icon: ArrowLeftRight,   to: "/admin/transactions" },
  { label: "Live Chat",    icon: MessageSquare,    to: "/admin/chat" },
  { label: "Analytics",   icon: Activity,          to: "/admin/analytics" },
  { label: "Settings",    icon: Settings,           to: "/admin/settings" },
];

// ─── Desktop Nav Rail (hidden on mobile — mobile uses AdminBottomNav) ─────────
const DesktopNavRail = ({ unreadChats = 0 }) => {
  const { pathname } = useLocation();
  

  return (
    <nav className="hidden lg:flex flex-col items-center w-16 xl:w-52 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 py-4 gap-1 sticky top-0">
      {/* Brand mark */}
      <div className="flex items-center justify-center xl:justify-start xl:px-4 w-full mb-6">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white font-bold text-sm select-none">B</span>
        </div>
        <span className="hidden xl:block ml-2 text-base font-bold text-gray-900 dark:text-white truncate">
          Byvault
        </span>
      </div>

      {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
        const isActive = pathname === to || pathname.startsWith(to + "/");
        const badge = label === "Live Chat" && unreadChats > 0 ? unreadChats : null;

        return (
          <Link
            key={to}
            to={to}
            title={label}
            className={`
              relative flex items-center justify-center xl:justify-start
              w-10 xl:w-full xl:px-4 h-10 xl:h-11 rounded-xl xl:rounded-lg
              transition-all duration-150 group
              ${isActive
                ? "bg-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }
            `}
          >
            <div className="relative flex-shrink-0">
              <Icon size={18} />
              {badge && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </div>
            <span className="hidden xl:block ml-3 text-sm font-medium">{label}</span>

            {/* Icon-only tooltip on md rail */}
            <span className="
              xl:hidden absolute left-full ml-3 px-2 py-1 bg-gray-900 dark:bg-gray-700
              text-white text-xs rounded-md whitespace-nowrap
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-opacity duration-150 z-50
            ">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

// Delete Confirmation Modal 
const DeleteModal = ({ session, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">End Session</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to end the chat session for{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{session.userName}</span>?
        All messages will be permanently deleted.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </div>
);

// Main Component
const ChatDashboard = () => {
  const { user } = useAuth();

  const socketRef = useRef(null);
  const selectedSessionRef = useRef(null);

  const [darkMode, toggleDarkMode] = useDarkMode();
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  const [sessions, setSessions] = useState(() => {
    try { const s = localStorage.getItem(SESSIONS_STORAGE_KEY); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [selectedSession, setSelectedSession] = useState(() => {
    try { const s = localStorage.getItem(SELECTED_SESSION_KEY); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadSessions, setUnreadSessions] = useState(new Set());

  const messagesEndRef = useRef(null);
  const messagesMap = useRef(new Map());
  const sessionListRef = useRef(null);
  const notificationSound = useRef(null);
  const initialLoadDone = useRef(false);

  useEffect(() => { selectedSessionRef.current = selectedSession; }, [selectedSession]);

  //  Persistence 
  useEffect(() => {
    try {
      const s = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (s) { const p = JSON.parse(s); Object.entries(p).forEach(([id, msgs]) => messagesMap.current.set(id, msgs)); }
    } catch (e) { console.error(e); }
    initialLoadDone.current = true;
  }, []);

  useEffect(() => {
    try { localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions)); }
    catch (e) { console.error(e); }
  }, [sessions]);

  useEffect(() => {
    try {
      selectedSession
        ? localStorage.setItem(SELECTED_SESSION_KEY, JSON.stringify(selectedSession))
        : localStorage.removeItem(SELECTED_SESSION_KEY);
    } catch (e) { console.error(e); }
  }, [selectedSession]);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    try {
      const obj = {};
      messagesMap.current.forEach((v, k) => { obj[k] = v; });
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(obj));
    } catch (e) { console.error(e); }
  }, [messages]);

  //  Notifications 
  useEffect(() => {
    notificationSound.current = new Audio("/notification.mp3");
    if (Notification.permission === "default") Notification.requestPermission();
  }, []);

  const playNotification = useCallback(() => {
    if (soundEnabled && notificationSound.current)
      notificationSound.current.play().catch(() => {});
  }, [soundEnabled]);

  const showBrowserNotification = useCallback((title, body) => {
    if (Notification.permission === "granted" && document.hidden)
      new Notification(title, { body, icon: "/favicon.ico", silent: true });
  }, []);

  // ── Socket created ONCE 
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("admin-join");
      socket.emit("get-active-sessions");
    });
    socket.on("connect_error", (err) => console.warn("⚠️ Socket:", err.message));
    socket.on("active-sessions", (list) => setSessions(list));

    socket.on("new-session", (session) => {
      setSessions((prev) => {
        const exists = prev.some((s) => s._id === session._id);
        return exists ? prev.map((s) => s._id === session._id ? { ...s, ...session } : s) : [session, ...prev];
      });
      playNotification();
      showBrowserNotification("New Chat Session", `${session.userName} started a chat`);
    });

    socket.on("new-message", (message) => {
      const prevMsgs = messagesMap.current.get(message.sessionId) || [];
      messagesMap.current.set(message.sessionId, [...prevMsgs, message]);

      setSessions((s) => s.map((sess) =>
        sess._id === message.sessionId
          ? { ...sess, lastMessage: message.message, lastActivity: new Date(), unreadCount: (sess.unreadCount || 0) + 1 }
          : sess
      ));

      const current = selectedSessionRef.current;
      if (!message.isAdmin && current?._id !== message.sessionId) {
        setUnreadSessions((s) => new Set(s).add(message.sessionId));
        playNotification();
        showBrowserNotification("New Message", `${message.userName || "User"}: ${message.message.substring(0, 50)}${message.message.length > 50 ? "..." : ""}`);
      }
      if (current && message.sessionId === current._id) {
        setMessages((msgs) => {
          const exists = msgs.some((m) => m._id === message._id || (m._optimistic && m.message === message.message));
          if (exists) return msgs;
          const idx = msgs.findIndex((m) => m._optimistic && m.message === message.message);
          if (idx !== -1) { const next = [...msgs]; next[idx] = { ...message, _optimistic: false }; return next; }
          return [...msgs, message];
        });
        setUnreadSessions((s) => { const n = new Set(s); n.delete(message.sessionId); return n; });
        setSessions((s) => s.map((sess) => sess._id === message.sessionId ? { ...sess, unreadCount: 0 } : sess));
      }
    });

    socket.on("message-history", ({ sessionId, messages: history }) => {
      messagesMap.current.set(sessionId, history);
      if (selectedSessionRef.current?._id === sessionId) setMessages(history);
    });
    socket.on("session-ended", (sessionId) => {
      setSessions((s) => s.filter((sess) => sess._id !== sessionId));
      messagesMap.current.delete(sessionId);
      setUnreadSessions((s) => { const n = new Set(s); n.delete(sessionId); return n; });
      if (selectedSessionRef.current?._id === sessionId) { setSelectedSession(null); setMessages([]); }
    });
    socket.on("user-online", ({ sessionId, socketId }) =>
      setSessions((s) => s.map((sess) => sess._id === sessionId ? { ...sess, socketId, isOnline: true } : sess))
    );
    socket.on("user-offline", ({ sessionId }) =>
      setSessions((s) => s.map((sess) => sess._id === sessionId ? { ...sess, socketId: null, isOnline: false } : sess))
    );
    socket.on("user-active", ({ sessionId }) =>
      setSessions((s) => s.map((sess) => sess._id === sessionId ? { ...sess, lastActivity: new Date(), isOnline: true } : sess))
    );
    socket.on("message-sent", (data) => {
      if (data.sessionId === selectedSessionRef.current?._id)
        setMessages((msgs) => msgs.map((m) => m._optimistic && m.message === data.message ? { ...data, _optimistic: false } : m));
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setMessages(messagesMap.current.get(selectedSession._id) || []);
      setUnreadSessions((s) => { const n = new Set(s); n.delete(selectedSession._id); return n; });
      setSessions((s) => s.map((sess) => sess._id === selectedSession._id ? { ...sess, unreadCount: 0 } : sess));
      socketRef.current?.emit("get-history", selectedSession._id);
    } else {
      setMessages([]);
    }
  }, [selectedSession]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  //  Handlers 
  const selectSession = (session) => { setSelectedSession(session); setChatSidebarOpen(false); };

  const handleSendReply = () => {
    if (!inputMessage.trim() || !selectedSession || !socketRef.current) return;
    socketRef.current.emit("admin-reply", {
      sessionId: selectedSession._id,
      text: inputMessage,
      adminId: user?.id || "admin",
      adminName: user?.firstName ? `${user.firstName} ${user.lastName}` : "Support",
    });
    setMessages((prev) => [...prev, {
      _id: `temp_${Date.now()}`, sessionId: selectedSession._id, message: inputMessage,
      isAdmin: true, adminName: user?.firstName ? `${user.firstName} ${user.lastName}` : "Support",
      createdAt: new Date().toISOString(), _optimistic: true,
    }]);
    setSessions((prev) => prev.map((s) => s._id === selectedSession._id ? { ...s, lastMessage: inputMessage, lastActivity: new Date() } : s));
    setInputMessage("");
  };

  const handleDeleteSession = (session, e) => { e?.stopPropagation(); setDeleteTarget(session); };

  const confirmDelete = () => {
    if (!deleteTarget || !socketRef.current) return;
    socketRef.current.emit("admin-end-session", { sessionId: deleteTarget._id });
    setSessions((s) => s.filter((sess) => sess._id !== deleteTarget._id));
    messagesMap.current.delete(deleteTarget._id);
    if (selectedSession?._id === deleteTarget._id) { setSelectedSession(null); setMessages([]); }
    setDeleteTarget(null);
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (ts) => new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  //  Session list 
  const SessionList = () => (
    <div className="flex-1 overflow-y-auto" ref={sessionListRef}>
      {sessions.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No active chats</p>
        </div>
      ) : sessions.map((session) => {
        const hasUnread = unreadSessions.has(session._id) || session.unreadCount > 0;
        return (
          <div
            key={session._id}
            className={`group relative border-b border-gray-100 dark:border-gray-700 transition-colors
              ${selectedSession?._id === session._id ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}
              ${hasUnread ? "bg-blue-50/50 dark:bg-blue-900/20" : ""}`}
          >
            <button onClick={() => selectSession(session)} className="w-full p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">{session.userName?.charAt(0)?.toUpperCase() || "G"}</span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${session.socketId ? "bg-green-500" : "bg-gray-300"}`} />
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">!</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{session.userName}</p>
                      {session.socketId ? <Wifi size={11} className="text-green-500 flex-shrink-0" /> : <WifiOff size={11} className="text-gray-300 flex-shrink-0" />}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-1">{formatTime(session.lastActivity)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{session.lastMessage || "No messages yet"}</p>
                </div>
              </div>
            </button>
            <button
              onClick={(e) => handleDeleteSession(session, e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400
                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30
                         opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );

  //  Render 
  return (
    <div>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden pb-16 lg:pb-0">

        {/*  Desktop vertical nav rail  */}
        <DesktopNavRail unreadChats={unreadSessions.size} />

        {/* Mobile overlay */}
        {chatSidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setChatSidebarOpen(false)} />
        )}

        {/*  Chat sessions sidebar*/}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-72 sm:w-80 bg-white dark:bg-gray-800
            border-r border-gray-200 dark:border-gray-700
            flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${chatSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          {/* Sidebar header */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                <Users size={18} className="text-blue-600" />
                Active Chats
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  {sessions.length}
                </span>
              </h2>
              <button
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                onClick={() => setChatSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <SessionList />
        </aside>

        {/*  Main chat area */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900">

          {/* Top bar */}
          <header className="flex-shrink-0 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">

              {selectedSession ? (
                <>
                  {/* Mobile: back to list */}
                  <button
                    className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                    onClick={() => { setSelectedSession(null); setChatSidebarOpen(true); }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">{selectedSession.userName?.charAt(0)?.toUpperCase() || "G"}</span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${selectedSession.socketId ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{selectedSession.userName}</h3>
                      {selectedSession.socketId
                        ? <span className="text-xs text-green-600 flex items-center gap-1 flex-shrink-0"><Wifi size={10} /> Online</span>
                        : <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0"><WifiOff size={10} /> Offline</span>}
                    </div>
                    <p className="text-xs text-gray-400 truncate">Started {formatDate(selectedSession.startedAt)}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteSession(selectedSession)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                               text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30
                               border border-red-200 dark:border-red-800 transition-colors font-medium"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">End Session</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile hamburger opens chat list */}
                  <button
                    className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    onClick={() => setChatSidebarOpen(true)}
                  >
                    <Menu size={22} />
                  </button>

                  {/* Brand + title — mobile only; desktop nav rail already shows branding */}
                  <div className="flex items-center gap-2 lg:hidden">
                    <div>
                      <span className="text-base font-bold text-gray-900 dark:text-white">Live Chat</span>
                      <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded font-medium">
                        Admin
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Right-side controls */}
              <div className="ml-auto flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
                >
                  {soundEnabled
                    ? <Bell size={18} className="text-gray-600 dark:text-gray-300" />
                    : <BellOff size={18} className="text-gray-400" />}
                  {unreadSessions.size > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? <Sun size={18} className="text-gray-300" /> : <Moon size={18} className="text-gray-600" />}
                </button>

                <SuperAdminProfile />
              </div>
            </div>
          </header>

          {/* Messages / empty state */}
          {selectedSession ? (
            <>
              <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-16">
                    <MessageSquare size={40} className="mx-auto mb-3 opacity-25" />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs mt-1">Send a reply to start the conversation</p>
                  </div>
                ) : messages.map((msg, index) => {
                  const isAdmin = msg.isAdmin;
                  return (
                    <div key={msg._id || index} className={`flex items-end gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
                      {!isAdmin && (
                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white text-xs font-medium">{selectedSession.userName?.charAt(0)?.toUpperCase() || "U"}</span>
                        </div>
                      )}
                      <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                        {isAdmin && <p className="text-xs text-gray-400 mb-1 px-1">{msg.adminName || "You"}</p>}
                        <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                          isAdmin
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm border border-gray-100 dark:border-gray-600"
                        } ${msg._optimistic ? "opacity-70" : ""}`}>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 px-1 ${isAdmin ? "justify-end" : "justify-start"}`}>
                          <Clock size={9} />
                          <span>{formatTime(msg.createdAt)}</span>
                          {isAdmin && <CheckCheck size={11} className={msg._optimistic ? "text-gray-300" : "text-blue-400"} />}
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white text-xs font-medium">A</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex-shrink-0 px-3 sm:px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 max-w-4xl mx-auto">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendReply()}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                               text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               placeholder:text-gray-400 transition-all"
                    autoFocus
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!inputMessage.trim()}
                    className="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl
                               disabled:opacity-40 disabled:cursor-not-allowed transition-colors
                               flex items-center gap-2 text-sm font-medium shadow-sm"
                  >
                    <Send size={15} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={28} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Select a conversation</h3>
                <p className="text-sm text-gray-400">Choose a user from the sidebar to start chatting</p>
                <button
                  className="mt-4 lg:hidden px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium"
                  onClick={() => setChatSidebarOpen(true)}
                >
                  View Chats ({sessions.length})
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <AdminBottomNav />

      {deleteTarget && (
        <DeleteModal session={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.15s ease-out; }
      `}</style>
    </div>
  );
};

export default ChatDashboard;