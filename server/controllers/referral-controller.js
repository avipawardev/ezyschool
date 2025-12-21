const Referral = require("../models/Referral");
const GlobalSettings = require("../models/GlobalSettings");
const User = require("../models/User");

// Settings
const getReferralPercentage = async (req, res) => {
  try {
    let setting = await GlobalSettings.findOne({ key: "referralPercentage" });
    if (!setting) {
      // Default to 10% if not set
      setting = new GlobalSettings({ key: "referralPercentage", value: 10 });
      await setting.save();
    }
    res.status(200).json({ success: true, data: setting.value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching settings" });
  }
};

const updateReferralPercentage = async (req, res) => {
  try {
    const { percentage } = req.body;
    await GlobalSettings.findOneAndUpdate(
      { key: "referralPercentage" },
      { value: percentage },
      { upsert: true } // Create if doesn't exist
    );
    res.status(200).json({ success: true, message: "Percentage updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating settings" });
  }
};

// Validate Code
const validateReferralCode = async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findOne({ referralCode: code });
    if (!user) {
      return res.status(200).json({ success: false, message: "Invalid Code" });
    }
    res.status(200).json({ success: true, message: "Valid Code", referrerId: user._id, referrerName: user.userName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error validating code" });
  }
};

// Referrals
const getReferralStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const referrals = await Referral.find({ referrerId: userId }).sort({ date: -1 });
    
    const totalEarnings = referrals.reduce((acc, curr) => acc + curr.amount, 0);
    const paidEarnings = referrals
        .filter(r => r.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({ 
        success: true, 
        data: {
            referrals,
            totalEarnings,
            paidEarnings,
            count: referrals.length
        } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};

const getAllReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find().sort({ date: -1 });
        res.status(200).json({ success: true, data: referrals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching all referrals" });
    }
}

const updateReferralStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Referral.findByIdAndUpdate(id, { status });
        res.status(200).json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
}

module.exports = {
  getReferralPercentage,
  updateReferralPercentage,
  validateReferralCode,
  getReferralStats,
  getAllReferrals,
  updateReferralStatus
};
