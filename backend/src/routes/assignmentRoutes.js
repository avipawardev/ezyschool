import express from "express";
import {
  uploadAssignment,
  getAssignmentsByLecture,
  getStudentAssignments,
  gradeAssignment,
  getCourseAssignments,
  getAssignmentStats,
} from "../controllers/assignmentController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.post("/upload", auth, uploadAssignment);
router.get("/student/all", auth, getStudentAssignments);
router.get("/lecture/:lectureId", auth, getAssignmentsByLecture);
router.get("/course/:courseId", auth, getCourseAssignments);
router.get("/stats/:courseId", auth, getAssignmentStats);

// Admin routes
router.put("/grade/:assignmentId", auth, adminAuth, gradeAssignment);

export default router;
