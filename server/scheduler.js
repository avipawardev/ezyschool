const cron = require("node-cron");
const cloudinary = require("./helpers/cloudinary");
const CourseProgress = require("./models/CourseProgress");

const startScheduler = () => {
    // Run every day at midnight: "0 0 * * *"
    // For testing/demo, we can run it every hour: "0 * * * *"
    cron.schedule("0 0 * * *", async () => {
        console.log("Running Assignment Auto-Deletion Scheduler...");
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // Find all progress records containing assignments submitted > 7 days ago
            // Note: This is a simplified query. In a huge DB, you'd want aggregation or more specific indexing.
            // We look for any assignmentProgress element where submissionDate < sevenDaysAgo
            
            // Actually, we probably need to iterate efficiently.
            // Let's fetch docs that *might* have old assignments.
            const candidates = await CourseProgress.find({
                "lecturesProgress.assignmentsProgress.submissionDate": { $lt: sevenDaysAgo }
            });

            console.log(`Found ${candidates.length} candidate records for cleanup.`);

            for (const progress of candidates) {
                let modified = false;

                for (const lecture of progress.lecturesProgress) {
                    for (const assignment of lecture.assignmentsProgress) {
                        if (assignment.submitted && assignment.public_id && assignment.submissionDate && new Date(assignment.submissionDate) < sevenDaysAgo) {
                            console.log(`Deleting expired assignment: ${assignment.public_id}`);
                            
                            // Delete from Cloudinary
                            try {
                                await cloudinary.uploader.destroy(assignment.public_id);
                                
                                // Reset assignment data in DB or just remove the public_id?
                                // User requested "delete from Cloudinary database".
                                // We should probably keep the 'submitted: true' flag but maybe remove the URL so they can't access broken link?
                                // Or maybe we just delete the file to free space, but keep record that they did it?
                                // Let's remove the URL and public_id to indicate file is gone.
                                
                                assignment.assignmentUrl = null;
                                assignment.public_id = null;
                                modified = true;
                                
                            } catch (cloudError) {
                                console.error(`Failed to delete ${assignment.public_id} from Cloudinary:`, cloudError);
                            }
                        }
                    }
                }

                if (modified) {
                    await progress.save();
                }
            }
            
            console.log("Assignment Auto-Deletion Scheduler Finished.");

        } catch (error) {
           console.error("Scheduler Error:", error); 
        }
    });

    console.log("Scheduler initialized.");
}

module.exports = startScheduler;
