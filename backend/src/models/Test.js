import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide course ID"],
  },
  title: {
    type: String,
    required: [true, "Please provide test title"],
    trim: true,
  },
  description: {
    type: String,
    default: null,
  },
  week: {
    type: Number,
    required: [true, "Please specify week number"],
  },
  totalQuestions: {
    type: Number,
    required: [true, "Please provide number of questions"],
  },
  duration: {
    type: Number, // in minutes
    required: [true, "Please provide test duration"],
  },
  passingScore: {
    type: Number,
    default: 40,
    min: 0,
    max: 100,
  },
  questions: [
    {
      question: String,
      questionType: {
        type: String,
        enum: ["mcq", "short-answer", "true-false"],
        default: "mcq",
      },
      options: [String],
      correctAnswer: String,
      marks: Number,
      explanation: String,
    },
  ],
  totalMarks: {
    type: Number,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
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

testSchema.index({ courseId: 1, week: 1 });

export default mongoose.model("Test", testSchema);
