const express = require("express");
const { createTicket, getTickets, updateTicketStatus, addReply } = require("../controllers/support-controller");

const router = express.Router();

router.post("/create", createTicket);
router.get("/get", getTickets);
router.put("/update/:id", updateTicketStatus);
router.put("/reply/:id", addReply);

module.exports = router;
