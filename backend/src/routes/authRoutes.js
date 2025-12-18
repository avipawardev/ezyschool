import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/logout", auth, logout);

export default router;
