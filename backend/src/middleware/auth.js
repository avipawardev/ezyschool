import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token, access denied",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key"
    );
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

const adminAuth = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

export { auth, adminAuth };
