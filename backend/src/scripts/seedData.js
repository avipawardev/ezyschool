import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { hashPassword, generateReferralCode } from "../utils/helpers.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ezyschool",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create admin user
    const adminPassword = await hashPassword("Admin@123456");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@ezyschool.com",
      phone: "9000000000",
      password: adminPassword,
      class: "12",
      parentName: "Admin Parent",
      parentPhone: "9000000001",
      address: "Admin Address",
      role: "admin",
      referralCode: `ADM${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      subscriptionActive: true,
    });
    console.log("✅ Admin user created:", admin.email);

    // Create student user
    const studentPassword = await hashPassword("Student@123456");
    const student = await User.create({
      name: "Student User",
      email: "student@ezyschool.com",
      phone: "9100000000",
      password: studentPassword,
      class: "10",
      parentName: "Student Parent",
      parentPhone: "9100000001",
      address: "Student Address",
      role: "student",
      referralCode: `STU${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      subscriptionActive: false,
    });
    console.log("✅ Student user created:", student.email);

    // Create sample courses
    const course1 = await Course.create({
      title: "Mathematics 101",
      description: "Learn advanced mathematics concepts",
      instructor: admin._id,
      subject: "Mathematics",
      class: "10",
      price: 299,
      thumbnail: "http://localhost:5001/uploads/math.png",
      enrolledStudents: [student._id],
    });
    console.log(`✅ Course created: ${course1.title}`);

    const course2 = await Course.create({
      title: "Science Fundamentals",
      description: "Explore basic science principles",
      instructor: admin._id,
      subject: "Science",
      class: "10",
      price: 249,
      thumbnail: "http://localhost:5001/uploads/science.png",
      enrolledStudents: [student._id],
    });
    console.log(`✅ Course created: ${course2.title}`);

    const course3 = await Course.create({
      title: "English Literature",
      description: "Master English literature and writing",
      instructor: admin._id,
      subject: "English",
      class: "10",
      price: 199,
      thumbnail: "http://localhost:5001/uploads/english.png",
      enrolledStudents: [],
    });
    console.log(`✅ Course created: ${course3.title}`);

    console.log("\n✨ Seed data created successfully!");
    console.log("\nTest Credentials:");
    console.log("Admin - Email: admin@ezyschool.com, Password: Admin@123456");
    console.log(
      "Student - Email: student@ezyschool.com, Password: Student@123456"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
    process.exit(1);
  }
};

seedData();
