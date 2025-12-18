import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { enrollStudentInCourse } from "../services/courseService.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const options = {
      amount: course.price * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const course = await Course.findById(courseId);
    const user = await User.findById(req.userId);
    
    // Default 30 days valid
    const validTill = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const payment = new Payment({
      userId: req.userId,
      courseId: courseId,
      amount: course.price,
      paymentMethod: "razorpay",
      transactionId: razorpay_payment_id,
      status: "paid",
      subscriptionValidTill: validTill,
      paymentGatewayResponse: req.body,
    });

    // Check Referral
    if (user.referredBy) {
      payment.referrerId = user.referredBy;
      payment.referralCommission = Math.floor(course.price * 0.3);

      // Update Referrer
      await User.findByIdAndUpdate(user.referredBy, {
        $inc: { referralEarnings: payment.referralCommission },
        $push: {
          referralHistory: {
            referredUserId: user._id,
            earnings: payment.referralCommission,
            date: new Date(),
          },
        },
      });
    }

    await payment.save();

    // Enroll Student
    await enrollStudentInCourse(courseId, req.userId);

    res.status(200).json({
      success: true,
      message: "Payment verified and Course Enrolled",
      data: { paymentId: payment._id },
    });
  } catch (error) {
    next(error);
  }
};
