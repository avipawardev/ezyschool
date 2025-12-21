const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  freePreview: Boolean,
  notes: String,
  pdfUrl: String,
  mcqs: [
    {
      question: String,
      options: [String],
      correctOption: Number,
    },
  ],
  assignment: [
    {
      title: String,
      // _id will be automatically added by Mongoose
    },
  ],
});

const CourseSchema = new mongoose.Schema({
  instructorId: {
    type: String,
    required: true,
    index: true,
  },
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  image: String,
  welcomeMessage: String,
  pricing: Number,
  objectives: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  curriculum: [LectureSchema],
  isPublised: Boolean,
});

module.exports = mongoose.model("Course", CourseSchema);
