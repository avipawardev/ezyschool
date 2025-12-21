const mongoose = require("mongoose");

const SupportTicketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: String,
  userEmail: String,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "resolved", "closed"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  responses: [
    {
      senderId: String,
      senderName: String,
      role: String,
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SupportTicket", SupportTicketSchema);
