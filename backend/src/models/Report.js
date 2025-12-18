import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
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
  month: {
    type: Number,
    required: [true, "Please specify month"],
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: [true, "Please specify year"],
  },
  totalLecturesWatched: {
    type: Number,
    default: 0,
  },
  completedAssignments: {
    type: Number,
    default: 0,
  },
  totalAssignments: {
    type: Number,
    default: 0,
  },
  testPerformance: {
    totalTests: Number,
    passedTests: Number,
    averageScore: Number,
  },
  topicsLearned: [String],
  weeklyProgress: [
    {
      week: Number,
      lecturesWatched: Number,
      assignmentsCompleted: Number,
      doubtsSolved: Number,
    },
  ],
  performanceAnalysis: {
    type: String,
    enum: ["excellent", "good", "average", "needs-improvement"],
    default: "average",
  },
  reportUrl: {
    type: String,
    default: null,
  },
  sentToParent: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.index({ studentId: 1, month: 1, year: 1 });
reportSchema.index({ courseId: 1, studentId: 1 });

export default mongoose.model("Report", reportSchema);
