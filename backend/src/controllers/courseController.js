import * as courseService from "../services/courseService.js";

export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      class: courseClass,
      subject,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !courseClass ||
      !subject
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const course = await courseService.createCourse(
      { title, description, price, thumbnail, class: courseClass, subject },
      req.userId
    );

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    const { class: courseClass, subject } = req.query;
    const courses = await courseService.getAllCourses({
      class: courseClass,
      subject,
    });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.courseId);

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(
      req.params.courseId,
      req.body,
      req.userId
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const result = await courseService.deleteCourse(
      req.params.courseId,
      req.userId
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const result = await courseService.enrollStudentInCourse(
      courseId,
      req.userId
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getStudentCourses(req.userId);

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseStats = async (req, res, next) => {
  try {
    const stats = await courseService.getCourseStats(req.params.courseId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
