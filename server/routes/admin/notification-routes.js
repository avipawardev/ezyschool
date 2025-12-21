const express = require("express");
const { createNotification } = require("../../controllers/admin/notification-controller");

const router = express.Router();

router.post("/create", createNotification);

module.exports = router;
