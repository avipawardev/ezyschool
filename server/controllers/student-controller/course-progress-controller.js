const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const { deleteMediaFromCloudinary } = require("../../helpers/cloudinary");

//mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //check all the lectures are viewed or not
    const allLecturesViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();

      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    const isCurrentCoursePurchasedByCurrentUserOrNot =
      studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId === courseId
      ) > -1;

    if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to purchase this course to access it.",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//reset course progress

const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    // Iterate through progress to find and delete assignment submissions from Cloudinary
    if (progress.lecturesProgress && progress.lecturesProgress.length > 0) {
        for (const lecture of progress.lecturesProgress) {
            if (lecture.assignmentsProgress && lecture.assignmentsProgress.length > 0) {
                for (const assignment of lecture.assignmentsProgress) {
                    if (assignment.public_id) {
                        try {
                            await deleteMediaFromCloudinary(assignment.public_id);
                        } catch (err) {
                            console.error(`Failed to delete assignment image ${assignment.public_id}:`, err);
                            // Continue deleting others even if one fails
                        }
                    }
                }
            }
        }
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { userId, courseId, lectureId, assignmentId, assignmentUrl, public_id } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: false,
            dateViewed: null,
            assignmentsProgress: [
              {
                assignmentId,
                submitted: true,
                assignmentUrl,
                public_id,
                submissionDate: new Date(),
              },
            ],
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      if (lectureProgress) {
        // Find if this specific assignment is already tracked
        if (!lectureProgress.assignmentsProgress) {
          lectureProgress.assignmentsProgress = [];
        }

        const assignmentProgress = lectureProgress.assignmentsProgress.find(
          (item) => item.assignmentId === assignmentId
        );

        if (assignmentProgress) {
          assignmentProgress.submitted = true;
          assignmentProgress.assignmentUrl = assignmentUrl;
          assignmentProgress.public_id = public_id;
          assignmentProgress.submissionDate = new Date();
        } else {
          lectureProgress.assignmentsProgress.push({
            assignmentId,
            submitted: true,
            assignmentUrl,
            public_id,
            submissionDate: new Date(),
          });
        }
        await progress.save();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: false,
          dateViewed: null,
          assignmentsProgress: [
            {
              assignmentId,
              submitted: true,
              assignmentUrl,
              public_id,
              submissionDate: new Date(),
            },
          ],
        });
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Assignment submitted successfully",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const submitMCQ = async (req, res) => {
  try {
    const { userId, courseId, lectureId, score } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: false,
            dateViewed: null,
            mcqCompleted: true,
            mcqScore: score,
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      if (lectureProgress) {
        lectureProgress.mcqCompleted = true;
        lectureProgress.mcqScore = score;
        await progress.save();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: false,
          dateViewed: null,
          mcqCompleted: true,
          mcqScore: score,
        });
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "MCQ submitted successfully",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
  submitAssignment,
  submitMCQ,
};
