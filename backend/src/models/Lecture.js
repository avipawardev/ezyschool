import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide course ID"],
  },
  title: {
    type: String,
    required: [true, "Please provide lecture title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide lecture description"],
  },
  week: {
    type: Number,
    required: [true, "Please specify week number"],
  },
  videoUrl: {
    type: String,
    required: [true, "Please provide video URL"],
    // Can be YouTube unlisted, Cloudinary video, or local file URL
  },
  videoDuration: {
    type: Number, // in seconds
    default: 0,
  },
  notesUrl: {
    type: String,
    default: null,
  },
  lectureEmbeddings: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
    // Stores embeddings in JSON format for AI doubt solving
  },
  lectureContent: {
    type: String,
    default: null,
    // Raw text content of lecture for embedding generation
  },
  resources: [
    {
      title: String,
      url: String,
      type: String,
    },
  ],
  isPublished: {
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

lectureSchema.index({ courseId: 1, week: 1 });

export default mongoose.model("Lecture", lectureSchema);
