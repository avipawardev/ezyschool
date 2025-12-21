const Notification = require("../../models/Notification");
const User = require("../../models/User");

const createNotification = async (req, res) => {
  try {
    const { recipientType, userId, message } = req.body; // recipientType: 'all-students', 'all-instructors', 'specific-user'

    let targetUserIds = [];

    if (recipientType === "specific-user") {
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required for specific user notification",
        });
      }
      targetUserIds = [userId];
    } else if (recipientType === "all-students") {
      const students = await User.find({ role: "student" }, "_id");
      console.log(`Found ${students.length} students`);
      targetUserIds = students.map((user) => user._id.toString());
    } else if (recipientType === "all-instructors") {
      const instructors = await User.find({ role: "instructor" }, "_id");
      console.log(`Found ${instructors.length} instructors`);
      targetUserIds = instructors.map((user) => user._id.toString());
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient type",
      });
    }

    const notifications = targetUserIds.map((targetId) => ({
      userId: targetId,
      message,
      type: "info",
      senderId: "admin", // Assuming admin is sending
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Notifications sent successfully",
      sentCount: notifications.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occured while sending notification",
    });
  }
};

module.exports = { createNotification };
