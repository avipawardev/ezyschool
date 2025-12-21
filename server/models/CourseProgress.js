const mongoose = require("mongoose");

const LectureProgressSchema = new mongoose.Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date,
  assignmentsProgress: [
    {
      assignmentId: String,
      submitted: Boolean,
      assignmentUrl: String,
      public_id: String, // Cloudinary ID for deletion
      submissionDate: Date, // For tracking expiration
    },
  ],
  mcqScore: Number,
  mcqCompleted: Boolean,
});

const CourseProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  completed: Boolean,
  completionDate: Date,
  lecturesProgress: [LectureProgressSchema],
});

module.exports = mongoose.model("Progress", CourseProgressSchema);
