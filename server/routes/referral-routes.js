const express = require("express");
const { 
    getReferralPercentage, 
    updateReferralPercentage, 
    validateReferralCode, 
    getReferralStats, 
    getAllReferrals, 
    updateReferralStatus 
} = require("../controllers/referral-controller");

const router = express.Router();

router.get("/percentage", getReferralPercentage);
router.put("/percentage", updateReferralPercentage);
router.get("/validate/:code", validateReferralCode);
router.get("/stats/:userId", getReferralStats);
router.get("/all", getAllReferrals);
router.put("/status/:id", updateReferralStatus);

module.exports = router;
