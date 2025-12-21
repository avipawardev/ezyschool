const mongoose = require("mongoose");
const User = require("./server/models/User");
const Notification = require("./server/models/Notification");
require("dotenv").config({ path: "./server/.env" });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mern-lms");
        console.log("Connected to DB");

        const students = await User.find({ role: "student" });
        const instructors = await User.find({ role: "instructor" });
        console.log(`Students found: ${students.length}`);
        console.log(`Instructors found: ${instructors.length}`);
        
        const notifications = await Notification.find({});
        console.log(`Notifications found: ${notifications.length}`);
        console.log("Latest notification:", notifications[notifications.length - 1]);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
