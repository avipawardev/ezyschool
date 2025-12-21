const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const GlobalSettings = require("../../models/GlobalSettings");
const Referral = require("../../models/Referral");
const User = require("../../models/User");

const createOrder = async (req, res) => {
  try {
    const { coursePricing } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: coursePricing * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating Razorpay order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payload,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Logic to save order to database (similar to PayPal capture)
      // We need to construct the order object from proper request payload
      // But wait, the payload usually comes from the frontend after payment success.
      // Let's assume the frontend sends all necessary course details along with payment details.

      console.log("Verify Payment Payload:", payload);
      const {
        userId,
        userName,
        userEmail,
        orderStatus,
        paymentMethod,
        paymentStatus,
        orderDate,
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing,
      } = payload;
      
      const missingFields = [];
      if (!userId) missingFields.push("userId");
      if (!courseId) missingFields.push("courseId");
      if (!coursePricing) missingFields.push("coursePricing");

      if (missingFields.length > 0) {
          console.error("Missing critical fields in payload:", missingFields);
          return res.status(400).json({
              success: false,
              message: `Invalid payment payload. Missing: ${missingFields.join(", ")}`,
          });
      }

      const newOrder = new Order({
        userId,
        userName,
        userEmail,
        orderStatus: "confirmed",
        paymentMethod,
        paymentStatus: "paid",
        orderDate,
        paymentId: razorpay_payment_id,
        payerId: razorpay_order_id, // Using order_id as payerId equivalent
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing,
      });

      await newOrder.save();

      // Update StudentCourses and Course models
      try {
          const updateStudentCourses = async () => {
              const courseEntry = {
                  courseId,
                  title: courseTitle,
                  instructorId,
                  instructorName,
                  dateOfPurchase: orderDate,
                  courseImage,
              };

              // Use findOneAndUpdate with upsert to handle concurrency and atomic updates
              await StudentCourses.findOneAndUpdate(
                  { userId },
                  { $addToSet: { courses: courseEntry } },
                  { upsert: true, new: true }
              );
          };

          const updateCourse = async () => {
              const studentEntry = {
                  studentId: userId,
                  studentName: userName || "Unknown",
                  studentEmail: userEmail,
                  paidAmount: String(coursePricing),
              };

              const updatedCourse = await Course.findByIdAndUpdate(courseId, {
                  $addToSet: { students: studentEntry },
              }, { new: true });

              if (!updatedCourse) {
                  throw new Error(`Course not found with ID: ${courseId}`);
              }
          };

          // Execute updates in parallel
          await Promise.all([updateStudentCourses(), updateCourse()]);
          
          console.log(`[SUCCESS] Enrollment completed for User: ${userId}, Course: ${courseId}`);

          // Handle Referral Logic
          if (payload.referralCode) {
              try {
                  const referrer = await User.findOne({ referralCode: payload.referralCode });
                  if (referrer && referrer._id.toString() !== userId) {
                      let setting = await GlobalSettings.findOne({ key: "referralPercentage" });
                      const percentage = setting ? setting.value : 10; // Default 10%
                      const commissionAmount = (coursePricing * percentage) / 100;

                      const newReferral = new Referral({
                          referrerId: referrer._id,
                          referrerName: referrer.userName,
                          referrerEmail: referrer.userEmail,
                          referredUserId: userId,
                          referredUserName: userName,
                          referredUserEmail: userEmail,
                          courseId,
                          courseTitle,
                          amount: commissionAmount,
                          commissionPercentage: percentage,
                          status: "pending",
                      });

                      await newReferral.save();
                      console.log(`[SUCCESS] Referral recorded for ${referrer.userName}`);
                  }
              } catch (refError) {
                  console.error("Error processing referral:", refError);
                  // Non-blocking error
              }
          }

      } catch (dbError) {
          console.error("Critical Error: Enrollment failed after payment verification!", dbError);
          // Return 500 so frontend knows something went wrong, even though payment succeeded.
          // In production, this should trigger a high-severity alert.
          return res.status(500).json({
              success: false,
              message: "Payment success, but enrollment data sync failed. Please contact support immediately.",
          });
      }

      res.status(200).json({
        success: true,
        message: "Payment verified and order confirmed",
        data: newOrder,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
    });
  }
};

module.exports = { createOrder, verifyPayment };
