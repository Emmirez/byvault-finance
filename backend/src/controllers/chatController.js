// src/controllers/chatController.js
import ChatMessage from "../models/ChatMessage.js";
import ChatSession from "../models/ChatSession.js";

export const setupChatHandlers = (io) => {
  // Track online users with their persistent IDs
  const onlineUsers = new Map(); // userId -> { socketId, sessionId }

  io.on("connection", (socket) => {
    console.log("🔌 New chat connection:", socket.id);

    // Handle user joining chat
    socket.on("user-join", async (data) => {
      try {
        const { userId, name, email, sessionId } = data;

        console.log(
          `👤 User joining - persistentUserId: ${userId}, name: ${name}, socket: ${socket.id}`,
        );

        // Store user info in socket for later use
        socket.persistentUserId = userId;
        socket.userName = name || "Guest";

        // Add to online users map
        onlineUsers.set(userId, {
          socketId: socket.id,
          sessionId: sessionId,
        });

        let session = null;

        // CRITICAL: First try to find by sessionId if provided
        if (sessionId) {
          session = await ChatSession.findById(sessionId);
          if (session) {
            console.log(`📋 Found session by sessionId: ${session._id}`);
          }
        }

        // If not found by sessionId, try by persistent userId
        if (!session && userId) {
          session = await ChatSession.findOne({
            userId: userId, // Now this will match the persistent userId
            status: "active",
          }).sort({ lastActivity: -1 });

          if (session) {
            console.log(
              `📋 Found session by persistent userId: ${session._id}`,
            );
          }
        }

        // If still no session, create a new one
        if (!session) {
          session = new ChatSession({
            userId: userId, // Store the persistent userId
            userName: name || "Guest",
            userEmail: email,
            socketId: socket.id,
            startedAt: new Date(),
            lastActivity: new Date(),
            status: "active",
          });
          await session.save();
          console.log(
            "✅ New session created:",
            session._id,
            "for persistent user:",
            userId,
          );
        } else {
          // Update existing session
          const wasOffline = !session.socketId;

          session.socketId = socket.id;
          session.lastActivity = new Date();
          session.status = "active";
          if (name) session.userName = name;
          if (email) session.userEmail = email;

          await session.save();
          console.log(
            `🔄 Existing session updated: ${session._id} (was ${wasOffline ? "offline" : "online"} → online)`,
          );
        }

        // CRITICAL: Always join the room for this session
        socket.join(session._id.toString());
        console.log(`🚪 User joined room: ${session._id.toString()}`);

        // Send session info back to client
        socket.emit("session-created", {
          sessionId: session._id,
          userId: userId,
        });

        // Send any pending offline messages (admin messages that weren't delivered)
        const offlineMessages = await ChatMessage.find({
          sessionId: session._id,
          isAdmin: true,
          delivered: false,
        }).sort({ createdAt: 1 });

        if (offlineMessages.length > 0) {
          console.log(
            `📨 Sending ${offlineMessages.length} offline messages to user ${session.userName}`,
          );

          for (const msg of offlineMessages) {
            socket.emit("message", {
              ...msg.toObject(),
              _id: msg._id,
              sessionId: session._id,
            });
            msg.delivered = true;
            await msg.save();
          }
        }

        // Send recent messages for context
        const recentMessages = await ChatMessage.find({
          sessionId: session._id,
        })
          .sort({ createdAt: -1 })
          .limit(50);

        if (recentMessages.length > 0) {
          const history = recentMessages.reverse();
          socket.emit("message-history", {
            sessionId: session._id,
            messages: history,
          });
        }

        // Send welcome message for new sessions
        if (recentMessages.length === 0 && offlineMessages.length === 0) {
          const welcomeMsg = new ChatMessage({
            sessionId: session._id,
            sender: "system",
            message:
              "👋 Welcome to Byvault Support! A support representative will reply to you shortly",
            isAdmin: false,
            delivered: true,
          });
          await welcomeMsg.save();
          socket.emit("message", welcomeMsg);
        }

        // Notify admins that user is online
        io.to("admin-room").emit("user-online", {
          sessionId: session._id,
          userId: session.userId,
          userName: session.userName,
          socketId: socket.id,
        });

        // Send updated session list to admins
        const activeSessions = await ChatSession.find({
          status: "active",
          lastActivity: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }).sort({ lastActivity: -1 });

        io.to("admin-room").emit("active-sessions", activeSessions);
      } catch (error) {
        console.error("Error in user-join:", error);
      }
    });

    // Handle user message
    socket.on("user-message", async (data) => {
      try {
        const { text, sessionId, userId } = data;
        console.log("💬 User message received:", { text, sessionId, userId });

        let session = null;

        // Try to find by sessionId first
        if (sessionId) {
          session = await ChatSession.findById(sessionId);
        }

        // If not found by sessionId, try by persistent userId
        if (!session && userId) {
          session = await ChatSession.findOne({
            userId: userId,
            status: "active",
          }).sort({ lastActivity: -1 });
        }

        // If still not found, create a NEW session with persistent userId
        if (!session) {
          console.log(
            "🆕 No session found, creating new one with persistent ID:",
            userId,
          );
          session = new ChatSession({
            userId: userId, // Store the persistent userId
            userName: "Guest",
            socketId: socket.id,
            startedAt: new Date(),
            lastActivity: new Date(),
            status: "active",
          });
          await session.save();
          console.log("✅ New session created from message:", session._id);

          socket.join(session._id.toString());

          // Update online users map
          onlineUsers.set(userId, {
            socketId: socket.id,
            sessionId: session._id,
          });

          // Notify admins about new session
          io.to("admin-room").emit("new-session", {
            _id: session._id,
            userId: session.userId,
            userName: session.userName,
            startedAt: session.startedAt,
            lastActivity: session.lastActivity,
            lastMessage: text,
            socketId: session.socketId,
          });
        } else {
          // Ensure socket is in the session room
          socket.join(session._id.toString());

          // Update online status
          onlineUsers.set(userId || session.userId, {
            socketId: socket.id,
            sessionId: session._id,
          });
        }

        // Check if user was offline
        const wasOffline = !onlineUsers.has(userId || session.userId);

        // Create and save message
        const message = new ChatMessage({
          sessionId: session._id,
          sender: userId || session.userId,
          message: text,
          isAdmin: false,
          delivered: true,
          createdAt: new Date(),
        });
        await message.save();

        // Update session
        session.lastMessage = text;
        session.lastActivity = new Date();
        session.socketId = socket.id;
        session.status = "active";
        await session.save();

        // Tell admin the user is online (if they were offline)
        if (wasOffline) {
          io.to("admin-room").emit("user-online", {
            sessionId: session._id,
            userId: session.userId,
            userName: session.userName,
            socketId: socket.id,
          });
        }

        // Send confirmation to user
        socket.emit("message", {
          ...message.toObject(),
          _id: message._id,
          sessionId: session._id,
        });

        // Send to admins
        io.to("admin-room").emit("new-message", {
          ...message.toObject(),
          _id: message._id,
          sessionId: session._id,
          userName: session.userName,
          socketId: socket.id,
          userOnline: true,
        });

        console.log("✅ Message processed for session:", session._id);
      } catch (error) {
        console.error("Error in user-message:", error);
      }
    });

    // Admin joins
    socket.on("admin-join", () => {
      socket.join("admin-room");
      console.log("👨‍💼 Admin joined chat, ID:", socket.id);
    });

    // Admin reply
    // Admin reply
    socket.on("admin-reply", async (data) => {
      try {
        const { sessionId, text, adminId, adminName } = data;
        console.log("✉️ Admin reply:", { sessionId, text, adminName });

        const session = await ChatSession.findById(sessionId);
        if (!session) {
          console.error("❌ Session not found for admin reply");
          return;
        }

        // Check if user is online using the onlineUsers map
        const userOnline = onlineUsers.has(session.userId);
        console.log(
          `📊 User ${session.userName} (${session.userId}) is ${userOnline ? "🟢 ONLINE" : "🔴 OFFLINE"}`,
        );

        const message = new ChatMessage({
          sessionId,
          sender: adminId || "admin",
          message: text,
          isAdmin: true,
          adminName,
          delivered: userOnline,
          createdAt: new Date(),
        });
        await message.save();

        session.lastMessage = text;
        session.lastActivity = new Date();
        session.status = "active";
        await session.save();

        // Send to admin room
        const messageForAdmin = {
          ...message.toObject(),
          _id: message._id,
          sessionId,
          userName: session.userName,
          delivered: userOnline,
          isOffline: !userOnline,
        };

        io.to("admin-room").emit("new-message", messageForAdmin);

        // If user is online, send immediately
        if (userOnline) {
          // Get the user's socket ID from onlineUsers
          const userData = onlineUsers.get(session.userId);

          if (userData && userData.socketId) {
            // Send directly to the user's socket
            io.to(userData.socketId).emit("message", {
              ...message.toObject(),
              _id: message._id,
              sessionId,
            });

            console.log(
              `✅ Admin reply sent to online user ${session.userName} via socket ${userData.socketId}`,
            );

            socket.emit("message-sent", {
              ...message.toObject(),
              _id: message._id,
              sessionId,
              delivered: true,
            });
          } else {
            // Fallback to room emit
            io.to(session._id.toString()).emit("message", {
              ...message.toObject(),
              _id: message._id,
              sessionId,
            });
            console.log(
              `✅ Admin reply sent to online user ${session.userName} via room`,
            );
          }
        } else {
          console.log(
            `📨 User ${session.userName} is offline, message queued for delivery (ID: ${message._id})`,
          );

          socket.emit("message-sent", {
            ...message.toObject(),
            _id: message._id,
            sessionId,
            delivered: false,
            queued: true,
          });
        }
      } catch (error) {
        console.error("Error in admin-reply:", error);
      }
    });
    // Admin ends (deletes) a session
    socket.on("admin-end-session", async (data) => {
      try {
        const { sessionId } = data;
        console.log("🗑️ Admin deleting session:", sessionId);

        const session = await ChatSession.findById(sessionId);
        if (session) {
          // Remove from online users if present
          onlineUsers.delete(session.userId);
        }

        const deletedMessages = await ChatMessage.deleteMany({ sessionId });
        console.log(`🗑️ Deleted ${deletedMessages.deletedCount} messages`);

        await ChatSession.findByIdAndDelete(sessionId);
        console.log("🗑️ Session deleted:", sessionId);

        io.to(sessionId.toString()).emit("session-ended", sessionId);
        io.to("admin-room").emit("session-ended", sessionId);
      } catch (error) {
        console.error("Error in admin-end-session:", error);
      }
    });

    // Get session history
    socket.on("get-history", async (sessionId) => {
      try {
        console.log("📜 Getting history for session:", sessionId);
        const messages = await ChatMessage.find({ sessionId })
          .sort({ createdAt: 1 })
          .limit(100);

        socket.emit("message-history", {
          sessionId,
          messages,
        });
      } catch (error) {
        console.error("Error getting history:", error);
      }
    });

    // Get active sessions (admin)
    socket.on("get-active-sessions", async () => {
      try {
        const sessions = await ChatSession.find({
          status: "active",
          lastActivity: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }).sort({ lastActivity: -1 });

        // Add online status to each session
        const sessionsWithStatus = sessions.map((session) => ({
          ...session.toObject(),
          isOnline: onlineUsers.has(session.userId),
        }));

        socket.emit("active-sessions", sessionsWithStatus);
      } catch (error) {
        console.error("Error getting active sessions:", error);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      socket.to("admin-room").emit("user-typing", data);
    });

   
    // Disconnect
    socket.on("disconnect", async () => {
      console.log("🔌 Chat disconnected:", socket.id);

      try {
        // Find which user had this socket ID
        let disconnectedUserId = null;
        let disconnectedSession = null;

        // Find session by socketId
        const session = await ChatSession.findOneAndUpdate(
          { socketId: socket.id, status: "active" },
          {
            lastActivity: new Date(),
            socketId: null,
          },
          { new: true },
        );

        if (session) {
          disconnectedUserId = session.userId;
          disconnectedSession = session;

          // Remove from online users using the persistent userId
          onlineUsers.delete(session.userId);

          io.to("admin-room").emit("user-offline", {
            sessionId: session._id,
            userId: session.userId,
            userName: session.userName,
            lastActivity: session.lastActivity,
          });

          console.log(
            `👤 User went offline: ${session.userName} (${session.userId}) - session: ${session._id}`,
          );
        }

        // Also check if there's any user in onlineUsers with this socketId (cleanup)
        for (const [userId, userData] of onlineUsers.entries()) {
          if (userData.socketId === socket.id) {
            onlineUsers.delete(userId);
            console.log(`👤 Cleaned up user ${userId} from online users map`);

            // If we haven't already notified about this user
            if (!disconnectedUserId || disconnectedUserId !== userId) {
              io.to("admin-room").emit("user-offline", {
                userId: userId,
                lastActivity: new Date(),
              });
            }
          }
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });
};
