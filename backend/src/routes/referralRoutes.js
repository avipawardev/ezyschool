import express from "express";
import {
  getReferralInfo,
  getAllReferrals,
  processReferralPayment,
} from "../controllers/referralController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.get("/my-earnings", auth, getReferralInfo);

// Admin routes
router.get("/admin/all-referrals", auth, adminAuth, getAllReferrals);
router.post("/admin/process-payment", auth, adminAuth, processReferralPayment);

export default router;
