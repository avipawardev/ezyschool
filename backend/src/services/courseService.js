import Course from "../models/Course.js";
import Lecture from "../models/Lecture.js";
import User from "../models/User.js";

export const createCourse = async (courseData, adminId) => {
  const {
    title,
    description,
    price,
    thumbnail,
    class: courseClass,
    subject,
  } = courseData;

  const course = new Course({
    title,
    description,
    price,
    thumbnail,
    class: courseClass,
    subject,
    instructor: adminId,
  });

  await course.save();
  return course;
};

export const getAllCourses = async (filters = {}) => {
  const query = { isActive: true };

  if (filters.class) query.class = filters.class;
  if (filters.subject) query.subject = filters.subject;

  const courses = await Course.find(query)
    .populate("instructor", "name email")
    .sort({ createdAt: -1 });

  return courses;
};

export const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId)
    .populate("instructor", "name email")
    .populate("enrolledStudents", "name email class");

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
};

export const updateCourse = async (courseId, updateData, adminId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.instructor.toString() !== adminId) {
    throw new Error("You do not have permission to update this course");
  }

  Object.assign(course, updateData, { updatedAt: new Date() });
  await course.save();

  return course;
};

export const deleteCourse = async (courseId, adminId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.instructor.toString() !== adminId) {
    throw new Error("You do not have permission to delete this course");
  }

  await Course.findByIdAndDelete(courseId);
  return { success: true, message: "Course deleted successfully" };
};

export const enrollStudentInCourse = async (courseId, studentId) => {
  const course = await Course.findById(courseId);
  const user = await User.findById(studentId);

  if (!course || !user) {
    throw new Error("Course or user not found");
  }

  if (!course.enrolledStudents.includes(studentId)) {
    course.enrolledStudents.push(studentId);
    await course.save();
  }

  if (!user.subscribedCourses.includes(courseId)) {
    user.subscribedCourses.push(courseId);
    user.subscriptionActive = true;
    user.subscriptionValidTill = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ); // 30 days
    await user.save();
  }

  return { success: true, message: "Enrolled successfully" };
};

export const getStudentCourses = async (studentId) => {
  const user = await User.findById(studentId).populate("subscribedCourses");

  if (!user) {
    throw new Error("User not found");
  }

  return user.subscribedCourses;
};

export const getCourseStats = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  const totalLectures = await Lecture.countDocuments({ courseId });

  return {
    courseId,
    title: course.title,
    totalEnrolledStudents: course.enrolledStudents.length,
    totalLectures,
    totalAssignments: course.totalAssignments,
    totalTests: course.totalTests,
  };
};
