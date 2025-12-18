import cron from "node-cron";
import * as whatsappService from "./whatsappService.js";
import { resetMonthlyStats } from "./referralService.js";

// Initialize scheduled tasks
export const initScheduledTasks = () => {
  console.log("⏰ Scheduling system initialized");

  // weekly doubt session reminder - Every Sunday at 10:00 AM
  cron.schedule("0 10 * * 0", () => {
    console.log("Running weekly doubt session reminder...");
    // Logic to fetch students and send reminders would go here
    // Example: whatsappService.broadcast("Don't forget the doubt session today!");
  });

  // Monthly report generation trigger - 1st of every month at 00:00
  cron.schedule("0 0 1 * *", async () => {
    console.log("Running monthly report generation...");
    // Reset referrals
    await resetMonthlyStats();
  });
};

