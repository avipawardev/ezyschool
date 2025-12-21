const User = require("../../models/User");
const Course = require("../../models/Course");

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, phoneNumber, address, socialLinks, interests, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        bio,
        phoneNumber,
        address,
        socialLinks,
        interests,
        image,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getCourseSuggestions = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const interests = user.interests || [];
    
    // If no interests, return general popular or random courses (limit 5)
    // For now, if no interests, we return 5 random courses.
    if (interests.length === 0) {
        const randomCourses = await Course.aggregate([{ $sample: { size: 5 } }]);
        return res.status(200).json({
            success: true,
            data: randomCourses
        })
    }

    // Find courses where category matches any of the user's interests
    // We strive for case-insensitive match if possible, but basic $in is good MVP
    const suggestedCourses = await Course.find({
      category: { $in: interests },
      isPublised: true 
    }).limit(5);

    res.status(200).json({
      success: true,
      data: suggestedCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { getUserProfile, updateUserProfile, getCourseSuggestions };
