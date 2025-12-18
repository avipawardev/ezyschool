import Report from "../models/Report.js";
import Assignment from "../models/Assignment.js";
import Lecture from "../models/Lecture.js";
import User from "../models/User.js";

export const generateMonthlyReport = async (req, res, next) => {
  try {
    const { studentId, courseId, month, year } = req.body;

    if (!studentId || !courseId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Course ID, month, and year are required",
      });
    }

    // Check if report already exists
    const existingReport = await Report.findOne({
      studentId,
      courseId,
      month,
      year,
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "Report already generated for this month",
      });
    }

    // Get all assignments for the student in this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const assignments = await Assignment.find({
      studentId,
      courseId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const completedAssignments = assignments.filter(
      (a) => a.status !== "pending"
    ).length;
    const totalAssignments = assignments.length;

    // Calculate weekly progress
    const weeklyProgress = [];
    for (let week = 1; week <= 4; week++) {
      const weekStart = new Date(year, month - 1, 1 + (week - 1) * 7);
      const weekEnd = new Date(year, month - 1, week * 7);

      const weekAssignments = assignments.filter(
        (a) => a.submittedAt >= weekStart && a.submittedAt <= weekEnd
      );

      weeklyProgress.push({
        week,
        lecturesWatched: 0, // Would need to track this separately
        assignmentsCompleted: weekAssignments.length,
        doubtsSolved: 0, // Would need to track this separately
      });
    }

    // Create report
    const report = new Report({
      studentId,
      courseId,
      month,
      year,
      totalLecturesWatched: 0,
      completedAssignments,
      totalAssignments,
      weeklyProgress,
      performanceAnalysis:
        completedAssignments / totalAssignments > 0.8
          ? "excellent"
          : completedAssignments / totalAssignments > 0.6
          ? "good"
          : "average",
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "Monthly report generated successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentReport = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const reports = await Report.find({ studentId })
      .populate("courseId", "title")
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyReport = async (req, res, next) => {
  try {
    const { studentId, month, year } = req.params;

    const report = await Report.findOne({
      studentId,
      month,
      year,
    })
      .populate("courseId", "title")
      .populate("studentId", "name email parentName parentPhone");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMonthlyReports = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const query = {};
    if (month) query.month = month;
    if (year) query.year = year;

    const reports = await Report.find(query)
      .populate("studentId", "name email parentPhone")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

import * as whatsappService from "../services/whatsappService.js";

export const updateReportStatus = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { sentToParent } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        sentToParent,
        sentAt: sentToParent ? new Date() : null,
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report status updated",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const sendReportToParent = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findById(reportId)
      .populate("studentId", "name parentName parentPhone")
      .populate("courseId", "title");

    if (!report) {
      return res.status(404).json({
        success: false, 
        message: "Report not found" 
      });
    }

    const student = report.studentId;
    const parentPhone = student.parentPhone;

    if (!parentPhone) {
        return res.status(400).json({
          success: false,
          message: "Parent phone number not found"
        });
    }

    const message = `Hello ${student.parentName},\n\nHere is the monthly progress report for ${student.name} for the course ${report.courseId.title}.\n\nAssignments Completed: ${report.completedAssignments}\nPerformance: ${report.performanceAnalysis}\n\nThank you,\nEzySchool Team`;

    await whatsappService.sendMessage(parentPhone, message);

    // Update status
    report.sentToParent = true;
    report.sentAt = new Date();
    await report.save();

    res.status(200).json({
      success: true,
      message: "Report sent via WhatsApp successfully",
    });

  } catch (error) {
    next(error);
  }
};
