import User from "../models/User.js";
import Payment from "../models/Payment.js";
import { calculateReferralCommission } from "../utils/helpers.js";

export const getReferralInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const referredUsers = await User.find({ referredBy: req.userId }).select(
      "name email class createdAt"
    );

    const referralHistory = await Payment.find({
      referrerId: req.userId,
      status: "paid",
    }).populate("userId", "name email");

    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        totalEarnings: user.referralEarnings,
        referredCount: referredUsers.length,
        referredUsers,
        referralHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReferrals = async (req, res, next) => {
  try {
    const referrals = await User.find({
      referralCode: { $exists: true, $ne: null },
    })
      .select("name email referralCode referralEarnings referralHistory")
      .sort({ referralEarnings: -1 });

    const topReferrers = await User.aggregate([
      { $match: { referralCode: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          totalEarnings: { $first: "$referralEarnings" },
          referredCount: {
            $sum: 1,
          },
        },
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        allReferrals: referrals,
        topReferrers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const processReferralPayment = async (req, res, next) => {
  try {
    const { paymentId, referrerId } = req.body;

    if (!paymentId || !referrerId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and Referrer ID are required",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Calculate commission (30%)
    const commission = calculateReferralCommission(payment.amount);

    // Update referrer earnings
    const referrer = await User.findByIdAndUpdate(
      referrerId,
      {
        $inc: { referralEarnings: commission },
        $push: {
          referralHistory: {
            referredUserId: payment.userId,
            earnings: commission,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    // Update payment with referrer info
    payment.referrerId = referrerId;
    payment.referralCommission = commission;
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Referral commission processed",
      data: {
        referrer,
        commission,
      },
    });
  } catch (error) {
    next(error);
  }
};
