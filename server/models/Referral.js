const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: String,
    required: true,
  },
  referrerName: String,
  referrerEmail: String,
  referredUserId: {
    type: String,
    required: true,
  },
  referredUserName: String,
  referredUserEmail: String,
  courseId: String,
  courseTitle: String,
  amount: {
    type: Number,
    required: true,
  },
  commissionPercentage: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Referral", ReferralSchema);
