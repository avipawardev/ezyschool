import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";

export const uploadAssignment = async (req, res, next) => {
  try {
    const {
      lectureId,
      courseId,
      title,
      description,
      dueDate,
      imageUrl,
      submissionText,
    } = req.body;

    if (!lectureId || !courseId || !title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const assignment = new Assignment({
      lectureId,
      courseId,
      studentId: req.userId,
      title,
      description,
      dueDate,
      imageUrl,
      submissionText,
      status: "submitted",
      submittedAt: new Date(),
    });

    await assignment.save();

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentsByLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const assignments = await Assignment.find({
      lectureId,
      studentId: req.userId,
    }).populate("lectureId", "title");

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({
      studentId: req.userId,
    })
      .populate("lectureId", "title")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

export const gradeAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { score, feedback } = req.body;

    if (score === undefined || !feedback) {
      return res.status(400).json({
        success: false,
        message: "Score and feedback are required",
      });
    }

    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      {
        score,
        feedback,
        status: "graded",
        gradedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment graded successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseAssignments = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({
      courseId,
      studentId: req.userId,
    }).populate("lectureId", "title week");

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentStats = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.find({
      courseId,
      studentId: req.userId,
    });

    const total = assignments.length;
    const submitted = assignments.filter((a) => a.status !== "pending").length;
    const graded = assignments.filter((a) => a.status === "graded").length;
    const averageScore =
      graded > 0
        ? (
            assignments
              .filter((a) => a.status === "graded")
              .reduce((sum, a) => sum + a.score, 0) / graded
          ).toFixed(2)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        submitted,
        graded,
        averageScore,
      },
    });
  } catch (error) {
    next(error);
  }
};
