import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide course title"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide course description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide course price"],
    min: 0,
  },
  thumbnail: {
    type: String,
    required: [true, "Please provide course thumbnail"],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  class: {
    type: String,
    required: [true, "Please select class"],
    enum: ["8", "9", "10", "11", "12"],
  },
  subject: {
    type: String,
    required: [true, "Please select subject"],
  },
  totalLectures: {
    type: Number,
    default: 0,
  },
  totalAssignments: {
    type: Number,
    default: 0,
  },
  totalTests: {
    type: Number,
    default: 0,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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

courseSchema.index({ instructor: 1 });
courseSchema.index({ class: 1, subject: 1 });

export default mongoose.model("Course", courseSchema);
