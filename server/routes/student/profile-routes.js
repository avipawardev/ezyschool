const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getCourseSuggestions,
} = require("../../controllers/student/profile-controller");

const router = express.Router();

router.get("/get/:id", getUserProfile);
router.put("/update/:id", updateUserProfile);
router.get("/suggestions/:id", getCourseSuggestions);

module.exports = router;
