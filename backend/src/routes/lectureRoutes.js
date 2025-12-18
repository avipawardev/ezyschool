import express from "express";
import {
  createLecture,
  getCourseLectures,
  getLectureById,
  updateLecture,
  deleteLecture,
} from "../controllers/lectureController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.get("/course/:courseId", auth, getCourseLectures);
router.get("/:lectureId", auth, getLectureById);

// Admin routes
router.post("/create", auth, adminAuth, createLecture);
router.put("/:lectureId", auth, adminAuth, updateLecture);
router.delete("/:lectureId", auth, adminAuth, deleteLecture);

export default router;
