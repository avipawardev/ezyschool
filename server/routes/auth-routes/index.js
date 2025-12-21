const express = require("express");
const {
  registerUser,
  loginUser,
  deleteUserAccount,
  checkAuth,
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete", authenticateMiddleware, deleteUserAccount);
router.get("/check-auth", authenticateMiddleware, checkAuth);

module.exports = router;
