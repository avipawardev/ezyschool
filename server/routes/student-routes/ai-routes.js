const express = require("express");
const { getAIResponse } = require("../../controllers/student-controller/ai-controller");

const router = express.Router();

router.post("/chat", getAIResponse);

module.exports = router;
