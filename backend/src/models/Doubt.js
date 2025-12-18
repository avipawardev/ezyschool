import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide student ID"],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide course ID"],
  },
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    default: null,
  },
  question: {
    type: String,
    required: [true, "Please provide your question"],
  },
  language: {
    type: String,
    enum: ["english", "hindi", "marathi"],
    default: "english",
  },
  answer: {
    type: String,
    default: null,
  },
  answerLanguage: {
    type: String,
    enum: ["english", "hindi", "marathi"],
    default: "english",
  },
  relatedContexts: [String],
  // Stores chunks of lecture notes relevant to the doubt
  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
});

doubtSchema.index({ studentId: 1 });
doubtSchema.index({ courseId: 1, isResolved: 1 });

export default mongoose.model("Doubt", doubtSchema);
