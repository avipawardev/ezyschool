import express from "express";
import {
  generateMonthlyReport,
  getStudentReport,
  getMonthlyReport,
  getAllMonthlyReports,
  updateReportStatus,
  sendReportToParent,
} from "../controllers/reportController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.get("/student/:studentId", auth, getStudentReport);
router.get("/:studentId/:month/:year", auth, getMonthlyReport);

// Admin routes
router.post("/generate", auth, adminAuth, generateMonthlyReport);
router.get("/admin/all", auth, adminAuth, getAllMonthlyReports);
router.put("/:reportId/status", auth, adminAuth, updateReportStatus);
router.post("/:reportId/send", auth, adminAuth, sendReportToParent);

export default router;
