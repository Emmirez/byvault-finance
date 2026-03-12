import "dotenv/config";

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./src/routes/authRoutes.js";
import connectDB from "./src/config/db.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import superadminRoutes from "./src/routes/superadminRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import depositRoutes from "./src/routes/depositRoutes.js";
import adminDepositRoutes from "./src/routes/adminDepositRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import bankRoutes from "./src/routes/bankRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import cardRoutes from "./src/routes/CardRoutes.js";
import loanRoutes from "./src/routes/loanRoutes.js";
import taxRefundRoutes from "./src/routes/taxRefundRoutes.js";
import grantRoutes from "./src/routes/grantRoutes.js";
import supportRoutes from "./src/routes/supportRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import kycRoutes from "./src/routes/kycRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import twoFactorRoutes from "./src/routes/twoFactorRoutes.js";
import { setupChatHandlers } from "./src/controllers/chatController.js";
import cron from "node-cron";
import { checkExpiredSuspensions } from "./src/controllers/adminController.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import announcementRoutes from "./src/routes/announcementRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import securityRoutes from "./src/routes/securityRoutes.js";
import healthRoutes from "./src/routes/healthRoutes.js";
import adminProfileRoutes from "./src/routes/adminProfileRoutes.js";
import adminAlertRoutes from "./src/routes/adminAlertRoutes.js";
import { monitorSystemHealth } from "./src/services/systemMonitor.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import { getPublicPaymentSettings } from "./src/controllers/adminController.js";
import { protect } from "./src/middleware/authMiddleware.js";
import beneficiaryRoutes from "./src/routes/beneficiaryRoutes.js";

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet());

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://byvault-finance.vercel.app",
      "https://byvaultonline.com",
      "https://www.byvaultonline.com",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Start system monitoring
const monitor = monitorSystemHealth();

// Middleware to track requests
app.use((req, res, next) => {
  monitor.incrementRequests();

  // Track errors
  res.on("finish", () => {
    if (res.statusCode >= 500) {
      monitor.incrementErrors();
    }
  });

  next();
});

// Make io accessible in routes
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://byvault-finance.vercel.app",
      "https://byvaultonline.com",
      "https://www.byvaultonline.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/deposits", depositRoutes);

//Json middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Test route to verify server is running
app.get("/", (req, res) => {
  res.json({ message: "Byvault Finance API is running" });
});

//routes
app.use("/api", contactRoutes);
app.use("/api", twoFactorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/admin/deposits", adminDepositRoutes);
// BTC/Crypto deposits
app.use("/api", paymentRoutes);
//admin profile
app.use("/api/admin", adminProfileRoutes);

app.get("/api/payment-settings/public", protect, getPublicPaymentSettings);

// Use the routes
app.use("/api", bankRoutes);
app.use("/api", cardRoutes);
app.use("/api", loanRoutes);
app.use("/api", taxRefundRoutes);
app.use("/api", grantRoutes);
app.use("/api", supportRoutes);
app.use("/api", notificationRoutes);
app.use("/api", kycRoutes);
app.use("/api", userRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api", documentRoutes);
app.use("/api", announcementRoutes);
app.use("/api", settingsRoutes);
app.use("/api/admin/security", securityRoutes);
app.use("/api", healthRoutes);
app.use("/api/admin/alerts", adminAlertRoutes);
app.use("/api/admin/search", searchRoutes);
app.use("/api", beneficiaryRoutes);

// Run every hour to check for expired suspensions
cron.schedule("0 * * * *", async () => {
  console.log("Running expired suspensions check...");
  await checkExpiredSuspensions();
});

// Keep server alive - ping every 14 minutes
cron.schedule("*/14 * * * *", async () => {
  try {
    await fetch("https://byvault-backend.onrender.com/");
    console.log("✅ Keep-alive ping sent");
  } catch (error) {
    console.error("❌ Keep-alive ping failed:", error.message);
  }
});

// Setup chat handlers
setupChatHandlers(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Graceful shutdown (VERY IMPORTANT for nodemon + Socket.IO)
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  httpServer.close(() => {
    console.log("✅ Server closed cleanly");
    process.exit(0);
  });
});
