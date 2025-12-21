const express = require("express");
const { createInstructorNotification } = require("../../controllers/instructor-controller/notification-controller");

const router = express.Router();

router.post("/create", createInstructorNotification);

module.exports = router;
