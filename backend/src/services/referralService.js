import User from "../models/User.js";

export const resetMonthlyStats = async () => {
  try {
    console.log("Resetting monthly referral stats...");
    // Logic to reset monthly counters if they existed. 
    // Currently User model tracks total earnings.
    // If we wanted to track monthly, we would reset a 'monthlyReferrals' field here.
    // For now, we will log this action.
    
    // Example: If there was a leaderboard reset needed
    // await User.updateMany({}, { monthlyReferrals: 0 });
    
    return true;
  } catch (error) {
    console.error("Error resetting monthly stats:", error);
    return false;
  }
};
