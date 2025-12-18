import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID"],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide course ID"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide amount"],
    min: 0,
  },
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  referralCommission: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["razorpay", "upi", "netbanking", "manual"],
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentGatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  subscriptionValidTill: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

paymentSchema.index({ userId: 1, courseId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ referrerId: 1 });

export default mongoose.model("Payment", paymentSchema);
