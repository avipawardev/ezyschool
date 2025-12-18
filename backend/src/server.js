import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
// Load environment variables (Loaded at top)
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Load environment variables


const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Initialize Services
import { initializeWhatsApp } from "./services/whatsappService.js";
import { initScheduledTasks } from "./services/cronService.js";

// Start services (non-blocking)
// Note: WhatsApp initialization might take a moment
try {
  initializeWhatsApp();
} catch (error) {
  console.warn("Failed to initialize WhatsApp service:", error.message);
}
initScheduledTasks();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(
  cors({
    origin: [
      process.env.FRONTEND_STUDENT_URL || "http://localhost:3000",
      process.env.FRONTEND_ADMIN_URL || "http://localhost:3001",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", (req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static("uploads"));

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// API Routes
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Server startup
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║    🚀 EzySchool LMS Backend Started    ║
║    📡 Server running on port ${PORT}      ║
║    🌍 Environment: ${process.env.NODE_ENV || "development"}        ║
╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

export default app;
