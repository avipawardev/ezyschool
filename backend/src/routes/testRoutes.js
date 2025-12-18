import express from "express";
import {
  createTest,
  getCourseTests,
  getTestById,
  updateTest,
  publishTest,
} from "../controllers/testController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.get("/course/:courseId", auth, getCourseTests);
router.get("/:testId", auth, getTestById);

// Admin routes
router.post("/create", auth, adminAuth, createTest);
router.put("/:testId", auth, adminAuth, updateTest);
router.put("/:testId/publish", auth, adminAuth, publishTest);

export default router;
