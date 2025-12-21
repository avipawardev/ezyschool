const express = require("express");
const {
  createOrder,
  verifyPayment,
} = require("../../controllers/student-controller/razorpay-controller");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
