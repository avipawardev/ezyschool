import express from "express";
import {
  askDoubt,
  getStudentDoubts,
  getCourseDoubts,
  updateDoubtHelpful,
  getAllUnresolvedDoubts,
  updateDoubtAnswer,
} from "../controllers/doubtController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.post("/ask", auth, askDoubt);
router.get("/my-doubts", auth, getStudentDoubts);
router.get("/course/:courseId", auth, getCourseDoubts);
router.put("/helpful/:doubtId", auth, updateDoubtHelpful);

// Admin routes
router.get("/admin/unresolved", auth, adminAuth, getAllUnresolvedDoubts);
router.put("/admin/answer/:doubtId", auth, adminAuth, updateDoubtAnswer);

export default router;
