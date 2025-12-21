const express = require("express");
const {
  getAllNotifications,
  markNotificationAsRead,
} = require("../../controllers/common/notification-controller");

const router = express.Router();

router.get("/:userId", getAllNotifications);
router.put("/mark-as-read/:id", markNotificationAsRead);

module.exports = router;
