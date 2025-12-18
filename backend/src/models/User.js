import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    unique: true,
    match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  class: {
    type: String,
    required: [true, "Please select your class"],
    enum: ["8", "9", "10", "11", "12"],
  },
  parentName: {
    type: String,
    required: [true, "Please provide parent name"],
  },
  parentPhone: {
    type: String,
    required: [true, "Please provide parent phone"],
    match: [/^[0-9]{10}$/, "Parent phone must be 10 digits"],
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  referralEarnings: {
    type: Number,
    default: 0,
  },
  referralHistory: [
    {
      referredUserId: mongoose.Schema.Types.ObjectId,
      earnings: Number,
      date: { type: Date, default: Date.now },
    },
  ],
  deviceId: {
    type: String,
    sparse: true,
  },
  subscriptionActive: {
    type: Boolean,
    default: false,
  },
  subscriptionValidTill: {
    type: Date,
    default: null,
  },
  subscribedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  profilePicture: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
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

// Indexes for performance optimization
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ referredBy: 1 });
userSchema.index({ role: 1 });

export default mongoose.model("User", userSchema);
