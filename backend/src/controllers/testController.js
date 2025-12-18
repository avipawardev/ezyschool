import Test from "../models/Test.js";
import Assignment from "../models/Assignment.js";
import Lecture from "../models/Lecture.js";
import Course from "../models/Course.js";

export const createTest = async (req, res, next) => {
  try {
    const {
      courseId,
      title,
      description,
      week,
      questions,
      duration,
      totalMarks,
      passingScore,
    } = req.body;

    if (
      !courseId ||
      !title ||
      !week ||
      !questions ||
      !duration ||
      !totalMarks
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const test = new Test({
      courseId,
      title,
      description,
      week,
      questions,
      duration,
      totalMarks,
      passingScore,
      totalQuestions: questions.length,
    });

    await test.save();

    // Update course test count
    await Course.findByIdAndUpdate(courseId, { $inc: { totalTests: 1 } });

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: test,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseTests = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const tests = await Test.find({
      courseId,
      isPublished: true,
    }).sort({ week: 1 });

    res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    next(error);
  }
};

export const getTestById = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTest = async (req, res, next) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.testId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data: test,
    });
  } catch (error) {
    next(error);
  }
};

export const publishTest = async (req, res, next) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.testId,
      { isPublished: true },
      { new: true }
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test published successfully",
      data: test,
    });
  } catch (error) {
    next(error);
  }
};
