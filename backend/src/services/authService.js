import User from "../models/User.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateReferralCode,
} from "../utils/helpers.js";

export const registerUser = async (userData) => {
  const {
    name,
    email,
    phone,
    password,
    class: userClass,
    parentName,
    parentPhone,
    address,
    referralCode,
  } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    throw new Error(
      existingUser.email === email
        ? "Email already registered"
        : "Phone number already registered"
    );
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Find referrer if referral code provided
  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (referrer) {
      referredBy = referrer._id;
    }
  }

  // Create new user
  const user = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    class: userClass,
    parentName,
    parentPhone,
    address,
    referredBy,
    referralCode: generateReferralCode(Date.now() + Math.random()),
    role: "student",
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
    },
  };
};

export const loginUser = async (loginData) => {
  const { email, password, deviceId } = loginData;

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Single device login check
  if (user.deviceId && user.deviceId !== deviceId) {
    throw new Error(
      "This account is already logged in on another device. Please logout from other devices first."
    );
  }

  // Save device ID
  if (!user.deviceId) {
    user.deviceId = deviceId;
    await user.save();
  }

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      subscriptionActive: user.subscriptionActive,
      referralCode: user.referralCode,
      referralEarnings: user.referralEarnings,
    },
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .populate("subscribedCourses", "title thumbnail price")
    .populate("referredBy", "name email");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    class: user.class,
    parentName: user.parentName,
    parentPhone: user.parentPhone,
    address: user.address,
    role: user.role,
    subscriptionActive: user.subscriptionActive,
    subscriptionValidTill: user.subscriptionValidTill,
    referralCode: user.referralCode,
    referralEarnings: user.referralEarnings,
    subscribedCourses: user.subscribedCourses,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
  };
};

export const updateUserProfile = async (userId, updateData) => {
  const { name, parentName, parentPhone, address, profilePicture } = updateData;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      ...(name && { name }),
      ...(parentName && { parentName }),
      ...(parentPhone && { parentPhone }),
      ...(address && { address }),
      ...(profilePicture && { profilePicture }),
      updatedAt: new Date(),
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const logoutUser = async (userId) => {
  // Clear device ID to allow login from another device
  const user = await User.findByIdAndUpdate(
    userId,
    { deviceId: null },
    { new: true }
  );

  return { success: true, message: "Logged out successfully" };
};
