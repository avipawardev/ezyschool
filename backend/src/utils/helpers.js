import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcryptjs.compare(password, hashedPassword);
};

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

export const generateReferralCode = (userId) => {
  // Generate unique referral code based on user ID and timestamp
  const code = `REF${userId.toString().slice(-4).toUpperCase()}${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;
  return code;
};

export const generateDeviceId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const calculateReferralCommission = (amount) => {
  // 30% commission for referrer
  return Math.floor(amount * 0.3);
};
