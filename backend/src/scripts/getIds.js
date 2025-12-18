import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Course from "../models/Course.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ezyschool");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const getIds = async () => {
  await connectDB();

  const student = await User.findOne({ role: "student" });
  const course = await Course.findOne({});

  if (student) {
    console.log("\n👤 Student:");
    console.log(`Name: ${student.name}`);
    console.log(`ID: ${student._id}`);
  } else {
    console.log("❌ No student found. Run seedData.js first.");
  }

  if (course) {
    console.log("\n📚 Course:");
    console.log(`Title: ${course.title}`);
    console.log(`ID: ${course._id}`);
  } else {
    console.log("❌ No course found. Run seedData.js first.");
  }

  process.exit();
};

getIds();
