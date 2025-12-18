import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getStudentCourses,
  getCourseStats,
} from "../controllers/courseController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllCourses);

// Student routes - MUST BE BEFORE /:courseId ROUTE
router.post("/enroll", auth, enrollCourse);
router.get("/my-courses", auth, getStudentCourses);

// Admin routes
router.post("/create", auth, adminAuth, createCourse);

// ID-based routes - MUST BE AFTER named routes
router.get("/:courseId/stats", auth, adminAuth, getCourseStats);
router.put("/:courseId", auth, adminAuth, updateCourse);
router.delete("/:courseId", auth, adminAuth, deleteCourse);
router.get("/:courseId", getCourse);

export default router;
