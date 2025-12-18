import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
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
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !userClass ||
      !parentName ||
      !parentPhone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const result = await authService.registerUser({
      name,
      email,
      phone,
      password,
      class: userClass,
      parentName,
      parentPhone,
      address,
      referralCode,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, deviceId } = req.body;

    if (!email || !password || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and deviceId are required",
      });
    }

    const result = await authService.loginUser({ email, password, deviceId });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateUserProfile(req.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.userId);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
