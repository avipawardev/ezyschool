const Notification = require("../../models/Notification");
const User = require("../../models/User");

const createInstructorNotification = async (req, res) => {
  try {
    const { recipientType, userId, message } = req.body; // recipientType: 'all-students', 'specific-user'

    let targetUserIds = [];

    // Instructors cannot send to "all-instructors" and ideally should be restricted to their students,
    // but for now we follow the requirement: "send to students"
    
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
      targetUserIds = students.map((user) => user._id.toString());
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient type or unauthorized recipient",
      });
    }

    const notifications = targetUserIds.map((targetId) => ({
      userId: targetId,
      message,
      type: "info",
      senderId: "instructor",
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Notifications sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occured while sending notification",
    });
  }
};

module.exports = { createInstructorNotification };
