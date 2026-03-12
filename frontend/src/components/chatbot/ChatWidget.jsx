/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
// src/components/ChatWidget.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import {
  X,
  Send,
  Maximize2,
  MessageCircle,
  User,
  Clock,
  Wifi,
  WifiOff,
  ChevronDown,
} from "lucide-react";

//  Persistence helpers
const STORAGE_KEY = "byvault_chat_messages";
const SESSION_KEY = "byvault_chat_session";
const USER_ID_KEY = "byvault_user_id";
const UNREAD_KEY = "byvault_unread_count";

const loadMessages = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveMessages = (msgs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-200)));
  } catch {}
};
const loadSession = () => {
  try {
    return localStorage.getItem(SESSION_KEY) || null;
  } catch {
    return null;
  }
};
const saveSession = (id) => {
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
  } catch {}
};
const loadUnread = () => {
  try {
    return parseInt(localStorage.getItem(UNREAD_KEY) || "0", 10);
  } catch {
    return 0;
  }
};
const saveUnread = (n) => {
  try {
    localStorage.setItem(UNREAD_KEY, String(n));
  } catch {}
};
const getPersistentUserId = () => {
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch {
    return `user_${Date.now()}`;
  }
};

const ChatWidget = ({ position = "right", primaryColor = "#2563eb" }) => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState(loadSession);
  const [isConnected, setIsConnected] = useState(false);
  // Unread seeded from localStorage so badge survives page refresh
  const [unreadCount, setUnreadCount] = useState(loadUnread);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const hasJoined = useRef(false);
  // Ref mirror of isOpen && !isMinimized so callbacks always see current value
  const chatVisibleRef = useRef(false);
  const persistentUserId = useRef(getPersistentUserId());

  // Keep visibility ref in sync
  useEffect(() => {
    chatVisibleRef.current = isOpen && !isMinimized;
  }, [isOpen, isMinimized]);

  // Persist messages
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Persist sessionId
  useEffect(() => {
    saveSession(sessionId);
  }, [sessionId]);

  // Persist unread + update tab title
  useEffect(() => {
    saveUnread(unreadCount);
    document.title =
      unreadCount > 0 ? `(${unreadCount}) Byvault Finance` : "Byvault Finance";
  }, [unreadCount]);

  //  Reset unread as soon as chat is open and visible
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  //  Message handler
const handleNewMessage = useCallback((message) => {
  setMessages((prev) => {
    // Deduplicate by server _id
    if (message._id && prev.some((m) => m._id === message._id)) return prev;

    // Swap optimistic placeholder for real server message
    const optIdx = prev.findIndex(
      (m) =>
        m._optimistic &&
        m.message === message.message
    );
    if (optIdx !== -1) {
      const next = [...prev];
      next[optIdx] = message;
      return next;
    }
    return [...prev, message];
  });

  if (message.sessionId) setSessionId(message.sessionId);

  // Increment unread ONLY for admin replies when chat isn't visible
  if (message.isAdmin && message.sender !== "system" && !chatVisibleRef.current) {
    setUnreadCount((prev) => prev + 1);
  }
}, []);

  const handleMessageHistory = useCallback((data) => {
    const history = Array.isArray(data) ? data : data.messages || [];
    setMessages(history);
    // History loads when chat opens — unread already reset by the isOpen effect
  }, []);

  // Socket (mount once)
  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      setIsConnected(true);
      // Reconnect path: re-announce so server delivers any queued messages
      if (hasJoined.current) {
        newSocket.emit("user-join", {
          userId: user?.id || persistentUserId.current,
          name: user?.firstName || "Guest",
          email: user?.email,
          sessionId: loadSession(),
        });
      }
    });

    newSocket.on("disconnect", () => setIsConnected(false));
    newSocket.on("connect_error", () => setIsConnected(false));

    newSocket.on("message", handleNewMessage);
    newSocket.on("message-history", handleMessageHistory);

    return () => {
      newSocket.off("message", handleNewMessage);
      newSocket.off("message-history", handleMessageHistory);
      newSocket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Join when chat opens for the first time 
  useEffect(() => {
    if (isOpen && socketRef.current?.connected && !hasJoined.current) {
      socketRef.current.emit("user-join", {
        userId: user?.id || persistentUserId.current,
        name: user?.firstName || "Guest",
        email: user?.email,
        sessionId: loadSession(),
      });
      hasJoined.current = true;
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  //  Fetch history when session is known 
  useEffect(() => {
    if (sessionId && isOpen && socketRef.current?.connected) {
      socketRef.current.emit("get-history", sessionId);
    }
  }, [sessionId, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) inputRef.current.focus();
  }, [isOpen, isMinimized]);

  // Send message 
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current?.connected) return;

    const text = inputMessage;
    setInputMessage("");
    const uid = user?.id || persistentUserId.current;

    // Optimistic render (user's own message never increments unread)
    setMessages((prev) => [
      ...prev,
      {
        message: text,
        sender: uid,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        _optimistic: true,
      },
    ]);

    // First-ever send: join then message
    if (!hasJoined.current) {
      socketRef.current.emit("user-join", {
        userId: uid,
        name: user?.firstName || "Guest",
        email: user?.email,
        sessionId: loadSession(),
      });
      hasJoined.current = true;

      // Friendly auto-reply only on very first contact
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            message:
              "👋 Hello! Thanks for contacting Byvault Support. An agent will be with you shortly.",
            sender: "system",
            isAdmin: false,
            createdAt: new Date().toISOString(),
            _localOnly: true,
          },
        ]);
      }, 600);
    }

    socketRef.current.emit("user-message", {
      text,
      sessionId: loadSession(),
      userId: uid,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Formatters 
  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    if (d.toDateString() === now.toDateString()) return "Today";
    if (d.toDateString() === yest.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const groupedMessages = messages.reduce((groups, msg, i) => {
    const label = formatDate(msg.createdAt);
    if (!groups.length || groups[groups.length - 1].date !== label)
      groups.push({ date: label, messages: [] });
    groups[groups.length - 1].messages.push({ ...msg, _index: i });
    return groups;
  }, []);

  const widgetStyle = {
    position: "fixed",
    [position]: "24px",
    bottom: "24px",
    zIndex: 9999,
  };

  // Launcher 
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: primaryColor, ...widgetStyle }}
        className="w-14 h-14 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center relative"
      >
        <MessageCircle size={24} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    );
  }

  //  Chat window
  return (
    <div
      style={widgetStyle}
      className="w-[380px] max-w-[calc(100vw-32px)] font-sans"
    >
      <div
        className="rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
        style={{
          height: isMinimized ? "64px" : "min(560px, calc(100dvh - 100px))",
          background: "white",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
          }}
          className="flex items-center justify-between px-4 py-3 flex-shrink-0 cursor-pointer select-none"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                  isConnected ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">
                Byvault Support
              </p>
              <p className="text-white/70 text-xs leading-tight flex items-center gap-1">
                {isConnected ? (
                  <>
                    <Wifi size={10} /> Online
                  </>
                ) : (
                  <>
                    <WifiOff size={10} /> Reconnecting…
                  </>
                )}
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? (
                <Maximize2 size={15} className="text-white" />
              ) : (
                <ChevronDown size={15} className="text-white" />
              )}
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsMinimized(false);
              }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div
              className="flex-1 overflow-y-auto px-4 py-4"
              style={{ background: "#f8fafc" }}
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div
                    style={{ backgroundColor: `${primaryColor}15` }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  >
                    <MessageCircle size={26} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">
                      How can we help?
                    </p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Send us a message and our team
                      <br />
                      will get back to you shortly.
                    </p>
                  </div>
                </div>
              )}

              {groupedMessages.map(({ date, messages: dayMsgs }) => (
                <div key={date}>
                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[11px] text-slate-400 font-medium px-2">
                      {date}
                    </span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {dayMsgs.map((msg) => {
                    const isUser = !msg.isAdmin && msg.sender !== "system";
                    const isSystem = msg.sender === "system";

                    if (isSystem) {
                      return (
                        <div
                          key={msg._index}
                          className="flex justify-center my-2"
                        >
                          <div className="bg-slate-100 text-slate-500 text-xs italic px-3 py-1.5 rounded-full">
                            {msg.message}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg._index}
                        className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                            msg.isAdmin ? "bg-emerald-500" : ""
                          }`}
                          style={
                            !msg.isAdmin && isUser
                              ? { backgroundColor: primaryColor }
                              : {}
                          }
                        >
                          <User size={14} className="text-white" />
                        </div>

                        <div
                          className={`flex flex-col gap-1 max-w-[72%] ${isUser ? "items-end" : "items-start"}`}
                        >
                          {!isUser && (
                            <span className="text-[11px] font-medium text-slate-400 ml-1">
                              Support Agent
                            </span>
                          )}
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                              isUser
                                ? "text-white rounded-br-md"
                                : "bg-white text-slate-800 border border-slate-100 rounded-bl-md"
                            }`}
                            style={
                              isUser ? { backgroundColor: primaryColor } : {}
                            }
                          >
                            {msg.message}
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mx-1">
                            <Clock size={9} />
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 bg-white border-t border-slate-100 flex-shrink-0">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-300 transition-colors">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 100) + "px";
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message…"
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none outline-none max-h-24 py-0.5"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !isConnected}
                  style={{
                    backgroundColor:
                      inputMessage.trim() && isConnected
                        ? primaryColor
                        : undefined,
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:bg-slate-200 disabled:cursor-not-allowed hover:opacity-90"
                >
                  <Send
                    size={15}
                    className={
                      inputMessage.trim() && isConnected
                        ? "text-white"
                        : "text-slate-400"
                    }
                  />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                Powered by Byvault · We typically reply within minutes
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
