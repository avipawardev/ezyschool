import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: [true, "Please provide lecture ID"],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide student ID"],
  },
  title: {
    type: String,
    required: [true, "Please provide assignment title"],
  },
  description: {
    type: String,
    default: null,
  },
  dueDate: {
    type: Date,
    required: [true, "Please provide due date"],
  },
  imageUrl: {
    type: String,
    default: null,
  },
  submissionText: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "submitted", "graded"],
    default: "pending",
  },
  score: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  feedback: {
    type: String,
    default: null,
  },
  submittedAt: {
    type: Date,
    default: null,
  },
  gradedAt: {
    type: Date,
    default: null,
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

assignmentSchema.index({ studentId: 1, lectureId: 1 });
assignmentSchema.index({ courseId: 1, studentId: 1 });
assignmentSchema.index({ status: 1 });

export default mongoose.model("Assignment", assignmentSchema);
