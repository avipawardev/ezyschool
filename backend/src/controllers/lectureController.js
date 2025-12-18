import Lecture from "../models/Lecture.js";
import Course from "../models/Course.js";
import { generateEmbeddings, splitTextIntoChunks } from "../utils/ai.js";

export const createLecture = async (req, res, next) => {
  try {
    const {
      courseId,
      title,
      description,
      week,
      videoUrl,
      notesUrl,
      lectureContent,
    } = req.body;

    if (!courseId || !title || !description || !week || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Generate embeddings for lecture content if provided
    let embeddings = null;
    if (lectureContent) {
      try {
        const chunks = splitTextIntoChunks(lectureContent, 500);
        embeddings = await Promise.all(
          chunks.map((chunk) => generateEmbeddings(chunk))
        );
      } catch (error) {
        console.warn("Failed to generate embeddings:", error.message);
      }
    }

    const lecture = new Lecture({
      courseId,
      title,
      description,
      week,
      videoUrl,
      notesUrl,
      lectureContent,
      lectureEmbeddings: embeddings,
    });

    await lecture.save();

    // Update course lecture count
    await Course.findByIdAndUpdate(courseId, { $inc: { totalLectures: 1 } });

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseLectures = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const lectures = await Lecture.find({ courseId, isPublished: true }).sort({
      week: 1,
    });

    res.status(200).json({
      success: true,
      data: lectures,
    });
  } catch (error) {
    next(error);
  }
};

export const getLectureById = async (req, res, next) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const updateData = req.body;

    const lecture = await Lecture.findByIdAndUpdate(
      lectureId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Update course lecture count
    await Course.findByIdAndUpdate(lecture.courseId, {
      $inc: { totalLectures: -1 },
    });

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
