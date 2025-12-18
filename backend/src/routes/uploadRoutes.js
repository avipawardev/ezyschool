import express from "express";
import { getUploadUrl } from "../controllers/uploadController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get signed URL for upload
// Protected route - only logged in users can upload
router.post("/get-url", auth, getUploadUrl);

export default router;
