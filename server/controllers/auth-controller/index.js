const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;
  console.log("Register Request Body:", req.body);

  try {
    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(400).json({
        success: false,
        message: "User name or user email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const generatedReferralCode = `${userName.substring(0, 5).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    const newUser = new User({
      userName,
      userEmail,
      role: role || "student",
      password: hashPassword,
      referralCode: generatedReferralCode, 
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  if (checkUser.isDeleted) {
      return res.status(403).json({
          success: false,
          message: "Account is deleted. Please contact support to restore.",
      });
  }

  // Generate Referral Code for existing users if missing
  if (!checkUser.referralCode) {
      checkUser.referralCode = `${checkUser.userName.substring(0, 5).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
      await checkUser.save();
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
        referralCode: checkUser.referralCode,
        phoneNumber: checkUser.phoneNumber,
      },
    },
  });
};



const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { 
            isDeleted: true,
            deletedAt: Date.now()
        });
        
        res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting account" });
    }
}

const checkAuth = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Authenticated user!",
            data: {
                user: {
                    _id: user._id,
                    userName: user.userName,
                    userEmail: user.userEmail,
                    role: user.role,
                    referralCode: user.referralCode,
                    phoneNumber: user.phoneNumber,
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error in checkAuth" });
    }
};

module.exports = { registerUser, loginUser, deleteUserAccount, checkAuth };
