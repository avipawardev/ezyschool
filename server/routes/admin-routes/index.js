const express = require("express");
const {
  getDashboardStats,
  getAllCourses,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require("../../controllers/admin-controller/index");

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/courses", getAllCourses);
router.get("/users", getAllUsers);
router.put("/user/:id/role", updateUserRole);
router.delete("/user/:id", deleteUser);

module.exports = router;
